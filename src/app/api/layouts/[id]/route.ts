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
    
    const layout = await payload.findByID({
      collection: 'layouts',
      id: params.id,
      depth: 1,
    })

    return Response.json(layout)
  } catch {
    return Response.json({ error: 'Layout not found' }, { status: 404 })
  }
}