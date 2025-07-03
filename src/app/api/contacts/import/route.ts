import { NextRequest, NextResponse } from 'next/server';
import { getPayload, getServerSideUser } from '@/utilities/payload';
import { contactImportSchema } from '@/lib/validation/schemas';
import { validateRequest } from '@/lib/api-security';

async function handler(req: NextRequest) {
  try {
    // Validate request
    const validatedData = await validateRequest(req, contactImportSchema);
    const { contacts, audienceId, skipDuplicates } = validatedData;

    const payload = await getPayload();

    // Additional security check for large imports
    if (contacts.length > 100) {
      // For large imports, require admin role
      const user = await payload.auth({ headers: req.headers });
      if (!user || !user.user?.roles?.includes('admin')) {
        return NextResponse.json(
          { error: 'Large imports require admin privileges' },
          { status: 403 }
        );
      }
    }

    const results = {
      imported: 0,
      updated: 0,
      failed: 0,
      errors: [] as { email: string; error: string }[],
    };

    for (const contactData of contacts) {
      try {
        const existingContact = await payload.find({
          collection: 'email-contacts',
          where: {
            email: {
              equals: contactData.email,
            },
          },
          limit: 1,
        });

        if (existingContact.totalDocs > 0) {
          if (!skipDuplicates) {
            // Update existing contact with validated data only
            const updateData: Record<string, unknown> = {};
            if (contactData.firstName) updateData.firstName = contactData.firstName;
            if (contactData.lastName) updateData.lastName = contactData.lastName;
            if (contactData.tags)
              updateData.tags = contactData.tags.map((tag: string) => ({ tag }));
            if (contactData.customFields) updateData.customFields = contactData.customFields;

            await payload.update({
              collection: 'email-contacts',
              id: existingContact.docs[0].id,
              data: updateData,
            });
            results.updated++;
          } else {
            results.errors.push({
              email: contactData.email,
              error: 'Contact already exists (skipped)',
            });
            results.failed++;
          }
        } else {
          await payload.create({
            collection: 'email-contacts',
            data: {
              email: contactData.email,
              firstName: contactData.firstName || '',
              lastName: contactData.lastName || '',
              tags: contactData.tags?.map((tag: string) => ({ tag })) || [],
              customFields: contactData.customFields || {},
              subscribed: true,
              source: {
                type: 'import',
                detail: 'API bulk import',
                signupDate: new Date(),
              },
            },
          });
          results.imported++;
        }
      } catch (error) {
        results.failed++;
        results.errors.push({
          email: contactData.email,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    if (audienceId && results.imported > 0) {
      try {
        // Validate audience ID format
        if (typeof audienceId !== 'string' || audienceId.length > 100) {
          throw new Error('Invalid audience ID');
        }

        const audience = await payload.findByID({
          collection: 'email-audiences',
          id: audienceId,
        });

        if (audience && audience.type === 'static') {
          const newContacts = await payload.find({
            collection: 'email-contacts',
            where: {
              email: {
                in: contacts.map((c) => c.email),
              },
            },
            limit: 1000,
          });

          const existingContacts = audience.contacts || [];
          const contactIds = [
            ...new Set([
              ...existingContacts.map((c: string | { id: string }) =>
                typeof c === 'string' ? c : c.id
              ),
              ...newContacts.docs.map((c) => c.id),
            ]),
          ];

          await payload.update({
            collection: 'email-audiences',
            id: audienceId,
            data: {
              contacts: contactIds,
              contactCount: contactIds.length,
            },
          });
        }
      } catch (error) {
        console.error('Failed to update audience:', error);
      }
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('Failed to import contacts:', error);

    // Handle validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Invalid import data', details: (error as Error & { errors?: unknown }).errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to import contacts' }, { status: 500 });
  }
}

// Export with security middleware
export async function POST(req: NextRequest) {
  // Simple auth check
  const user = await getServerSideUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Call the handler
  const response = await handler(req);

  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}
