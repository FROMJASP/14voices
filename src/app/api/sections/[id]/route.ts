import { NextRequest } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    
    const section = await payload.findByID({
      collection: 'sections',
      id: params.id,
      depth: 2,
    })

    return Response.json(section)
  } catch {
    return Response.json({ error: 'Section not found' }, { status: 404 })
  }
}