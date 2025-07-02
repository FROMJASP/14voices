import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Add security headers globally
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
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
  
  // Block suspicious paths
  const blockedPaths = [
    '/.env',
    '/wp-admin',
    '/wp-login',
    '/.git',
    '/config',
    '/api/config',
    '/.well-known/security.txt',
  ]
  
  if (blockedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    return new NextResponse(null, { status: 404 })
  }
  
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}