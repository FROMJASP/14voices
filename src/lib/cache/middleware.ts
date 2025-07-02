import { NextRequest, NextResponse } from 'next/server'
import globalCache from './index'

export interface CacheMiddlewareOptions {
  ttl?: number
  keyGenerator?: (req: NextRequest) => string
  condition?: (req: NextRequest) => boolean
  varyBy?: string[]
}

export function withCacheHeaders(response: NextResponse, maxAge: number = 300): NextResponse {
  response.headers.set('Cache-Control', `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 2}`)
  response.headers.set('CDN-Cache-Control', `max-age=${maxAge * 4}`)
  return response
}

export function createCacheMiddleware(options: CacheMiddlewareOptions = {}) {
  return async function cacheMiddleware(
    request: NextRequest,
    handler: () => Promise<NextResponse>
  ): Promise<NextResponse> {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return handler()
    }
    
    if (options.condition && !options.condition(request)) {
      return handler()
    }
    
    const cacheKey = options.keyGenerator 
      ? options.keyGenerator(request)
      : generateCacheKey(request, options.varyBy)
    
    const cachedResponse = await globalCache.get<{
      body: any
      headers: Record<string, string>
      status: number
    }>(cacheKey)
    
    if (cachedResponse) {
      const response = NextResponse.json(cachedResponse.body, {
        status: cachedResponse.status,
        headers: cachedResponse.headers
      })
      response.headers.set('X-Cache', 'HIT')
      response.headers.set('X-Cache-Key', cacheKey)
      return response
    }
    
    const response = await handler()
    
    if (response.ok) {
      const body = await response.json()
      const headers: Record<string, string> = {}
      response.headers.forEach((value, key) => {
        headers[key] = value
      })
      
      await globalCache.set(
        cacheKey,
        {
          body,
          headers,
          status: response.status
        },
        options.ttl
      )
      
      const newResponse = NextResponse.json(body, {
        status: response.status,
        headers
      })
      newResponse.headers.set('X-Cache', 'MISS')
      newResponse.headers.set('X-Cache-Key', cacheKey)
      return newResponse
    }
    
    return response
  }
}

function generateCacheKey(request: NextRequest, varyBy?: string[]): string {
  const url = new URL(request.url)
  const parts = [
    request.method,
    url.pathname,
    url.search
  ]
  
  if (varyBy) {
    varyBy.forEach(header => {
      const value = request.headers.get(header)
      if (value) {
        parts.push(`${header}:${value}`)
      }
    })
  }
  
  return parts.join('|')
}

export function createEtagMiddleware() {
  return async function etagMiddleware(
    request: NextRequest,
    handler: () => Promise<NextResponse>
  ): Promise<NextResponse> {
    const response = await handler()
    
    if (!response.ok || request.method !== 'GET') {
      return response
    }
    
    const body = await response.text()
    const etag = `"${generateEtag(body)}"`
    
    const ifNoneMatch = request.headers.get('if-none-match')
    if (ifNoneMatch === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          'etag': etag
        }
      })
    }
    
    const newResponse = new NextResponse(body, {
      status: response.status,
      headers: response.headers
    })
    newResponse.headers.set('etag', etag)
    
    return newResponse
  }
}

function generateEtag(content: string): string {
  let hash = 0
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}

export function createStaleWhileRevalidate(options: {
  ttl: number
  staleTtl: number
}) {
  return async function staleWhileRevalidateMiddleware(
    request: NextRequest,
    handler: () => Promise<NextResponse>
  ): Promise<NextResponse> {
    const cacheKey = generateCacheKey(request)
    const staleKey = `stale:${cacheKey}`
    
    const cached = await globalCache.get<{
      body: any
      headers: Record<string, string>
      status: number
      timestamp: number
    }>(cacheKey)
    
    const now = Date.now()
    
    if (cached && (now - cached.timestamp) < options.ttl) {
      const response = NextResponse.json(cached.body, {
        status: cached.status,
        headers: cached.headers
      })
      response.headers.set('X-Cache', 'HIT')
      return response
    }
    
    const staleCached = await globalCache.get<any>(staleKey)
    if (staleCached) {
      const response = NextResponse.json(staleCached.body, {
        status: staleCached.status,
        headers: staleCached.headers
      })
      response.headers.set('X-Cache', 'STALE')
      
      handler().then(async (freshResponse) => {
        if (freshResponse.ok) {
          const body = await freshResponse.json()
          const headers: Record<string, string> = {}
          freshResponse.headers.forEach((value, key) => {
            headers[key] = value
          })
          
          const cacheData = {
            body,
            headers,
            status: freshResponse.status,
            timestamp: Date.now()
          }
          
          await Promise.all([
            globalCache.set(cacheKey, cacheData, options.ttl),
            globalCache.set(staleKey, cacheData, options.staleTtl)
          ])
        }
      }).catch(console.error)
      
      return response
    }
    
    const freshResponse = await handler()
    
    if (freshResponse.ok) {
      const body = await freshResponse.json()
      const headers: Record<string, string> = {}
      freshResponse.headers.forEach((value, key) => {
        headers[key] = value
      })
      
      const cacheData = {
        body,
        headers,
        status: freshResponse.status,
        timestamp: Date.now()
      }
      
      await Promise.all([
        globalCache.set(cacheKey, cacheData, options.ttl),
        globalCache.set(staleKey, cacheData, options.staleTtl)
      ])
      
      const newResponse = NextResponse.json(body, {
        status: freshResponse.status,
        headers
      })
      newResponse.headers.set('X-Cache', 'MISS')
      return newResponse
    }
    
    return freshResponse
  }
}