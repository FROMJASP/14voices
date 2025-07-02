import { NextRequest, NextResponse } from 'next/server'
import { getServerSideUser } from '@/utilities/payload'
import { headers } from 'next/headers'

export type AuthOptions = {
  requireAuth?: boolean
  allowedRoles?: string[]
  publicRoutes?: string[]
}

/**
 * Authentication middleware for API routes
 * Validates user authentication and authorization
 */
export async function withAuth(
  handler: (req: NextRequest, context?: any) => Promise<NextResponse>,
  options: AuthOptions = { requireAuth: true }
) {
  return async (req: NextRequest, context?: any) => {
    const pathname = req.nextUrl.pathname

    // Check if route is public
    if (options.publicRoutes?.some(route => pathname.startsWith(route))) {
      return handler(req, context)
    }

    try {
      const user = await getServerSideUser()

      // Check authentication
      if (options.requireAuth && !user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }

      // Check authorization (role-based)
      if (user && options.allowedRoles && options.allowedRoles.length > 0) {
        const userRole = user.role || 'user'
        if (!options.allowedRoles.includes(userRole)) {
          return NextResponse.json(
            { error: 'Insufficient permissions' },
            { status: 403 }
          )
        }
      }

      // Add user to request context
      if (context) {
        context.user = user
      }

      return handler(req, context)
    } catch (error) {
      console.error('Authentication error:', error)
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      )
    }
  }
}

/**
 * Rate limiting middleware
 * Prevents abuse and brute force attacks
 */
const rateLimitMap = new Map<string, { count: number; timestamp: number }>()

export function withRateLimit(
  handler: (req: NextRequest, context?: any) => Promise<NextResponse>,
  options: { windowMs?: number; max?: number } = {}
) {
  const { windowMs = 60000, max = 60 } = options // 60 requests per minute by default

  return async (req: NextRequest, context?: any) => {
    const clientId = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'anonymous'
    
    const now = Date.now()
    const clientData = rateLimitMap.get(clientId) || { count: 0, timestamp: now }

    // Reset if window has passed
    if (now - clientData.timestamp > windowMs) {
      clientData.count = 0
      clientData.timestamp = now
    }

    clientData.count++
    rateLimitMap.set(clientId, clientData)

    // Check rate limit
    if (clientData.count > max) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil(windowMs / 1000)),
            'X-RateLimit-Limit': String(max),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(new Date(clientData.timestamp + windowMs).toISOString()),
          }
        }
      )
    }

    // Add rate limit headers
    const response = await handler(req, context)
    response.headers.set('X-RateLimit-Limit', String(max))
    response.headers.set('X-RateLimit-Remaining', String(max - clientData.count))
    response.headers.set('X-RateLimit-Reset', String(new Date(clientData.timestamp + windowMs).toISOString()))

    return response
  }
}

/**
 * CORS middleware
 * Controls cross-origin access
 */
export function withCORS(
  handler: (req: NextRequest, context?: any) => Promise<NextResponse>,
  options: { allowedOrigins?: string[]; allowedMethods?: string[] } = {}
) {
  const { 
    allowedOrigins = [process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'],
    allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  } = options

  return async (req: NextRequest, context?: any) => {
    const origin = req.headers.get('origin') || ''

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
          'Access-Control-Allow-Methods': allowedMethods.join(', '),
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      })
    }

    const response = await handler(req, context)

    // Add CORS headers
    if (allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Access-Control-Allow-Methods', allowedMethods.join(', '))
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    }

    return response
  }
}

/**
 * Security headers middleware
 * Adds security headers to responses
 */
export function withSecurityHeaders(
  handler: (req: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: any) => {
    const response = await handler(req, context)

    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

    return response
  }
}

/**
 * Compose multiple middleware functions
 */
export function composeMiddleware(...middlewares: Array<(handler: any) => any>) {
  return (handler: any) => {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler)
  }
}