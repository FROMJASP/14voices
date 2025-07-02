import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { buildCSPHeader, isBlockedPath, isBlockedUserAgent } from '@/config/security'

export function middleware(request: NextRequest) {
  // Block suspicious user agents
  const userAgent = request.headers.get('user-agent') || ''
  if (isBlockedUserAgent(userAgent)) {
    return new NextResponse(null, { status: 403 })
  }
  
  // Block suspicious paths using security config
  if (isBlockedPath(request.nextUrl.pathname)) {
    return new NextResponse(null, { status: 404 })
  }
  
  const response = NextResponse.next()
  
  // Add security headers globally
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Add Content Security Policy
  response.headers.set('Content-Security-Policy', buildCSPHeader())
  
  // Add additional security headers
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  response.headers.set('X-DNS-Prefetch-Control', 'off')
  response.headers.set('X-Download-Options', 'noopen')
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none')
  
  // Monitor admin access attempts
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const accessLog = {
      timestamp: new Date().toISOString(),
      pathname: request.nextUrl.pathname,
      method: request.method,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      host: request.headers.get('host') || 'unknown',
    }
    
    // In production, this should be sent to a monitoring service
    if (process.env.NODE_ENV === 'production') {
      console.log('[ADMIN_ACCESS]', JSON.stringify(accessLog))
    }
  }
  
  // Log suspicious query parameters
  const queryString = request.nextUrl.search
  if (queryString && /UNION|SELECT|INSERT|UPDATE|DELETE|DROP|<script|javascript:|onerror=|onload=/i.test(queryString)) {
    console.log('[SECURITY_ALERT] Suspicious query parameters:', {
      timestamp: new Date().toISOString(),
      pathname: request.nextUrl.pathname,
      query: queryString,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
    })
    return new NextResponse(null, { status: 400 })
  }
  
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}