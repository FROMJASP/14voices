import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createErrorResponse } from '@/lib/errors/api-errors';
import { logger, logApiRequest, logApiResponse } from '@/lib/errors/logger';

export interface ApiHandlerOptions {
  requireAuth?: boolean;
  rateLimit?: {
    requests: number;
    window: number;
  };
  validateBody?: (body: unknown) => boolean | Promise<boolean>;
}

/**
 * Enhanced API handler with comprehensive error handling
 */
export function createErrorHandlingApiHandler<T = unknown>(
  handler: (req: NextRequest, context: ApiContext) => Promise<T>,
  options: ApiHandlerOptions = {}
): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest) => {
    const requestId = uuidv4();
    const startTime = performance.now();
    const method = req.method;
    const path = req.nextUrl.pathname;

    // Create API context
    const context: ApiContext = {
      requestId,
      method,
      path,
      headers: Object.fromEntries(req.headers.entries()),
    };

    try {
      // Log incoming request
      logApiRequest(method, path, { requestId });

      // Authentication check
      if (options.requireAuth) {
        const authResult = await checkAuthentication(req);
        if (!authResult.authenticated) {
          throw new UnauthorizedError('Authentication required');
        }
        context.userId = authResult.userId;
        context.sessionId = authResult.sessionId;
      }

      // Rate limiting
      if (options.rateLimit) {
        await checkRateLimit(req, options.rateLimit, requestId);
      }

      // Body validation
      if (options.validateBody && ['POST', 'PUT', 'PATCH'].includes(method)) {
        const body = await req.json();
        const isValid = await options.validateBody(body);
        if (!isValid) {
          throw new ValidationError('Invalid request body');
        }
      }

      // Execute handler
      const result = await handler(req, context);

      // Create success response
      const response = result instanceof NextResponse 
        ? result 
        : NextResponse.json(
            {
              success: true,
              data: result,
              requestId,
              timestamp: new Date().toISOString(),
            },
            { status: 200 }
          );

      // Log successful response
      const duration = performance.now() - startTime;
      logApiResponse(method, path, response.status, duration, { requestId });

      // Add request ID header
      response.headers.set('X-Request-ID', requestId);

      return response;
    } catch (error) {
      // Log error
      const duration = performance.now() - startTime;
      logger.error(`API error on ${method} ${path}`, error, {
        requestId,
        action: 'api_error',
        metadata: { duration },
      });

      // Create error response
      const errorResponse = createErrorResponse(error, requestId);
      
      // Log error response
      logApiResponse(method, path, errorResponse.status, duration, { 
        requestId,
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
      });

      return errorResponse;
    }
  };
}

/**
 * API context interface
 */
export interface ApiContext {
  requestId: string;
  method: string;
  path: string;
  headers: Record<string, string>;
  userId?: string;
  sessionId?: string;
}

/**
 * Authentication check helper
 */
async function checkAuthentication(req: NextRequest): Promise<{
  authenticated: boolean;
  userId?: string;
  sessionId?: string;
}> {
  // TODO: Implement actual authentication logic
  // This is a placeholder - integrate with your auth system
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authenticated: false };
  }

  // Verify token and extract user info
  try {
    // const token = authHeader.substring(7);
    // const decoded = await verifyToken(token);
    // return {
    //   authenticated: true,
    //   userId: decoded.userId,
    //   sessionId: decoded.sessionId,
    // };
    
    // Placeholder return
    return { authenticated: true, userId: 'placeholder-user' };
  } catch {
    return { authenticated: false };
  }
}

/**
 * Rate limiting check helper
 */
async function checkRateLimit(
  req: NextRequest,
  limits: { requests: number; window: number },
  requestId: string
): Promise<void> {
  try {
    // Dynamic import to avoid Edge Runtime issues
    const { checkRateLimit: performRateLimitCheck } = await import('@/lib/api/handlers');
    
    const identifier = req.headers.get('x-forwarded-for') || 
                      req.headers.get('x-real-ip') || 
                      'anonymous';

    const { allowed, resetAt } = await performRateLimitCheck(
      identifier,
      limits.requests,
      limits.window
    );

    if (!allowed) {
      throw new RateLimitError(limits.requests, limits.window, new Date(resetAt));
    }
  } catch (error) {
    // If it's already a RateLimitError, re-throw
    if (error instanceof RateLimitError) {
      throw error;
    }
    
    // Log but don't fail on rate limit check errors
    logger.warn('Rate limit check failed, allowing request', {
      requestId,
      action: 'rate_limit_check_error',
      metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
}

// Import error classes
import { ValidationError, UnauthorizedError, RateLimitError } from '@/lib/errors/api-errors';