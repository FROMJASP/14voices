import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  try {
    const payload = await getPayload({ config: configPromise })
    
    const form = await payload.findByID({
      collection: 'forms',
      id: params.id,
      depth: 1,
    })

    return Response.json(form)
  } catch {
    return Response.json({ error: 'Form not found' }, { status: 404 })
  }
}