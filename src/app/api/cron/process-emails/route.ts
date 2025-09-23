import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getPayload } from '@/utilities/payload';
import { withPublicAuth } from '@/lib/auth-middleware';
import {
  processScheduledEmails,
  getEmailQueueStats,
  retryFailedEmails,
  cleanupOldEmailJobs,
} from '@/lib/email/sequences';
import { z } from 'zod';

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';
// Validation schema for query parameters
const cronQuerySchema = z.object({
  action: z.enum(['process', 'retry', 'stats', 'cleanup']).optional().default('process'),
  limit: z.coerce.number().int().min(1).max(10000).optional().default(1000),
  days: z.coerce.number().int().min(1).max(365).optional().default(30),
});

async function GETHandler(request: Request) {
  const startTime = Date.now();

  try {
    const headersList = await headers();
    const authHeader = headersList.get('authorization');

    // Verify cron secret (for Vercel Cron or similar)
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    // Validate query parameters
    const validationResult = cronQuerySchema.safeParse({
      action: searchParams.get('action') || undefined,
      limit: searchParams.get('limit') || undefined,
      days: searchParams.get('days') || undefined,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { action, limit, days } = validationResult.data;

    const payload = await getPayload();

    let result: unknown = {};

    switch (action) {
      case 'process':
        // Process scheduled emails with configurable limit
        result = await processScheduledEmails(payload, limit);
        break;

      case 'retry':
        // Retry failed emails
        result = await retryFailedEmails(payload, limit);
        break;

      case 'stats':
        // Get queue statistics
        result = await getEmailQueueStats(payload);
        break;

      case 'cleanup':
        // Clean up old sent/cancelled jobs
        const deletedCount = await cleanupOldEmailJobs(payload, days);
        result = { deletedCount };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      action,
      result,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Email processing error:', error);

    // Log detailed error information
    const errorDetails = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      duration: `${Date.now() - startTime}ms`,
    };

    console.error('Error details:', errorDetails);

    return NextResponse.json(
      {
        error: 'Email processing failed',
        details: process.env.NODE_ENV === 'development' ? errorDetails : undefined,
      },
      { status: 500 }
    );
  }
}

// Validation schema for POST body
const cronBodySchema = z.object({
  action: z.enum(['process', 'retry', 'cleanup']).optional().default('process'),
  limit: z.number().int().min(1).max(10000).optional().default(1000),
  daysToKeep: z.number().int().min(1).max(365).optional().default(30),
});

// Optional: POST endpoint for manual triggers
async function POSTHandler(request: Request) {
  try {
    const headersList = await headers();
    const authHeader = headersList.get('authorization');

    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate request body
    const validationResult = cronBodySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { action, limit, daysToKeep } = validationResult.data;

    const payload = await getPayload();
    let result: unknown = {};

    switch (action) {
      case 'process':
        result = await processScheduledEmails(payload, limit);
        break;

      case 'retry':
        result = await retryFailedEmails(payload, limit);
        break;

      case 'cleanup':
        const deletedCount = await cleanupOldEmailJobs(payload, daysToKeep);
        result = { deletedCount };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      action,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Email processing error:', error);
    return NextResponse.json({ error: 'Email processing failed' }, { status: 500 });
  }
}

export const GET = withPublicAuth(GETHandler, { rateLimit: 'cron', skipCSRF: true });
export const POST = withPublicAuth(POSTHandler, { rateLimit: 'cron', skipCSRF: true });
