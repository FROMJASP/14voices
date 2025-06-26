import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from '@/utilities/payload'
import { resendMarketing } from '@/lib/email/resend-marketing'
import type { EmailCampaign } from '@/types/email-marketing'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const payload = await getPayload()
    const { test = false, testEmails = [] } = await req.json()

    const campaign = await payload.findByID({
      collection: 'email-campaigns',
      id,
      depth: 2,
    })

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    if (campaign.status !== 'draft' && !test) {
      return NextResponse.json(
        { error: 'Campaign can only be sent when in draft status' },
        { status: 400 }
      )
    }

    const audience = campaign.audience
    if (!audience || typeof audience === 'string') {
      return NextResponse.json(
        { error: 'Campaign audience not found' },
        { status: 400 }
      )
    }

    if (test) {
      const results = []
      
      for (const email of testEmails) {
        try {
          const result = await resendMarketing.resend.emails.send({
            from: `${campaign.fromName} <${campaign.fromEmail}>`,
            to: email,
            subject: `[TEST] ${campaign.subject}`,
            html: await renderCampaignContent(campaign as EmailCampaign),
            text: campaign.markdownContent || '',
            replyTo: campaign.replyTo,
          })

          results.push({ email, success: true, id: result.data?.id })
        } catch (sendError) {
          results.push({ 
            email, 
            success: false, 
            error: sendError instanceof Error ? sendError.message : 'Unknown error' 
          })
        }
      }

      await payload.update({
        collection: 'email-campaigns',
        id,
        data: {
          testEmails: testEmails.map((email: string) => ({
            email,
            sentAt: new Date(),
          })),
        },
      })

      return NextResponse.json({ testResults: results })
    }

    if (!audience.resendAudienceId) {
      let resendAudience
      try {
        resendAudience = await resendMarketing.createAudience({
          name: audience.name,
        })

        await payload.update({
          collection: 'email-audiences',
          id: audience.id,
          data: {
            resendAudienceId: resendAudience?.id || '',
          },
        })
      } catch (createError) {
        console.error('Failed to create Resend audience:', createError)
        return NextResponse.json(
          { error: 'Failed to create Resend audience' },
          { status: 500 }
        )
      }
    }

    const broadcast = await resendMarketing.sendBroadcast({
      audienceId: audience.resendAudienceId,
      from: `${campaign.fromName} <${campaign.fromEmail}>`,
      subject: campaign.subject,
      html: await renderCampaignContent(campaign as EmailCampaign),
      text: campaign.markdownContent || '',
      replyTo: campaign.replyTo,
      scheduledAt: campaign.scheduledAt ? new Date(campaign.scheduledAt).toISOString() : undefined,
    })

    await payload.update({
      collection: 'email-campaigns',
      id,
      data: {
        status: campaign.scheduledAt ? 'scheduled' : 'sending',
        resendBroadcastId: broadcast?.id || '',
        'analytics.sentCount': audience.contactCount || 0,
      },
    })

    return NextResponse.json({ 
      success: true, 
      broadcastId: broadcast?.id || '',
      status: campaign.scheduledAt ? 'scheduled' : 'sending',
    })
  } catch (error) {
    console.error('Failed to send campaign:', error)
    return NextResponse.json(
      { error: 'Failed to send campaign' },
      { status: 500 }
    )
  }
}

async function renderCampaignContent(campaign: EmailCampaign): Promise<string> {
  if (campaign.contentType === 'markdown') {
    return campaign.markdownContent || ''
  }

  if (campaign.contentType === 'react') {
    return '<p>React Email component rendering not implemented yet</p>'
  }

  type ContentNode = {
    type: string
    tag?: string
    children?: Array<{ text?: string }>
  }
  
  const contentObj = campaign.content as { root?: { children?: ContentNode[] } }
  const html = contentObj?.root?.children?.reduce((acc: string, node: ContentNode) => {
    if (node.type === 'paragraph') {
      const text = node.children?.map((child: { text?: string }) => child.text || '').join('')
      return acc + `<p>${text}</p>`
    }
    if (node.type === 'heading') {
      const level = node.tag || 'h2'
      const text = node.children?.map((child: { text?: string }) => child.text || '').join('')
      return acc + `<${level}>${text}</${level}>`
    }
    return acc
  }, '') || ''

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${campaign.subject}</title>
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
  `
}