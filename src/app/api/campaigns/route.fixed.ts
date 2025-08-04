import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from '@/utilities/payload';
// import type { Where } from 'payload';
import { z } from 'zod';
import { campaignCreateSchema } from '@/lib/validation/schemas';
import { withAuth, withAdminAuth } from '@/lib/auth-middleware';
import { SecureQueryBuilder } from '@/lib/secure-queries';
import { validateInput } from '@/config/security';

// Validation schema for GET query parameters
const campaignQuerySchema = z.object({
  status: z.enum(['draft', 'sending', 'sent', 'scheduled', 'failed']).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});

// GET campaigns - requires authentication
export const GET = withAuth(async (req: NextRequest) => {
  try {
    const payload = await getPayload();
    const { searchParams } = new URL(req.url);

    // Validate query parameters
    const validationResult = campaignQuerySchema.safeParse({
      status: searchParams.get('status') || undefined,
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { status, limit, page } = validationResult.data;

    // Use secure query builder
    const queryBuilder = new SecureQueryBuilder();
    if (status) {
      queryBuilder.equals('status', status);
    }

    const campaigns = await payload.find({
      collection: 'email-campaigns',
      where: queryBuilder.build(),
      limit,
      page,
      depth: 2,
      sort: '-createdAt',
    });

    return NextResponse.json({
      campaigns: campaigns.docs,
      totalDocs: campaigns.totalDocs,
      totalPages: campaigns.totalPages,
      page: campaigns.page,
      limit: campaigns.limit,
    });
  } catch (error) {
    console.error('Failed to fetch campaigns:', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}, {
  rateLimit: 'public'
});

// POST campaign - requires admin authentication
export const POST = withAdminAuth(async (req: NextRequest) => {
  try {
    const payload = await getPayload();
    const data = await req.json();

    // Validate request body
    const validationResult = campaignCreateSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid campaign data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    // Additional input sanitization for string fields
    const sanitizedData = {
      ...validationResult.data,
      name: validateInput(validationResult.data.name, { maxLength: 200, stripHtml: true }).sanitized,
      subject: validateInput(validationResult.data.subject, { maxLength: 500, stripHtml: true }).sanitized,
    };

    const campaign = await payload.create({
      collection: 'email-campaigns',
      data: sanitizedData,
      user: (req as any).user, // Add user context for audit trail
    });

    return NextResponse.json({ campaign });
  } catch (error) {
    console.error('Failed to create campaign:', error);
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}, {
  rateLimit: 'admin'
});