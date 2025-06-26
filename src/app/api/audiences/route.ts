import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from '@/utilities/payload'
import { resendMarketing } from '@/lib/email/resend-marketing'
import type { Payload, Where } from 'payload'
import type { EmailAudience, SegmentRules } from '@/types/email-marketing'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload()
    const { searchParams } = new URL(req.url)
    const active = searchParams.get('active')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')

    const where: Where = {}
    if (active !== null) {
      where.active = { equals: active === 'true' }
    }

    const audiences = await payload.find({
      collection: 'email-audiences',
      where,
      limit,
      page,
      depth: 1,
      sort: '-createdAt',
    })

    return NextResponse.json({
      audiences: audiences.docs,
      totalDocs: audiences.totalDocs,
      totalPages: audiences.totalPages,
      page: audiences.page,
      limit: audiences.limit,
    })
  } catch (error) {
    console.error('Failed to fetch audiences:', error)
    return NextResponse.json(
      { error: 'Failed to fetch audiences' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload()
    const data = await req.json()

    let resendAudienceId = null
    if (data.syncWithResend) {
      try {
        const resendAudience = await resendMarketing.createAudience({
          name: data.name,
        })
        resendAudienceId = resendAudience?.id || null
      } catch (error) {
        console.error('Failed to create Resend audience:', error)
      }
    }

    const audience = await payload.create({
      collection: 'email-audiences',
      data: {
        ...data,
        resendAudienceId,
      },
    })

    if (data.type === 'dynamic' && data.segmentRules) {
      await updateDynamicAudienceContacts(payload, audience as EmailAudience)
    }

    return NextResponse.json({ audience })
  } catch (error) {
    console.error('Failed to create audience:', error)
    return NextResponse.json(
      { error: 'Failed to create audience' },
      { status: 500 }
    )
  }
}

async function updateDynamicAudienceContacts(payload: Payload, audience: EmailAudience) {
  try {
    const contacts = await payload.find({
      collection: 'email-contacts',
      where: buildDynamicQuery(audience.segmentRules),
      limit: 1000,
    })

    await payload.update({
      collection: 'email-audiences',
      id: audience.id,
      data: {
        contactCount: contacts.totalDocs,
      },
    })

    return contacts.docs
  } catch (error) {
    console.error('Failed to update dynamic audience contacts:', error)
    return []
  }
}

function buildDynamicQuery(segmentRules: SegmentRules | undefined): Where {
  const where: Where = {}
  
  if (!segmentRules?.rules || segmentRules.rules.length === 0) {
    return where
  }

  const conditions = segmentRules.rules.map((rule) => {
    const condition: Where = {}
    
    switch (rule.field) {
      case 'tags':
        if (rule.operator === 'contains') {
          condition['tags.tag'] = { contains: rule.value }
        } else if (rule.operator === 'not_contains') {
          condition['tags.tag'] = { not_equals: rule.value }
        }
        break
        
      case 'location':
        if (rule.operator === 'equals') {
          condition['location.country'] = { equals: rule.value }
        }
        break
        
      case 'engagement':
        if (rule.operator === 'greater_than') {
          condition['engagement.engagementScore'] = { greater_than: parseInt(rule.value || '0') }
        } else if (rule.operator === 'less_than') {
          condition['engagement.engagementScore'] = { less_than: parseInt(rule.value || '0') }
        }
        break
        
      case 'signupDate':
        const date = new Date(rule.value || '')
        if (rule.operator === 'greater_than') {
          condition['source.signupDate'] = { greater_than: date }
        } else if (rule.operator === 'less_than') {
          condition['source.signupDate'] = { less_than: date }
        }
        break
    }
    
    return condition
  })

  if (segmentRules.logic === 'any') {
    where.or = conditions
  } else {
    Object.assign(where, ...conditions)
  }

  return where
}