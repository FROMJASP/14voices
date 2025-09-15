import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { buildCSPHeader, isBlockedPath, isBlockedUserAgent } from '@/config/security';
import { rateLimitMiddleware, getEndpointType } from '@/middleware/rate-limit';
import { getEdgeSafeRateLimiter, getRateLimitConfig } from '@/lib/rate-limiter/edge-safe';
import { handleStaticFiles } from '@/middleware/static-files';
import { verifyCSRFToken } from '@/lib/csrf-edge';

export async function middleware(request: NextRequest) {
  // Handle static file requests with proper headers
  const staticResponse = handleStaticFiles(request);
  if (staticResponse) {
    return staticResponse;
  }

  // Add early hints for critical resources on homepage
  if (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/home') {
    const response = NextResponse.next();
    response.headers.set(
      'Link',
      [
        '<https://fonts.googleapis.com>; rel=preconnect',
        '<https://fonts.gstatic.com>; rel=preconnect; crossorigin',
        '<https://minio.14voices.com>; rel=preconnect',
        '</_next/static/css/app/layout.css>; rel=preload; as=style',
      ].join(', ')
    );
  }

  // Special handling for admin panel and preview requests
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
  const isPreviewRequest =
    request.headers.get('sec-fetch-dest') === 'iframe' ||
    request.headers.get('referer')?.includes('/admin');

  if (isAdminPath || isPreviewRequest) {
    console.log('[Middleware] Special handling for admin/preview path:', request.nextUrl.pathname);
    const response = NextResponse.next();

    // Add security headers but with modified CSP for admin panel
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Build CSP for admin panel with frame-ancestors allowing same-origin
    const adminCSP = buildCSPHeader().replace("frame-ancestors 'none'", "frame-ancestors 'self'");
    response.headers.set('Content-Security-Policy', adminCSP);

    // Allow framing from same origin for preview functionality
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');

    return response;
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

  // Apply rate limiting and CSRF protection for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Rate limiting first
    const rateLimitResponse = await rateLimitMiddleware(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // CSRF protection for mutation endpoints (skip for safe methods and public endpoints)
    const isPublicEndpoint = request.nextUrl.pathname.startsWith('/api/public/');
    const isSafeMethod = ['GET', 'HEAD', 'OPTIONS'].includes(request.method);
    const isWebhook = request.nextUrl.pathname.includes('/webhook');
    const isHealthCheck = request.nextUrl.pathname.includes('/health');

    if (!isPublicEndpoint && !isSafeMethod && !isWebhook && !isHealthCheck) {
      // Check for CSRF token
      const headerToken = request.headers.get('x-csrf-token');
      const cookieToken = request.cookies.get('csrf-token')?.value;

      if (!headerToken || !cookieToken || headerToken !== cookieToken) {
        return NextResponse.json({ error: 'Invalid or missing CSRF token' }, { status: 403 });
      }

      // Verify token validity
      const isValidToken = await verifyCSRFToken(headerToken);
      if (!isValidToken) {
        return NextResponse.json({ error: 'Invalid or expired CSRF token' }, { status: 403 });
      }
    }
  }

  // CSP is handled by buildCSPHeader with strict-dynamic for better security

  const response = NextResponse.next();

  // Add performance headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/public')) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=60, s-maxage=300, stale-while-revalidate=600'
    );
    response.headers.set('CDN-Cache-Control', 'max-age=900');
  }

  // Add rate limit headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    try {
      const rateLimiter = getEdgeSafeRateLimiter();
      const identifier =
        request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
        request.headers.get('x-real-ip') ||
        request.headers.get('cf-connecting-ip') ||
        'anonymous';

      const endpointType = getEndpointType(request.nextUrl.pathname);
      const config = getRateLimitConfig(endpointType);

      // Get current rate limit status without incrementing
      const remaining = await rateLimiter.getRemainingAttempts(
        identifier,
        request.nextUrl.pathname,
        config
      );

      // Add headers
      response.headers.set('X-RateLimit-Limit', config.requests.toString());
      response.headers.set('X-RateLimit-Remaining', remaining.toString());
    } catch (error) {
      // Silently fail - don't break the request over rate limit headers
      console.error('Failed to add rate limit headers:', error);
    }
  }

  // Add comprehensive security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  );

  // Add Content Security Policy with strict-dynamic for production security
  response.headers.set('Content-Security-Policy', buildCSPHeader());

  // Add additional security headers
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('X-DNS-Prefetch-Control', 'on'); // Enable DNS prefetch for performance
  response.headers.set('X-Download-Options', 'noopen');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');

  // Additional modern security headers
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');

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

    // Log to console for immediate visibility
    if (process.env.NODE_ENV === 'production') {
      console.log('[ADMIN_ACCESS]', JSON.stringify(accessLog));
    }

    // TODO: When payload is available in middleware, log to SecurityLogs collection
    // Currently, Payload cannot be accessed in Edge Runtime
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
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)', '/api/:path*'],
};
