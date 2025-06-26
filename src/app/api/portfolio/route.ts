import { NextRequest } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const searchParams = request.nextUrl.searchParams
    
    // Build where query from search params
    const where: Record<string, any> = {}
    searchParams.forEach((value, key) => {
      if (key.startsWith('where[') && key.endsWith(']')) {
        const field = key.slice(6, -1).replace('][', '.')
        const parts = field.split('.')
        
        let current = where
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) {
            current[parts[i]] = {}
          }
          current = current[parts[i]]
        }
        
        current[parts[parts.length - 1]] = value === 'true' ? true : value === 'false' ? false : value
      }
    })
    
    const limit = parseInt(searchParams.get('limit') || '10')
    const sort = searchParams.get('sort') || '-completedDate'
    
    const portfolio = await payload.find({
      collection: 'portfolio',
      where,
      limit,
      sort,
    })
    
    return Response.json(portfolio)
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return Response.json({ error: 'Failed to fetch portfolio projects' }, { status: 500 })
  }
}