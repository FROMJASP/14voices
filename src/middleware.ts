import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Monitor admin access attempts in production
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // TODO: Send to monitoring service
    // logAdminAccess({
    //   pathname: request.nextUrl.pathname,
    //   method: request.method,
    //   headers: {
    //     host: request.headers.get('host'),
    //     'user-agent': request.headers.get('user-agent'),
    //   },
    // })
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}