import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-middleware';
import { getPayload, getServerSideUser } from '@/utilities/payload';
import { resendMarketing } from '@/lib/email/resend-marketing';
import type { EmailContact, SegmentRules } from '@/types/email-marketing';
import type { Where } from 'payload';
import { audienceSyncSchema } from '@/lib/validation/schemas';

async function handler(req: NextRequest) {
  try {
    const payload = await getPayload();
    const body = await req.json();

    // Validate input
    const validationResult = audienceSyncSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { audienceId } = validationResult.data;

    const audience = await payload.findByID({
      collection: 'email-audiences',
      id: audienceId,
      depth: 2,
    });

    if (!audience) {
      return NextResponse.json({ error: 'Audience not found' }, { status: 404 });
    }

    let resendAudienceId = audience.resendAudienceId;

    if (!resendAudienceId) {
      try {
        const resendAudience = await resendMarketing.createAudience({
          name: audience.name,
        });
        resendAudienceId = resendAudience?.id || '';

        await payload.update({
          collection: 'email-audiences',
          id: audienceId,
          data: {
            resendAudienceId,
          },
        });
      } catch (createError) {
        console.error('Failed to create Resend audience:', createError);
        return NextResponse.json({ error: 'Failed to create Resend audience' }, { status: 500 });
      }
    }

    let contacts: EmailContact[] = [];

    if (audience.type === 'static' && audience.contacts) {
      // Ensure contacts are properly populated
      if (Array.isArray(audience.contacts) && audience.contacts.length > 0) {
        if (typeof audience.contacts[0] === 'string') {
          // If contacts are IDs, fetch them in a single query
          const result = await payload.find({
            collection: 'email-contacts',
            where: {
              id: {
                in: audience.contacts as string[],
              },
            },
            limit: 1000,
            depth: 0,
          });
          contacts = result.docs as EmailContact[];
        } else {
          contacts = audience.contacts as EmailContact[];
        }
      }
    } else if (audience.type === 'dynamic') {
      const result = await payload.find({
        collection: 'email-contacts',
        where: buildDynamicQuery(audience.segmentRules),
        limit: 1000,
      });
      contacts = result.docs as EmailContact[];
    } else if (audience.type === 'all') {
      const result = await payload.find({
        collection: 'email-contacts',
        where: {
          subscribed: {
            equals: true,
          },
        },
        limit: 1000,
      });
      contacts = result.docs as EmailContact[];
    }

    const syncResults = {
      synced: 0,
      failed: 0,
      errors: [] as { contactId: string; email: string; error: string }[],
    };

    // Batch process contacts to reduce API calls and database operations
    const batchSize = 50;
    const contactBatches = [];
    for (let i = 0; i < contacts.length; i += batchSize) {
      contactBatches.push(contacts.slice(i, i + batchSize));
    }

    for (const batch of contactBatches) {
      const promises = batch.map(async (contact) => {
        try {
          if (!contact.resendContactId) {
            const resendContact = await resendMarketing.createContact({
              email: contact.email,
              firstName: contact.firstName,
              lastName: contact.lastName,
              unsubscribed: !contact.subscribed,
              audienceId: resendAudienceId,
            });

            await payload.update({
              collection: 'email-contacts',
              id: contact.id,
              data: {
                resendContactId: resendContact?.id || '',
              },
            });
          } else {
            await resendMarketing.updateContact({
              id: contact.resendContactId,
              audienceId: resendAudienceId,
              firstName: contact.firstName,
              lastName: contact.lastName,
              unsubscribed: !contact.subscribed,
            });
          }

          return { success: true, contact };
        } catch (error) {
          return {
            success: false,
            contact,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      });

      const results = await Promise.all(promises);

      results.forEach((result) => {
        if (result.success) {
          syncResults.synced++;
        } else {
          syncResults.failed++;
          syncResults.errors.push({
            contactId: result.contact.id,
            email: result.contact.email,
            error: result.error || 'Unknown error',
          });
        }
      });
    }

    await payload.update({
      collection: 'email-audiences',
      id: audienceId,
      data: {
        contactCount: contacts.length,
        'syncStatus.lastSyncedAt': new Date(),
        'syncStatus.syncError':
          syncResults.failed > 0 ? `Failed to sync ${syncResults.failed} contacts` : null,
      },
    });

    return NextResponse.json({
      success: true,
      audienceId: resendAudienceId,
      syncResults,
    });
  } catch (error) {
    console.error('Failed to sync audience:', error);
    return NextResponse.json({ error: 'Failed to sync audience' }, { status: 500 });
  }
}

function buildDynamicQuery(segmentRules: SegmentRules | undefined): Where {
  const where: Where = {};

  if (!segmentRules?.rules || segmentRules.rules.length === 0) {
    return where;
  }

  // Validate and sanitize rules to prevent injection
  const validFields = ['tags', 'location', 'engagement', 'signupDate'];
  const validOperators = ['contains', 'not_contains', 'equals', 'greater_than', 'less_than'];

  const conditions = segmentRules.rules
    .filter((rule) => {
      // Validate field and operator are from allowed list
      return validFields.includes(rule.field) && validOperators.includes(rule.operator);
    })
    .map((rule) => {
      const condition: Where = {};

      // Sanitize value to prevent injection
      const sanitizedValue = String(rule.value || '').slice(0, 1000);

      switch (rule.field) {
        case 'tags':
          if (rule.operator === 'contains') {
            condition['tags.tag'] = { contains: sanitizedValue };
          } else if (rule.operator === 'not_contains') {
            condition['tags.tag'] = { not_equals: sanitizedValue };
          }
          break;

        case 'location':
          if (rule.operator === 'equals') {
            // Validate country code format
            const countryCode = sanitizedValue.toUpperCase().slice(0, 2);
            if (/^[A-Z]{2}$/.test(countryCode)) {
              condition['location.country'] = { equals: countryCode };
            }
          }
          break;

        case 'engagement':
          // Safely parse integer with bounds checking
          const score = Math.max(0, Math.min(100, parseInt(sanitizedValue || '0', 10) || 0));
          if (rule.operator === 'greater_than') {
            condition['engagement.engagementScore'] = { greater_than: score };
          } else if (rule.operator === 'less_than') {
            condition['engagement.engagementScore'] = { less_than: score };
          }
          break;

        case 'signupDate':
          // Validate date format
          const dateStr = sanitizedValue.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
          if (dateStr) {
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
              if (rule.operator === 'greater_than') {
                condition['source.signupDate'] = { greater_than: date };
              } else if (rule.operator === 'less_than') {
                condition['source.signupDate'] = { less_than: date };
              }
            }
          }
          break;
      }

      return condition;
    })
    .filter((condition) => Object.keys(condition).length > 0); // Remove empty conditions

  if (segmentRules.logic === 'any' && conditions.length > 0) {
    where.or = conditions;
  } else if (conditions.length > 0) {
    Object.assign(where, ...conditions);
  }

  return where;
}

// Export the handler with middleware
async function POSTHandler(_req: NextRequest) {
  // Simple auth check
  const user = await getServerSideUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Call the handler
  const response = await handler(_req);

  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

export const POST = withAuth(POSTHandler);
