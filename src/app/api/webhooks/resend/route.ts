import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import crypto from 'crypto';
import { getPayload } from '@/utilities/payload';
import type { Payload } from 'payload';
import { webhookEventSchema } from '@/lib/validation/schemas';
import { withPublicAuth } from '@/lib/auth-middleware';

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';
const RESEND_WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET;

if (!RESEND_WEBHOOK_SECRET) {
  console.error('RESEND_WEBHOOK_SECRET is not configured');
}

interface ResendWebhookEvent {
  type: string;
  created_at: string;
  data: {
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    broadcast_id?: string;
    click?: {
      link: string;
      timestamp: string;
    };
    bounce?: {
      type: string;
      message: string;
    };
  };
}

function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  try {
    const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    // Handle both v1= prefix and raw signature
    const receivedSignature = signature.startsWith('v1=') ? signature.slice(3) : signature;

    return crypto.timingSafeEqual(Buffer.from(receivedSignature), Buffer.from(expectedSignature));
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

async function handler(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('resend-signature');

    // Verify webhook signature first
    if (!signature || !RESEND_WEBHOOK_SECRET) {
      console.error('Missing webhook signature or secret');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!verifyWebhookSignature(body, signature, RESEND_WEBHOOK_SECRET)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Parse and validate event
    let event: ResendWebhookEvent;
    try {
      const parsedBody = JSON.parse(body);
      const validationResult = webhookEventSchema.safeParse(parsedBody);

      if (!validationResult.success) {
        console.error('Invalid webhook payload:', validationResult.error);
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
      }

      event = parsedBody as ResendWebhookEvent;
    } catch (e) {
      console.error('Failed to parse webhook body:', e);
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
    const payload = await getPayload();

    // Validate event type
    const validEventTypes = [
      'email.sent',
      'email.delivered',
      'email.opened',
      'email.clicked',
      'email.bounced',
      'email.complained',
    ];

    if (!validEventTypes.includes(event.type)) {
      console.warn(`Unknown event type: ${event.type}`);
      return NextResponse.json({ received: true });
    }

    // Check if this is a broadcast event
    if (event.data.broadcast_id) {
      await handleBroadcastEvent(payload, event);
      return NextResponse.json({ received: true });
    }

    const emailLog = await payload.find({
      collection: 'email-logs',
      where: {
        resendId: {
          equals: event.data.email_id,
        },
      },
      limit: 1,
    });

    if (emailLog.totalDocs === 0) {
      console.warn(`Email log not found for Resend ID: ${event.data.email_id}`);
      return NextResponse.json({ received: true });
    }

    const log = emailLog.docs[0];
    const now = new Date().toISOString();

    switch (event.type) {
      case 'email.sent':
        await payload.update({
          collection: 'email-logs',
          id: log.id,
          data: {
            status: 'sent',
            sentAt: now,
          },
        });
        break;

      case 'email.delivered':
        await payload.update({
          collection: 'email-logs',
          id: log.id,
          data: {
            status: 'delivered',
            deliveredAt: now,
          },
        });
        break;

      case 'email.opened':
        await payload.update({
          collection: 'email-logs',
          id: log.id,
          data: {
            status: 'opened',
            openedAt: log.openedAt || now,
            openCount: (log.openCount || 0) + 1,
          },
        });
        break;

      case 'email.clicked':
        await payload.update({
          collection: 'email-logs',
          id: log.id,
          data: {
            status: 'clicked',
            clickedAt: log.clickedAt || now,
            clickCount: (log.clickCount || 0) + 1,
            metadata: {
              ...(typeof log.metadata === 'object' && log.metadata !== null ? log.metadata : {}),
              lastClickedLink: event.data.click?.link,
            },
          },
        });
        break;

      case 'email.bounced':
        await payload.update({
          collection: 'email-logs',
          id: log.id,
          data: {
            status: 'bounced',
            error: event.data.bounce?.message,
            metadata: {
              ...(typeof log.metadata === 'object' && log.metadata !== null ? log.metadata : {}),
              bounceType: event.data.bounce?.type,
            },
          },
        });
        break;

      case 'email.complained':
        await payload.update({
          collection: 'email-logs',
          id: log.id,
          data: {
            status: 'unsubscribed',
            metadata: {
              ...(typeof log.metadata === 'object' && log.metadata !== null ? log.metadata : {}),
              complaintType: 'spam',
            },
          },
        });

        // Also unsubscribe user if recipient exists
        // TODO: Add emailPreferences field to User collection
        // if (log.recipient && typeof log.recipient === 'object' && 'id' in log.recipient) {
        //   await payload.update({
        //     collection: 'users',
        //     id: log.recipient.id,
        //     data: {
        //       emailPreferences: {
        //         unsubscribed: true,
        //       },
        //     },
        //   });
        // }
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    // Don't expose internal errors to webhook provider
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Export with security middleware (no auth required for webhooks)
export const POST = withPublicAuth(handler, { skipCSRF: true, rateLimit: 'webhook' });

async function handleBroadcastEvent(payload: Payload, event: ResendWebhookEvent) {
  try {
    const campaign = await payload.find({
      collection: 'email-campaigns',
      where: {
        resendBroadcastId: {
          equals: event.data.broadcast_id,
        },
      },
      limit: 1,
    });

    if (campaign.totalDocs === 0) {
      console.warn(`Campaign not found for broadcast ID: ${event.data.broadcast_id}`);
      return;
    }

    const campaignDoc = campaign.docs[0];
    const recipientEmail = event.data.to[0];

    const emailLog = await payload.find({
      collection: 'email-logs',
      where: {
        and: [
          {
            resendId: {
              equals: event.data.email_id,
            },
          },
          {
            'metadata.campaignId': {
              equals: campaignDoc.id,
            },
          },
        ],
      },
      limit: 1,
    });

    let log;
    if (emailLog.totalDocs === 0) {
      // Try to find user by email
      const user = await payload.find({
        collection: 'users',
        where: {
          email: {
            equals: recipientEmail,
          },
        },
        limit: 1,
      });

      log = await payload.create({
        collection: 'email-logs',
        data: {
          recipient: user.docs[0]?.id || 1, // Default to admin user if not found
          recipientEmail: recipientEmail,
          template: 1, // Default template ID - campaigns don't have direct template references
          subject: campaignDoc.subject,
          status: 'sent',
          sentAt: new Date().toISOString(),
          resendId: event.data.email_id,
          metadata: {
            campaignId: campaignDoc.id,
            broadcastId: event.data.broadcast_id,
          },
        },
      });
    } else {
      log = emailLog.docs[0];
    }
    const now = new Date().toISOString();

    switch (event.type) {
      case 'email.sent':
        await payload.update({
          collection: 'email-logs',
          id: log.id,
          data: {
            status: 'sent',
            sentAt: now,
          },
        });
        break;

      case 'email.delivered':
        await payload.update({
          collection: 'email-logs',
          id: log.id,
          data: {
            status: 'delivered',
            deliveredAt: now,
          },
        });
        await updateCampaignAnalytics(payload, campaignDoc.id.toString(), 'delivered');
        break;

      case 'email.opened':
        await payload.update({
          collection: 'email-logs',
          id: log.id,
          data: {
            status: 'opened',
            openedAt: log.openedAt || now,
            openCount: (log.openCount || 0) + 1,
          },
        });
        if (!log.openedAt) {
          await updateCampaignAnalytics(payload, campaignDoc.id.toString(), 'opened');
        }
        break;

      case 'email.clicked':
        await payload.update({
          collection: 'email-logs',
          id: log.id,
          data: {
            status: 'clicked',
            clickedAt: log.clickedAt || now,
            clickCount: (log.clickCount || 0) + 1,
            metadata: {
              ...(typeof log.metadata === 'object' && log.metadata !== null ? log.metadata : {}),
              lastClickedLink: event.data.click?.link,
            },
          },
        });
        if (!log.clickedAt) {
          await updateCampaignAnalytics(payload, campaignDoc.id.toString(), 'clicked');
        }
        break;

      case 'email.bounced':
        await payload.update({
          collection: 'email-logs',
          id: log.id,
          data: {
            status: 'bounced',
            error: event.data.bounce?.message,
            metadata: {
              ...(typeof log.metadata === 'object' && log.metadata !== null ? log.metadata : {}),
              bounceType: event.data.bounce?.type,
            },
          },
        });
        await updateCampaignAnalytics(payload, campaignDoc.id.toString(), 'bounced');
        break;

      case 'email.complained':
        await payload.update({
          collection: 'email-logs',
          id: log.id,
          data: {
            status: 'unsubscribed',
            metadata: {
              ...(typeof log.metadata === 'object' && log.metadata !== null ? log.metadata : {}),
              complaintType: 'spam',
            },
          },
        });
        await updateCampaignAnalytics(payload, campaignDoc.id.toString(), 'unsubscribed');

        const contact = await payload.find({
          collection: 'email-contacts',
          where: {
            email: {
              equals: recipientEmail,
            },
          },
          limit: 1,
        });

        if (contact.totalDocs > 0) {
          await payload.update({
            collection: 'email-contacts',
            id: contact.docs[0].id,
            data: {
              subscribed: false,
              unsubscribedAt: now,
            },
          });
        }
        break;
    }
  } catch (error) {
    console.error('Failed to handle broadcast event:', error);
  }
}

async function updateCampaignAnalytics(payload: Payload, campaignId: string, metric: string) {
  try {
    const campaign = await payload.findByID({
      collection: 'email-campaigns',
      id: campaignId,
    });

    const analytics = campaign.analytics || {};
    const fieldName = `${metric}Count` as keyof typeof analytics;
    const currentValue = analytics[fieldName] as number | undefined;

    await payload.update({
      collection: 'email-campaigns',
      id: campaignId,
      data: {
        analytics: {
          ...analytics,
          [fieldName]: (currentValue || 0) + 1,
        },
      },
    });

    const sentCount = analytics.sentCount as number | undefined;
    const openedCount = analytics.openedCount as number | undefined;
    const clickedCount = analytics.clickedCount as number | undefined;

    if (sentCount && sentCount > 0) {
      const openRate = openedCount ? (openedCount / sentCount) * 100 : 0;
      const clickRate = clickedCount ? (clickedCount / sentCount) * 100 : 0;

      await payload.update({
        collection: 'email-campaigns',
        id: campaignId,
        data: {
          analytics: {
            ...analytics,
            openRate,
            clickRate,
          },
        },
      });
    }
  } catch (error) {
    console.error('Failed to update campaign analytics:', error);
  }
}
