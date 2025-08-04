import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getPayload } from '@/utilities/payload';
import { getEmailQueueStats } from '@/lib/email/sequences';
import { z } from 'zod';
import { withAdminAuth } from '@/lib/auth-middleware';

// Validation schema for query parameters
const emailStatsQuerySchema = z.object({
  period: z.enum(['hour', 'day', 'week', 'month']).optional().default('day'),
});

async function GETHandler(request: Request) {
  try {
    const headersList = await headers();
    const authHeader = headersList.get('authorization');

    // Check admin authentication (you may want to use your existing auth system)
    if (process.env.ADMIN_SECRET && authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    // Validate query parameters
    const validationResult = emailStatsQuerySchema.safeParse({
      period: searchParams.get('period') || undefined,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { period } = validationResult.data;
    const payload = await getPayload();

    // Get current queue stats
    const queueStats = await getEmailQueueStats(payload);

    // Get performance metrics for the period
    const now = new Date();
    const startDate = new Date();

    switch (period) {
      case 'hour':
        startDate.setHours(now.getHours() - 1);
        break;
      case 'day':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
    }

    // Get email logs for the period
    const emailLogs = await payload.find({
      collection: 'email-logs',
      where: {
        sentAt: {
          greater_than: startDate,
        },
      },
      limit: 0, // We just want the count
    });

    // Get failed jobs for the period
    const failedJobs = await payload.find({
      collection: 'email-jobs',
      where: {
        status: {
          equals: 'failed',
        },
        lastAttempt: {
          greater_than: startDate,
        },
      },
      limit: 100,
      sort: '-lastAttempt',
    });

    // Calculate delivery rate
    const totalAttempted = emailLogs.totalDocs + failedJobs.totalDocs;
    const deliveryRate =
      totalAttempted > 0 ? ((emailLogs.totalDocs / totalAttempted) * 100).toFixed(2) : '0.00';

    // Get template performance by fetching all logs and grouping manually
    const allLogs = await payload.find({
      collection: 'email-logs',
      where: {
        sentAt: {
          greater_than: startDate,
        },
      },
      limit: 1000,
      sort: '-sentAt',
    });

    // Group by template
    const templateStatsMap = new Map<
      string,
      {
        count: number;
        firstSent: Date;
        lastSent: Date;
      }
    >();

    allLogs.docs.forEach((log) => {
      const template = log.template || 'unknown';
      const existing = templateStatsMap.get(template);

      if (existing) {
        existing.count++;
        if (log.sentAt < existing.firstSent) {
          existing.firstSent = log.sentAt;
        }
        if (log.sentAt > existing.lastSent) {
          existing.lastSent = log.sentAt;
        }
      } else {
        templateStatsMap.set(template, {
          count: 1,
          firstSent: log.sentAt,
          lastSent: log.sentAt,
        });
      }
    });

    const templateStats = Array.from(templateStatsMap.entries())
      .map(([template, stats]) => ({
        _id: template,
        ...stats,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Get sequence performance by fetching jobs and grouping manually
    const allJobs = await payload.find({
      collection: 'email-jobs',
      where: {
        and: [
          {
            sequence: {
              exists: true,
            },
          },
          {
            updatedAt: {
              greater_than: startDate,
            },
          },
        ],
      },
      limit: 1000,
      sort: '-updatedAt',
    });

    // Group by sequence and status
    const sequenceStatsMap = new Map<string, Map<string, number>>();

    allJobs.docs.forEach((job) => {
      const sequence = job.sequence || 'unknown';
      const status = job.status || 'unknown';

      if (!sequenceStatsMap.has(sequence)) {
        sequenceStatsMap.set(sequence, new Map());
      }

      const sequenceMap = sequenceStatsMap.get(sequence)!;
      sequenceMap.set(status, (sequenceMap.get(status) || 0) + 1);
    });

    const sequenceStats = Array.from(sequenceStatsMap.entries())
      .map(([sequence, statusMap]) => {
        const stats = Array.from(statusMap.entries()).map(([status, count]) => ({
          status,
          count,
        }));
        const total = stats.reduce((sum, stat) => sum + stat.count, 0);

        return {
          _id: sequence,
          stats,
          total,
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    // Calculate throughput
    const periodHours = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    const emailsPerHour = emailLogs.totalDocs / periodHours;
    const emailsPerMinute = emailsPerHour / 60;

    return NextResponse.json({
      success: true,
      period,
      stats: {
        queue: queueStats,
        performance: {
          sent: emailLogs.totalDocs,
          failed: failedJobs.totalDocs,
          deliveryRate: `${deliveryRate}%`,
          throughput: {
            perHour: Math.round(emailsPerHour),
            perMinute: emailsPerMinute.toFixed(2),
          },
        },
        templates: templateStats,
        sequences: sequenceStats,
        recentFailures: failedJobs.docs.map((job) => ({
          id: job.id,
          recipient: job.recipient.email,
          template: job.template.name || job.template.key,
          error: job.error,
          attempts: job.attempts,
          lastAttempt: job.lastAttempt,
        })),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Email stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch email statistics' }, { status: 500 });
  }
}

export const GET = withAdminAuth(GETHandler, { rateLimit: 'admin' });
