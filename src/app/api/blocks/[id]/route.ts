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
    
    const block = await payload.findByID({
      collection: 'blocks',
      id: params.id,
      depth: 2,
    })

    return Response.json(block)
  } catch {
    return Response.json({ error: 'Block not found' }, { status: 404 })
  }
}