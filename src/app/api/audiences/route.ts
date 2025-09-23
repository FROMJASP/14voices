import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-middleware';
import { getPayload } from '@/utilities/payload';
import { resendMarketing } from '@/lib/email/resend-marketing';
import type { Payload, Where } from 'payload';
import type { EmailAudience } from '@/payload-types';
import type { SegmentRules } from '@/types';
import { z } from 'zod';
import { audienceCreateSchema } from '@/lib/validation/schemas';

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';

// Validation schema for GET query parameters
const audienceQuerySchema = z.object({
  active: z.enum(['true', 'false']).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});

async function GETHandler(_req: NextRequest) {
  try {
    const payload = await getPayload();
    const { searchParams } = new URL(_req.url);

    // Validate query parameters
    const validationResult = audienceQuerySchema.safeParse({
      active: searchParams.get('active') || undefined,
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { active, limit, page } = validationResult.data;

    const where: Where = {};
    if (active !== undefined) {
      where.active = { equals: active === 'true' };
    }

    const audiences = await payload.find({
      collection: 'email-audiences',
      where,
      limit,
      page,
      depth: 1,
      sort: '-createdAt',
    });

    return NextResponse.json({
      audiences: audiences.docs,
      totalDocs: audiences.totalDocs,
      totalPages: audiences.totalPages,
      page: audiences.page,
      limit: audiences.limit,
    });
  } catch (error) {
    console.error('Failed to fetch audiences:', error);
    return NextResponse.json({ error: 'Failed to fetch audiences' }, { status: 500 });
  }
}

async function POSTHandler(_req: NextRequest) {
  try {
    const payload = await getPayload();
    const data = await _req.json();

    // Validate request body
    const validationResult = audienceCreateSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid audience data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    let resendAudienceId = null;
    if (data.syncWithResend) {
      try {
        const resendAudience = await resendMarketing.createAudience({
          name: data.name,
        });
        resendAudienceId = resendAudience?.id || null;
      } catch (error) {
        console.error('Failed to create Resend audience:', error);
      }
    }

    const audience = await payload.create({
      collection: 'email-audiences',
      data: {
        ...data,
        resendAudienceId,
      },
    });

    if (data.type === 'dynamic' && data.segmentRules) {
      await updateDynamicAudienceContacts(payload, audience as unknown as EmailAudience);
    }

    return NextResponse.json({ audience });
  } catch (error) {
    console.error('Failed to create audience:', error);
    return NextResponse.json({ error: 'Failed to create audience' }, { status: 500 });
  }
}

async function updateDynamicAudienceContacts(payload: Payload, audience: EmailAudience) {
  try {
    // Convert Payload's segmentRules to our SegmentRules type
    const segmentRules: SegmentRules | undefined = audience.segmentRules
      ? {
          rules:
            audience.segmentRules.rules?.map((rule) => ({
              field: rule.field,
              operator: rule.operator,
              value: rule.value || undefined,
              customField: rule.customField || undefined,
            })) || [],
          logic: audience.segmentRules.logic || 'all',
        }
      : undefined;

    const contacts = await payload.find({
      collection: 'email-contacts',
      where: buildDynamicQuery(segmentRules),
      limit: 1000,
    });

    await payload.update({
      collection: 'email-audiences',
      id: audience.id,
      data: {
        contactCount: contacts.totalDocs,
      },
    });

    return contacts.docs;
  } catch (error) {
    console.error('Failed to update dynamic audience contacts:', error);
    return [];
  }
}

function buildDynamicQuery(segmentRules: SegmentRules | undefined): Where {
  const where: Where = {};

  if (!segmentRules?.rules || segmentRules.rules.length === 0) {
    return where;
  }

  const conditions = segmentRules.rules.map((rule: SegmentRules['rules'][0]) => {
    const condition: Where = {};

    switch (rule.field) {
      case 'tags':
        if (rule.operator === 'contains') {
          condition['tags.tag'] = { contains: rule.value };
        } else if (rule.operator === 'not_contains') {
          condition['tags.tag'] = { not_equals: rule.value };
        }
        break;

      case 'location':
        if (rule.operator === 'equals') {
          condition['location.country'] = { equals: rule.value };
        }
        break;

      case 'engagement':
        if (rule.operator === 'greater_than') {
          condition['engagement.engagementScore'] = { greater_than: parseInt(rule.value || '0') };
        } else if (rule.operator === 'less_than') {
          condition['engagement.engagementScore'] = { less_than: parseInt(rule.value || '0') };
        }
        break;

      case 'signupDate':
        const date = new Date(rule.value || '');
        if (rule.operator === 'greater_than') {
          condition['source.signupDate'] = { greater_than: date };
        } else if (rule.operator === 'less_than') {
          condition['source.signupDate'] = { less_than: date };
        }
        break;
    }

    return condition;
  });

  if (segmentRules.logic === 'any') {
    where.or = conditions;
  } else {
    Object.assign(where, ...conditions);
  }

  return where;
}

export const GET = withAuth(GETHandler);
export const POST = withAuth(POSTHandler);
