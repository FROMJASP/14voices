import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { createApiHandler, parsePaginationParams, ApiResponse } from '@/lib/api/handlers'

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const payload = await getPayload({ config: configPromise })
    const searchParams = request.nextUrl.searchParams
    const pagination = parsePaginationParams(request)
    
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
    
    const testimonials = await payload.find({
      collection: 'testimonials',
      where: {
        ...where,
        status: { equals: 'published' },
      },
      limit: pagination.limit,
      page: pagination.page,
      sort: pagination.sort || '-publishedDate',
    })
    
    return testimonials
  },
  {
    cache: {
      enabled: true,
      ttl: 300000, // 5 minutes
      key: (req) => {
        const params = Object.fromEntries(req.nextUrl.searchParams)
        return `testimonials:${JSON.stringify(params)}`
      }
    },
    rateLimit: {
      requests: 30,
      window: 60
    }
  }
)