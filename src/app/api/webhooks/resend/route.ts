import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import crypto from 'crypto'
import { getPayload } from '@/utilities/payload'

const RESEND_WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET || ''

interface ResendWebhookEvent {
  type: string
  created_at: string
  data: {
    email_id: string
    from: string
    to: string[]
    subject: string
    click?: {
      link: string
      timestamp: string
    }
    bounce?: {
      type: string
      message: string
    }
  }
}

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(`v1=${expectedSignature}`)
  )
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get('resend-signature')
    
    if (!signature || !verifyWebhookSignature(body, signature, RESEND_WEBHOOK_SECRET)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
    
    const event: ResendWebhookEvent = JSON.parse(body)
    const payload = await getPayload()
    
    const emailLog = await payload.find({
      collection: 'email-logs',
      where: {
        resendId: {
          equals: event.data.email_id,
        },
      },
      limit: 1,
    })
    
    if (emailLog.totalDocs === 0) {
      console.warn(`Email log not found for Resend ID: ${event.data.email_id}`)
      return NextResponse.json({ received: true })
    }
    
    const log = emailLog.docs[0]
    const now = new Date()
    
    switch (event.type) {
      case 'email.sent':
        await payload.update({
          collection: 'email-logs',
          id: log.id,
          data: {
            status: 'sent',
            sentAt: now,
          },
        })
        break
        
      case 'email.delivered':
        await payload.update({
          collection: 'email-logs',
          id: log.id,
          data: {
            status: 'delivered',
            deliveredAt: now,
          },
        })
        break
        
      case 'email.opened':
        await payload.update({
          collection: 'email-logs',
          id: log.id,
          data: {
            status: 'opened',
            openedAt: log.openedAt || now,
            openCount: (log.openCount || 0) + 1,
          },
        })
        break
        
      case 'email.clicked':
        await payload.update({
          collection: 'email-logs',
          id: log.id,
          data: {
            status: 'clicked',
            clickedAt: log.clickedAt || now,
            clickCount: (log.clickCount || 0) + 1,
            metadata: {
              ...log.metadata,
              lastClickedLink: event.data.click?.link,
            },
          },
        })
        break
        
      case 'email.bounced':
        await payload.update({
          collection: 'email-logs',
          id: log.id,
          data: {
            status: 'bounced',
            error: event.data.bounce?.message,
            metadata: {
              ...log.metadata,
              bounceType: event.data.bounce?.type,
            },
          },
        })
        break
        
      case 'email.complained':
        await payload.update({
          collection: 'email-logs',
          id: log.id,
          data: {
            status: 'unsubscribed',
            metadata: {
              ...log.metadata,
              complaintType: 'spam',
            },
          },
        })
        
        // Also unsubscribe user
        if (log.recipient?.id) {
          await payload.update({
            collection: 'users',
            id: log.recipient.id,
            data: {
              emailUnsubscribed: true,
            },
          })
        }
        break
    }
    
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}