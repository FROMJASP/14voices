import { NextRequest, NextResponse } from 'next/server';
import { getServerSideUser } from '@/utilities/payload';
import { withCSRFProtection } from '@/lib/csrf';
import { checkRateLimit, getRateLimitKey } from '@/lib/rate-limiter';
import { getRateLimitConfig } from '@/config/security';
import { applySecurityHeaders } from '@/lib/security-headers';
import { logSecurityEvent } from '@/lib/security-monitoring';

interface AuthOptions {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  rateLimit?: keyof typeof import('@/config/security').securityConfig.rateLimits;
  skipCSRF?: boolean;
}

/**
 * Unified security middleware for API routes
 * Combines authentication, CSRF protection, rate limiting, and security headers
 */
export function withAuth(
  handler: (req: NextRequest, context?: any) => Promise<NextResponse>,
  options: AuthOptions = {}
) {
  const {
    requireAuth = true,
    requireAdmin = false,
    rateLimit = 'public',
    skipCSRF = false
  } = options;

  return async (req: NextRequest, context?: any) => {
    try {
      // 1. Rate limiting
      const clientId = getRateLimitKey(req, rateLimit);
      const rateLimitConfig = getRateLimitConfig(rateLimit);
      const rateLimitResult = await checkRateLimit(
        clientId,
        rateLimitConfig.max,
        rateLimitConfig.windowMs
      );

      if (!rateLimitResult.allowed) {
        await logSecurityEvent({
          type: 'rate_limit_exceeded',
          severity: 'medium',
          ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
          userAgent: req.headers.get('user-agent') || 'unknown',
          path: req.url,
          method: req.method,
          details: { clientId, limit: rateLimitConfig.max },
          timestamp: new Date()
        });

        const response = NextResponse.json(
          { error: 'Too many requests' },
          { 
            status: 429,
            headers: {
              'Retry-After': String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)),
              'X-RateLimit-Limit': String(rateLimitConfig.max),
              'X-RateLimit-Remaining': '0'
            }
          }
        );
        return applySecurityHeaders(response);
      }

      // 2. Authentication check
      if (requireAuth) {
        const user = await getServerSideUser();
        
        if (!user) {
          await logSecurityEvent({
            type: 'auth_failure',
            severity: 'high',
            ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
            userAgent: req.headers.get('user-agent') || 'unknown',
            path: req.url,
            method: req.method,
            details: { reason: 'No authenticated user' },
            timestamp: new Date()
          });

          const response = NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
          );
          return applySecurityHeaders(response);
        }

        // 3. Admin check
        if (requireAdmin && !user.roles?.includes('admin')) {
          await logSecurityEvent({
            type: 'auth_failure',
            severity: 'high',
            userId: String(user.id),
            ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
            userAgent: req.headers.get('user-agent') || 'unknown',
            path: req.url,
            method: req.method,
            details: { reason: 'Insufficient permissions', requiredRole: 'admin' },
            timestamp: new Date()
          });

          const response = NextResponse.json(
            { error: 'Forbidden' },
            { status: 403 }
          );
          return applySecurityHeaders(response);
        }

        // Add user to request for handler
        (req as any).user = user;
      }

      // 4. CSRF protection for state-changing methods
      let finalHandler = handler;
      if (!skipCSRF && !['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        finalHandler = withCSRFProtection(handler);
      }

      // 5. Execute handler and apply security headers to response
      const response = await finalHandler(req, context);
      
      // Add rate limit headers
      response.headers.set('X-RateLimit-Limit', String(rateLimitConfig.max));
      response.headers.set('X-RateLimit-Remaining', String(rateLimitResult.remaining));
      response.headers.set('X-RateLimit-Reset', new Date(rateLimitResult.resetTime).toISOString());

      return applySecurityHeaders(response);

    } catch (error) {
      console.error('Security middleware error:', error);
      
      await logSecurityEvent({
        type: 'suspicious_activity',
        severity: 'medium',
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        path: req.url,
        method: req.method,
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        timestamp: new Date()
      });

      const response = NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
      return applySecurityHeaders(response);
    }
  };
}

/**
 * Middleware for public endpoints that still need rate limiting and security headers
 */
export function withPublicAuth(
  handler: (req: NextRequest, context?: any) => Promise<NextResponse>,
  options: Omit<AuthOptions, 'requireAuth' | 'requireAdmin'> = {}
) {
  return withAuth(handler, {
    ...options,
    requireAuth: false,
    requireAdmin: false
  });
}

/**
 * Middleware for admin-only endpoints
 */
export function withAdminAuth(
  handler: (req: NextRequest, context?: any) => Promise<NextResponse>,
  options: Omit<AuthOptions, 'requireAuth' | 'requireAdmin'> = {}
) {
  return withAuth(handler, {
    ...options,
    requireAuth: true,
    requireAdmin: true,
    rateLimit: options.rateLimit || 'admin'
  });
}