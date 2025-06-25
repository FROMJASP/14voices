import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Log admin access attempts
  if (request.nextUrl.pathname.startsWith('/admin')) {
    console.log('Admin access attempt:', {
      pathname: request.nextUrl.pathname,
      method: request.method,
      headers: {
        host: request.headers.get('host'),
        'user-agent': request.headers.get('user-agent'),
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}