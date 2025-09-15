import { NextRequest, NextResponse } from 'next/server';
import { securityConfig } from '@/config/security';

/**
 * Apply CORS headers to a response based on the request origin
 * Only allows origins configured in securityConfig
 */
export function applyCorsHeaders<T = unknown>(
  request: NextRequest,
  response: NextResponse<T>
): NextResponse<T> {
  const origin = request.headers.get('origin');

  // Check if origin is in allowed list
  if (origin && securityConfig.cors.allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  } else if (!origin && process.env.NODE_ENV === 'development') {
    // Allow requests without origin in development (e.g., Postman, curl)
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  }
  // If origin is not allowed, no CORS headers are set (request will be blocked by browser)

  // Always set these headers for OPTIONS requests
  if (request.method === 'OPTIONS') {
    response.headers.set(
      'Access-Control-Allow-Methods',
      securityConfig.cors.allowedMethods.join(', ')
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      securityConfig.cors.allowedHeaders.join(', ')
    );
    response.headers.set('Access-Control-Max-Age', securityConfig.cors.maxAge.toString());
  }

  return response;
}

/**
 * Handle preflight OPTIONS requests
 */
export function handleCorsPreflightRequest(request: NextRequest): NextResponse | null {
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 });
    return applyCorsHeaders(request, response);
  }
  return null;
}
