import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from '@/utilities/payload'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload()
    const { contacts, audienceId, updateExisting = false } = await req.json()

    if (!Array.isArray(contacts)) {
      return NextResponse.json(
        { error: 'Contacts must be an array' },
        { status: 400 }
      )
    }

    const results = {
      imported: 0,
      updated: 0,
      failed: 0,
      errors: [] as { email: string; error: string }[],
    }

    for (const contactData of contacts) {
      try {
        const existingContact = await payload.find({
          collection: 'email-contacts',
          where: {
            email: {
              equals: contactData.email,
            },
          },
          limit: 1,
        })

        if (existingContact.totalDocs > 0) {
          if (updateExisting) {
            await payload.update({
              collection: 'email-contacts',
              id: existingContact.docs[0].id,
              data: {
                ...contactData,
                email: existingContact.docs[0].email, // Don't update email
              },
            })
            results.updated++
          } else {
            results.errors.push({
              email: contactData.email,
              error: 'Contact already exists',
            })
            results.failed++
          }
        } else {
          await payload.create({
            collection: 'email-contacts',
            data: {
              ...contactData,
              source: {
                type: 'csv',
                detail: 'Bulk import',
                signupDate: new Date(),
              },
            },
          })
          results.imported++
        }
      } catch (error) {
        results.failed++
        results.errors.push({
          email: contactData.email,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    if (audienceId && results.imported > 0) {
      try {
        const audience = await payload.findByID({
          collection: 'email-audiences',
          id: audienceId,
        })

        if (audience && audience.type === 'static') {
          const newContacts = await payload.find({
            collection: 'email-contacts',
            where: {
              email: {
                in: contacts.map(c => c.email),
              },
            },
            limit: 1000,
          })

          const existingContacts = audience.contacts || []
          const contactIds = [...new Set([
            ...existingContacts.map((c: string | { id: string }) => typeof c === 'string' ? c : c.id),
            ...newContacts.docs.map(c => c.id),
          ])]

          await payload.update({
            collection: 'email-audiences',
            id: audienceId,
            data: {
              contacts: contactIds,
              contactCount: contactIds.length,
            },
          })
        }
      } catch (error) {
        console.error('Failed to update audience:', error)
      }
    }

    return NextResponse.json({
      success: true,
      results,
    })
  } catch (error) {
    console.error('Failed to import contacts:', error)
    return NextResponse.json(
      { error: 'Failed to import contacts' },
      { status: 500 }
    )
  }
}