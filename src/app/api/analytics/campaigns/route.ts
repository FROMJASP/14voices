import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from '@/utilities/payload';
import type { EmailLog } from '@/types/email-marketing';
import { z } from 'zod';
import { idSchema, dateSchema } from '@/lib/validation/schemas';

// Validation schema for query parameters
const analyticsQuerySchema = z.object({
  campaignId: idSchema.optional(),
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
});

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload();
    const { searchParams } = new URL(req.url);

    // Validate query parameters
    const validationResult = analyticsQuerySchema.safeParse({
      campaignId: searchParams.get('campaignId') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { campaignId, startDate, endDate } = validationResult.data;

    if (campaignId) {
      const campaign = await payload.findByID({
        collection: 'email-campaigns',
        id: campaignId,
        depth: 2,
      });

      if (!campaign) {
        return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
      }

      const logs = await payload.find({
        collection: 'email-logs',
        where: {
          and: [
            {
              'metadata.campaignId': {
                equals: campaignId,
              },
            },
            ...(startDate
              ? [
                  {
                    sentAt: {
                      greater_than_equal: new Date(startDate),
                    },
                  },
                ]
              : []),
            ...(endDate
              ? [
                  {
                    sentAt: {
                      less_than_equal: new Date(endDate),
                    },
                  },
                ]
              : []),
          ],
        },
        limit: 1000,
      });

      const analytics = calculateCampaignAnalytics(logs.docs as EmailLog[]);

      return NextResponse.json({
        campaign: {
          id: campaign.id,
          name: campaign.name,
          subject: campaign.subject,
          status: campaign.status,
          sentAt: campaign.analytics?.sentAt,
        },
        analytics,
        logs: logs.docs,
      });
    } else {
      const campaigns = await payload.find({
        collection: 'email-campaigns',
        where: {
          status: {
            not_equals: 'draft',
          },
        },
        sort: '-createdAt',
        limit: 20,
      });

      const campaignAnalytics = await Promise.all(
        campaigns.docs.map(async (campaign) => {
          const logs = await payload.find({
            collection: 'email-logs',
            where: {
              'metadata.campaignId': {
                equals: campaign.id,
              },
            },
            limit: 1000,
          });

          return {
            campaign: {
              id: campaign.id,
              name: campaign.name,
              subject: campaign.subject,
              status: campaign.status,
              sentAt: campaign.scheduledAt,
            },
            analytics: calculateCampaignAnalytics(logs.docs as EmailLog[]),
          };
        })
      );

      return NextResponse.json({
        campaigns: campaignAnalytics,
      });
    }
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

function calculateCampaignAnalytics(logs: EmailLog[]) {
  const total = logs.length;
  const sent = logs.filter(
    (log) =>
      log.status === 'sent' ||
      log.status === 'delivered' ||
      log.status === 'opened' ||
      log.status === 'clicked'
  ).length;
  const delivered = logs.filter(
    (log) => log.status === 'delivered' || log.status === 'opened' || log.status === 'clicked'
  ).length;
  const opened = logs.filter((log) => log.status === 'opened' || log.status === 'clicked').length;
  const clicked = logs.filter((log) => log.status === 'clicked').length;
  const bounced = logs.filter((log) => log.status === 'bounced').length;
  const unsubscribed = logs.filter((log) => log.status === 'unsubscribed').length;

  const uniqueOpens = new Set(logs.filter((log) => log.openedAt).map((log) => log.recipientEmail))
    .size;
  const uniqueClicks = new Set(logs.filter((log) => log.clickedAt).map((log) => log.recipientEmail))
    .size;

  return {
    total,
    sent,
    delivered,
    opened,
    clicked,
    bounced,
    unsubscribed,
    uniqueOpens,
    uniqueClicks,
    deliveryRate: sent > 0 ? ((delivered / sent) * 100).toFixed(2) : 0,
    openRate: delivered > 0 ? ((uniqueOpens / delivered) * 100).toFixed(2) : 0,
    clickRate: uniqueOpens > 0 ? ((uniqueClicks / uniqueOpens) * 100).toFixed(2) : 0,
    bounceRate: sent > 0 ? ((bounced / sent) * 100).toFixed(2) : 0,
    unsubscribeRate: delivered > 0 ? ((unsubscribed / delivered) * 100).toFixed(2) : 0,
    engagement: {
      byDay: calculateEngagementByDay(logs),
      byHour: calculateEngagementByHour(logs),
    },
  };
}

function calculateEngagementByDay(logs: EmailLog[]) {
  const engagementByDay: Record<string, { opens: number; clicks: number }> = {};

  logs.forEach((log) => {
    if (log.openedAt) {
      const day = new Date(log.openedAt).toISOString().split('T')[0];
      if (!engagementByDay[day]) {
        engagementByDay[day] = { opens: 0, clicks: 0 };
      }
      engagementByDay[day].opens++;
    }

    if (log.clickedAt) {
      const day = new Date(log.clickedAt).toISOString().split('T')[0];
      if (!engagementByDay[day]) {
        engagementByDay[day] = { opens: 0, clicks: 0 };
      }
      engagementByDay[day].clicks++;
    }
  });

  return Object.entries(engagementByDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, data]) => ({ date, ...data }));
}

function calculateEngagementByHour(logs: EmailLog[]) {
  const engagementByHour: Record<number, { opens: number; clicks: number }> = {};

  for (let i = 0; i < 24; i++) {
    engagementByHour[i] = { opens: 0, clicks: 0 };
  }

  logs.forEach((log) => {
    if (log.openedAt) {
      const hour = new Date(log.openedAt).getHours();
      engagementByHour[hour].opens++;
    }

    if (log.clickedAt) {
      const hour = new Date(log.clickedAt).getHours();
      engagementByHour[hour].clicks++;
    }
  });

  return Object.entries(engagementByHour).map(([hour, data]) => ({
    hour: parseInt(hour),
    ...data,
  }));
}
