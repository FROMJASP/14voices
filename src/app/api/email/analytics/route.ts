import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from '@/utilities/payload';
import { getServerSideUser } from '@/utilities/payload';
import { z } from 'zod';

function getDateRange(range: string): Date {
  const now = new Date();

  switch (range) {
    case '24h':
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case '90d':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }
}

// Validation schema for query parameters
const analyticsQuerySchema = z.object({
  range: z.enum(['24h', '7d', '30d', '90d']).optional().default('7d'),
});

export async function GET(req: NextRequest) {
  try {
    const user = await getServerSideUser();

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

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
    const startDate = getDateRange(range);

    const payload = await getPayload();

    // Fetch all email logs within date range
    const emailLogs = await payload.find({
      collection: 'email-logs',
      where: {
        sentAt: {
          greater_than_equal: startDate,
        },
      },
      limit: 10000,
      depth: 1,
    });

    // Calculate overall stats
    const totalSent = emailLogs.totalDocs;
    const totalDelivered = emailLogs.docs.filter((log) =>
      ['delivered', 'opened', 'clicked'].includes(log.status)
    ).length;
    const totalOpened = emailLogs.docs.filter((log) =>
      ['opened', 'clicked'].includes(log.status)
    ).length;
    const totalClicked = emailLogs.docs.filter((log) => log.status === 'clicked').length;
    const totalBounced = emailLogs.docs.filter((log) => log.status === 'bounced').length;

    const openRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0;
    const clickRate = totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0;
    const bounceRate = totalSent > 0 ? (totalBounced / totalSent) * 100 : 0;

    // Calculate stats by template
    interface TemplateStats {
      templateName: string;
      sent: number;
      delivered: number;
      opened: number;
      clicked: number;
    }
    const templateMap = new Map<string, TemplateStats>();

    emailLogs.docs.forEach((log) => {
      const templateId = log.template?.id || 'unknown';
      const templateName = log.template?.name || 'Unknown Template';

      if (!templateMap.has(templateId)) {
        templateMap.set(templateId, {
          templateName,
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
        });
      }

      const stats = templateMap.get(templateId);
      if (stats) {
        stats.sent++;

        if (['delivered', 'opened', 'clicked'].includes(log.status)) {
          stats.delivered++;
        }
        if (['opened', 'clicked'].includes(log.status)) {
          stats.opened++;
        }
        if (log.status === 'clicked') {
          stats.clicked++;
        }
      }
    });

    const templateStats = Array.from(templateMap.values()).map((stats) => ({
      ...stats,
      openRate: stats.sent > 0 ? (stats.opened / stats.sent) * 100 : 0,
      clickRate: stats.opened > 0 ? (stats.clicked / stats.opened) * 100 : 0,
    }));

    return NextResponse.json({
      overall: {
        totalSent,
        totalDelivered,
        totalOpened,
        totalClicked,
        totalBounced,
        openRate,
        clickRate,
        bounceRate,
      },
      byTemplate: templateStats,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
