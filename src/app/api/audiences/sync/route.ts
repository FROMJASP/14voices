import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from '@/utilities/payload'
import { resendMarketing } from '@/lib/email/resend-marketing'
import type { EmailContact, SegmentRules } from '@/types/email-marketing'
import type { Where } from 'payload'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload()
    const { audienceId } = await req.json()

    const audience = await payload.findByID({
      collection: 'email-audiences',
      id: audienceId,
      depth: 2,
    })

    if (!audience) {
      return NextResponse.json(
        { error: 'Audience not found' },
        { status: 404 }
      )
    }

    let resendAudienceId = audience.resendAudienceId

    if (!resendAudienceId) {
      try {
        const resendAudience = await resendMarketing.createAudience({
          name: audience.name,
        })
        resendAudienceId = resendAudience?.id || ''

        await payload.update({
          collection: 'email-audiences',
          id: audienceId,
          data: {
            resendAudienceId,
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

    let contacts: EmailContact[] = []
    
    if (audience.type === 'static' && audience.contacts) {
      contacts = Array.isArray(audience.contacts) 
        ? audience.contacts 
        : await payload.find({
            collection: 'email-contacts',
            where: {
              id: {
                in: audience.contacts,
              },
            },
            limit: 1000,
          }).then(res => res.docs)
    } else if (audience.type === 'dynamic') {
      const result = await payload.find({
        collection: 'email-contacts',
        where: buildDynamicQuery(audience.segmentRules),
        limit: 1000,
      })
      contacts = result.docs as EmailContact[]
    } else if (audience.type === 'all') {
      const result = await payload.find({
        collection: 'email-contacts',
        where: {
          subscribed: {
            equals: true,
          },
        },
        limit: 1000,
      })
      contacts = result.docs as EmailContact[]
    }

    const syncResults = {
      synced: 0,
      failed: 0,
      errors: [] as { contactId: string; email: string; error: string }[],
    }

    for (const contact of contacts) {
      try {
        if (!contact.resendContactId) {
          const resendContact = await resendMarketing.createContact({
            email: contact.email,
            firstName: contact.firstName,
            lastName: contact.lastName,
            unsubscribed: !contact.subscribed,
            audienceId: resendAudienceId,
          })

          await payload.update({
            collection: 'email-contacts',
            id: contact.id,
            data: {
              resendContactId: resendContact?.id || '',
            },
          })
        } else {
          await resendMarketing.updateContact({
            id: contact.resendContactId,
            audienceId: resendAudienceId,
            firstName: contact.firstName,
            lastName: contact.lastName,
            unsubscribed: !contact.subscribed,
          })
        }
        
        syncResults.synced++
      } catch (error) {
        syncResults.failed++
        syncResults.errors.push({
          contactId: contact.id,
          email: contact.email,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    await payload.update({
      collection: 'email-audiences',
      id: audienceId,
      data: {
        contactCount: contacts.length,
        'syncStatus.lastSyncedAt': new Date(),
        'syncStatus.syncError': syncResults.failed > 0 
          ? `Failed to sync ${syncResults.failed} contacts` 
          : null,
      },
    })

    return NextResponse.json({
      success: true,
      audienceId: resendAudienceId,
      syncResults,
    })
  } catch (error) {
    console.error('Failed to sync audience:', error)
    return NextResponse.json(
      { error: 'Failed to sync audience' },
      { status: 500 }
    )
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