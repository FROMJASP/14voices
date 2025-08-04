import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-middleware';
import { getPayload } from '@/utilities/payload';
import type { Where } from 'payload';
import { z } from 'zod';
import { campaignCreateSchema } from '@/lib/validation/schemas';

// Validation schema for GET query parameters
const campaignQuerySchema = z.object({
  status: z.enum(['draft', 'sending', 'sent', 'scheduled', 'failed']).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});

async function GETHandler(_req: NextRequest) {
  try {
    const payload = await getPayload();
    const { searchParams } = new URL(_req.url);

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

    const where: Where = {};
    if (status) {
      where.status = { equals: status };
    }

    const campaigns = await payload.find({
      collection: 'email-campaigns',
      where,
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
}

async function POSTHandler(_req: NextRequest) {
  try {
    const payload = await getPayload();
    const data = await _req.json();

    // Validate request body
    const validationResult = campaignCreateSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid campaign data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const campaign = await payload.create({
      collection: 'email-campaigns',
      data,
    });

    return NextResponse.json({ campaign });
  } catch (error) {
    console.error('Failed to create campaign:', error);
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}

export const GET = withAuth(GETHandler);
export const POST = withAuth(POSTHandler);
