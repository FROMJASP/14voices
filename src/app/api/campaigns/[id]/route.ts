import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from '@/utilities/payload';
import { z } from 'zod';
import { idSchema, campaignUpdateSchema } from '@/lib/validation/schemas';

// Parameter validation schema
const paramsSchema = z.object({
  id: idSchema,
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;

    // Validate parameters
    const validationResult = paramsSchema.safeParse(resolvedParams);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid campaign ID', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { id } = validationResult.data;
    const payload = await getPayload();

    const campaign = await payload.findByID({
      collection: 'email-campaigns',
      id,
      depth: 2,
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    return NextResponse.json({ campaign });
  } catch (error) {
    console.error('Failed to fetch campaign:', error);
    return NextResponse.json({ error: 'Failed to fetch campaign' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const body = await req.json();

    // Validate parameters
    const paramsValidation = paramsSchema.safeParse(resolvedParams);
    if (!paramsValidation.success) {
      return NextResponse.json(
        { error: 'Invalid campaign ID', details: paramsValidation.error.errors },
        { status: 400 }
      );
    }

    // Validate request body
    const bodyValidation = campaignUpdateSchema.safeParse(body);
    if (!bodyValidation.success) {
      return NextResponse.json(
        { error: 'Invalid update data', details: bodyValidation.error.errors },
        { status: 400 }
      );
    }

    const { id } = paramsValidation.data;
    const data = bodyValidation.data;
    const payload = await getPayload();

    const campaign = await payload.update({
      collection: 'email-campaigns',
      id,
      data,
    });

    return NextResponse.json({ campaign });
  } catch (error) {
    console.error('Failed to update campaign:', error);
    return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;

    // Validate parameters
    const validationResult = paramsSchema.safeParse(resolvedParams);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid campaign ID', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { id } = validationResult.data;
    const payload = await getPayload();

    await payload.delete({
      collection: 'email-campaigns',
      id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete campaign:', error);
    return NextResponse.json({ error: 'Failed to delete campaign' }, { status: 500 });
  }
}
