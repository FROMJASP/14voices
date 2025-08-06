import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-middleware';
import { getPayload, getServerSideUser } from '@/utilities/payload';
import { resendMarketing } from '@/lib/email/resend-marketing';
import type { EmailCampaign } from '@/payload-types';
import { campaignSendSchema } from '@/lib/validation/schemas';
import { sanitizeHtml } from '@/lib/validation/schemas';

async function handler(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Validate campaign ID format
    if (!id || typeof id !== 'string' || id.length > 100) {
      return NextResponse.json({ error: 'Invalid campaign ID' }, { status: 400 });
    }

    const payload = await getPayload();
    const body = await _req.json();

    // Validate input
    const validationResult = campaignSendSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { test, testEmails } = validationResult.data;

    const campaign = await payload.findByID({
      collection: 'email-campaigns',
      id,
      depth: 2,
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    if (campaign.status !== 'draft' && !test) {
      return NextResponse.json(
        { error: 'Campaign can only be sent when in draft status' },
        { status: 400 }
      );
    }

    const audience = campaign.audience;
    if (!audience || typeof audience === 'string' || typeof audience === 'number') {
      return NextResponse.json({ error: 'Campaign audience not populated' }, { status: 400 });
    }

    if (test) {
      const results = [];

      for (const email of testEmails) {
        try {
          const result = await resendMarketing.resend.emails.send({
            from: `${campaign.fromName} <${campaign.fromEmail}>`,
            to: email,
            subject: `[TEST] ${campaign.subject}`,
            html: await renderCampaignContent(campaign as unknown as EmailCampaign),
            text: campaign.markdownContent || '',
            replyTo: campaign.replyTo || undefined,
          });

          results.push({ email, success: true, id: result.data?.id });
        } catch (sendError) {
          results.push({
            email,
            success: false,
            error: sendError instanceof Error ? sendError.message : 'Unknown error',
          });
        }
      }

      await payload.update({
        collection: 'email-campaigns',
        id,
        data: {
          testEmails: testEmails.map((email: string) => ({
            email,
            sentAt: new Date().toISOString(),
          })),
        },
      });

      return NextResponse.json({ testResults: results });
    }

    if (!audience.resendAudienceId) {
      let resendAudience;
      try {
        resendAudience = await resendMarketing.createAudience({
          name: audience.name,
        });

        await payload.update({
          collection: 'email-audiences',
          id: audience.id,
          data: {
            resendAudienceId: resendAudience?.id || '',
          },
        });
      } catch (createError) {
        console.error('Failed to create Resend audience:', createError);
        return NextResponse.json({ error: 'Failed to create Resend audience' }, { status: 500 });
      }
    }

    const broadcast = await resendMarketing.sendBroadcast({
      audienceId: audience.resendAudienceId || '',
      from: `${campaign.fromName} <${campaign.fromEmail}>`,
      subject: campaign.subject,
      html: await renderCampaignContent(campaign as unknown as EmailCampaign),
      text: campaign.markdownContent || '',
      replyTo: campaign.replyTo || undefined,
      scheduledAt: campaign.scheduledAt ? new Date(campaign.scheduledAt).toISOString() : undefined,
    });

    await payload.update({
      collection: 'email-campaigns',
      id,
      data: {
        status: campaign.scheduledAt ? 'scheduled' : 'sending',
        resendBroadcastId: broadcast?.id || '',
        analytics: {
          sentCount: audience.contactCount || 0,
        },
      },
    });

    return NextResponse.json({
      success: true,
      broadcastId: broadcast?.id || '',
      status: campaign.scheduledAt ? 'scheduled' : 'sending',
    });
  } catch (error) {
    console.error('Failed to send campaign:', error);
    return NextResponse.json({ error: 'Failed to send campaign' }, { status: 500 });
  }
}

async function renderCampaignContent(campaign: EmailCampaign): Promise<string> {
  if (campaign.contentType === 'markdown') {
    // Sanitize markdown content
    return sanitizeHtml(campaign.markdownContent || '');
  }

  if (campaign.contentType === 'react') {
    return '<p>React Email component rendering not implemented yet</p>';
  }

  type ContentNode = {
    type: string;
    tag?: string;
    children?: Array<{ text?: string }>;
  };

  const contentObj = campaign.content as { root?: { children?: ContentNode[] } };
  const html =
    contentObj?.root?.children?.reduce((acc: string, node: ContentNode) => {
      // Validate node type
      const allowedTypes = ['paragraph', 'heading', 'list', 'quote'];
      if (!allowedTypes.includes(node.type)) {
        return acc;
      }

      if (node.type === 'paragraph') {
        const text = node.children
          ?.map((child: { text?: string }) => sanitizeHtml(child.text || ''))
          .join('');
        return acc + `<p>${text}</p>`;
      }
      if (node.type === 'heading') {
        // Validate heading level
        const allowedTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        const level = allowedTags.includes(node.tag || '') ? node.tag : 'h2';
        const text = node.children
          ?.map((child: { text?: string }) => sanitizeHtml(child.text || ''))
          .join('');
        return acc + `<${level}>${text}</${level}>`;
      }
      return acc;
    }, '') || '';

  // Sanitize subject to prevent XSS in title
  const sanitizedSubject = sanitizeHtml(campaign.subject);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${sanitizedSubject}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          ${html}
          <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #666; text-align: center;">
            You're receiving this email because you're subscribed to our list.<br>
            <a href="{{{unsubscribe}}}" style="color: #666;">Unsubscribe</a>
          </p>
        </div>
      </body>
    </html>
  `;
}

// Export the handler with middleware
async function POSTHandler(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Simple auth check
  const user = await getServerSideUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Call the handler
  const response = await handler(_req, { params });

  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

export const POST = withAuth(POSTHandler);
