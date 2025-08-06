import { NextRequest, NextResponse } from 'next/server';
import { getEdgeSafeRateLimiter, getRateLimitConfig } from '@/lib/rate-limiter/edge-safe';
import type { securityConfig } from '@/config/security';

type RateLimitType = keyof typeof securityConfig.rateLimits;

// Map URL patterns to rate limit types
const ENDPOINT_PATTERNS: Array<{ pattern: RegExp; type: RateLimitType }> = [
  // Authentication endpoints
  { pattern: /^\/api\/auth\//i, type: 'auth' },
  { pattern: /^\/api\/login/i, type: 'auth' },
  { pattern: /^\/api\/register/i, type: 'auth' },
  { pattern: /^\/api\/reset-password/i, type: 'auth' },

  // Admin endpoints
  { pattern: /^\/api\/admin\//i, type: 'admin' },
  { pattern: /^\/admin\//i, type: 'admin' },

  // Form submissions
  { pattern: /^\/api\/forms?\//i, type: 'forms' },
  { pattern: /^\/api\/contact/i, type: 'forms' },
  { pattern: /^\/api\/submit/i, type: 'formSubmission' },

  // Email endpoints
  { pattern: /^\/api\/email\//i, type: 'email' },
  { pattern: /^\/api\/send-email/i, type: 'email' },
  { pattern: /^\/api\/campaigns?\//i, type: 'email' },

  // Webhook endpoints
  { pattern: /^\/api\/webhooks?\//i, type: 'webhooks' },
  { pattern: /^\/api\/callback/i, type: 'webhook' },

  // File upload endpoints
  { pattern: /^\/api\/upload/i, type: 'fileUpload' },
  { pattern: /^\/api\/files?\//i, type: 'fileUpload' },
  { pattern: /^\/api\/media/i, type: 'fileUpload' },
  { pattern: /^\/api\/uploadthing/i, type: 'fileUpload' },

  // Import/Export endpoints
  { pattern: /^\/api\/import/i, type: 'importExport' },
  { pattern: /^\/api\/export/i, type: 'importExport' },

  // Cron job endpoints
  { pattern: /^\/api\/cron/i, type: 'cron' },
  { pattern: /^\/api\/scheduled/i, type: 'cron' },
];

// Determine the rate limit type based on the URL path
export function getEndpointType(pathname: string): RateLimitType {
  // Check for authenticated endpoints (requires separate logic to detect auth status)
  // For now, we'll handle this in the middleware itself

  // Match against patterns
  for (const { pattern, type } of ENDPOINT_PATTERNS) {
    if (pattern.test(pathname)) {
      return type;
    }
  }

  // Default to public rate limit
  return 'public';
}

export async function rateLimitMiddleware(
  request: NextRequest,
  endpointType?: RateLimitType
): Promise<NextResponse | null> {
  try {
    const rateLimiter = getEdgeSafeRateLimiter();

    // Determine endpoint type if not provided
    const type = endpointType || getEndpointType(request.nextUrl.pathname);

    // Extract identifier from request
    const identifier =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') || // Cloudflare
      'anonymous';

    // Get rate limit configuration
    const config = getRateLimitConfig(type);

    // Check rate limit
    const result = await rateLimiter.checkLimit(identifier, request.nextUrl.pathname, config);

    // If rate limit exceeded, return 429 response
    if (!result.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((result.resetAt - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': result.limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': result.resetAt.toString(),
            'Retry-After': Math.ceil((result.resetAt - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    // Rate limit passed, return null to continue
    // The calling middleware should add rate limit headers to the response
    return null;
  } catch (error) {
    console.error('Rate limit middleware error:', error);
    // On error, allow the request to continue
    // Better to fail open than to block legitimate traffic
    return null;
  }
}

// Helper function to add rate limit headers to a response
export function addRateLimitHeaders(
  response: NextResponse,
  result: { limit: number; remaining: number; resetAt: number }
): NextResponse {
  response.headers.set('X-RateLimit-Limit', result.limit.toString());
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
  response.headers.set('X-RateLimit-Reset', result.resetAt.toString());
  return response;
}
