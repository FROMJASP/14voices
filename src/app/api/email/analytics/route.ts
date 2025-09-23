import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-middleware';
import { getPayload } from '@/utilities/payload';
import { getServerSideUser } from '@/utilities/payload';
import { z } from 'zod';
import { EmailService, DateRange } from '@/domains/email';

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';
// Validation schema for query parameters
const analyticsQuerySchema = z.object({
  range: z.enum(['24h', '7d', '30d', '90d']).optional().default('7d'),
});

async function GETHandler(_req: NextRequest) {
  try {
    const user = await getServerSideUser();

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(_req.url);

    // Validate query parameters
    const validationResult = analyticsQuerySchema.safeParse({
      range: searchParams.get('range') || undefined,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { range } = validationResult.data;
    const payload = await getPayload();

    // Use the domain service
    const emailService = new EmailService(payload);
    const analytics = await emailService.getAnalytics(range as DateRange);

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

export const GET = withAuth(GETHandler);
