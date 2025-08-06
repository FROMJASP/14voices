import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { buildCSPHeader, isBlockedPath, isBlockedUserAgent } from '@/config/security';

export function middleware(request: NextRequest) {
  // Temporarily bypass security for admin login in development
  if (process.env.NODE_ENV === 'development' && request.nextUrl.pathname.startsWith('/admin')) {
    console.log('[DEV] Bypassing security for admin path:', request.nextUrl.pathname);
    return NextResponse.next();
  }

  // Block suspicious user agents
  const userAgent = request.headers.get('user-agent') || '';
  if (isBlockedUserAgent(userAgent)) {
    return new NextResponse(null, { status: 403 });
  }

  // Block suspicious paths using security config
  if (isBlockedPath(request.nextUrl.pathname)) {
    return new NextResponse(null, { status: 404 });
  }

  // For now, we'll skip nonce generation in middleware due to Edge Runtime limitations
  // In production, consider using a different approach like hash-based CSP or
  // generating nonces in server components
  const nonce = null;

  const response = NextResponse.next();

  // Pass nonce to the request for use in components if needed
  if (nonce) {
    response.headers.set('x-nonce', nonce);
  }

  // Add security headers globally
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Add Content Security Policy with nonce support
  response.headers.set('Content-Security-Policy', buildCSPHeader(nonce));

  // Add additional security headers
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  response.headers.set('X-Download-Options', 'noopen');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');

  // Monitor admin access attempts
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const accessLog = {
      timestamp: new Date().toISOString(),
      pathname: request.nextUrl.pathname,
      method: request.method,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      host: request.headers.get('host') || 'unknown',
    };

    // In production, this should be sent to a monitoring service
    if (process.env.NODE_ENV === 'production') {
      console.log('[ADMIN_ACCESS]', JSON.stringify(accessLog));
    }
  }

  // Log suspicious query parameters
  const queryString = request.nextUrl.search;
  if (
    queryString &&
    /UNION|SELECT|INSERT|UPDATE|DELETE|DROP|<script|javascript:|onerror=|onload=/i.test(queryString)
  ) {
    console.log('[SECURITY_ALERT] Suspicious query parameters:', {
      timestamp: new Date().toISOString(),
      pathname: request.nextUrl.pathname,
      query: queryString,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
    });
    return new NextResponse(null, { status: 400 });
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
