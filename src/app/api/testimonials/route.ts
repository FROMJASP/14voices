import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const searchParams = request.nextUrl.searchParams
    
    // Build where query from search params
    const where: Record<string, unknown> = {}
    searchParams.forEach((value, key) => {
      if (key.startsWith('where[') && key.endsWith(']')) {
        const field = key.slice(6, -1)
        const parts = field.split('][')
        
        let current: Record<string, unknown> = where
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) {
            current[parts[i]] = {}
          }
          current = current[parts[i]] as Record<string, unknown>
        }
        
        const lastPart = parts[parts.length - 1]
        if (lastPart === 'equals') {
          current[parts[parts.length - 2]] = { equals: value }
        } else {
          current[lastPart] = value
        }
      }
    })
    
    const limit = parseInt(searchParams.get('limit') || '10')
    const sort = searchParams.get('sort') || '-publishedDate'
    
    const testimonials = await payload.find({
      collection: 'testimonials',
      where: {
        ...where,
        status: { equals: 'published' },
      },
      limit,
      sort,
    })
    
    return Response.json(testimonials)
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return Response.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
  }
}