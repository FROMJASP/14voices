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
    
    const sort = searchParams.get('sort') || 'order'
    
    const team = await payload.find({
      collection: 'team',
      where,
      sort,
    })
    
    return Response.json(team)
  } catch (error) {
    console.error('Error fetching team:', error)
    return Response.json({ error: 'Failed to fetch team members' }, { status: 500 })
  }
}