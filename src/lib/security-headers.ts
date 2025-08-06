import { NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Generate a nonce for CSP
 */
export function generateNonce(): string {
  return crypto.randomBytes(16).toString('base64');
}

/**
 * Apply comprehensive security headers to a response
 */
export function applySecurityHeaders(
  response: NextResponse,
  options?: {
    nonce?: string;
    reportUri?: string;
    frameAncestors?: string[];
  }
): NextResponse {
  const { nonce, reportUri, frameAncestors = ["'none'"] } = options || {};

  // Content Security Policy with nonce support
  const cspDirectives = [
    "default-src 'self'",
    `script-src 'self'${nonce ? ` 'nonce-${nonce}'` : ''} https://cdn.jsdelivr.net`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.resend.com https://*.ingest.sentry.io wss:",
    "worker-src 'self' blob:",
    `frame-ancestors ${frameAncestors.join(' ')}`,
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "script-src-attr 'none'",
    'upgrade-insecure-requests',
  ];

  if (reportUri) {
    cspDirectives.push(`report-uri ${reportUri}`);
  }

  response.headers.set('Content-Security-Policy', cspDirectives.join('; '));

  // Strict Transport Security
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  // Other security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '0'); // Disabled in modern browsers, CSP is better
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  response.headers.set('X-Download-Options', 'noopen');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');

  // Permissions Policy (replaces Feature-Policy)
  const permissionsPolicy = [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()',
    'ambient-light-sensor=()',
    'autoplay=()',
    'encrypted-media=()',
    'picture-in-picture=()',
    'sync-xhr=()',
    'battery=()',
    'display-capture=()',
  ];

  response.headers.set('Permissions-Policy', permissionsPolicy.join(', '));

  // CORP and COEP for enhanced security
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');

  return response;
}

/**
 * Middleware to apply security headers to all responses
 */
export function withSecurityHeaders(handler: (req: Request) => Promise<NextResponse>) {
  return async (req: Request) => {
    const response = await handler(req);
    return applySecurityHeaders(response);
  };
}
