import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function handleStaticFiles(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if this is a static asset request
  if (
    pathname.startsWith('/_next/static/') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.js')
  ) {
    const response = NextResponse.next();

    // Set correct content-type headers for CSS files
    if (pathname.endsWith('.css')) {
      response.headers.set('Content-Type', 'text/css; charset=utf-8');
    }

    // Set correct content-type headers for JS files
    if (pathname.endsWith('.js')) {
      response.headers.set('Content-Type', 'application/javascript; charset=utf-8');
    }

    // Add cache headers for static assets
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    return response;
  }

  return null;
}
