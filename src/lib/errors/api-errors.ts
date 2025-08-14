import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { BaseError, ErrorCode, HttpStatus } from './base';

/**
 * Internal server error for unexpected errors
 */
export class InternalServerError extends BaseError {
  constructor(message: string = 'Internal server error', details?: unknown) {
    super(message, ErrorCode.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR, false, details);
  }
}

/**
 * API error response interface
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    statusCode: number;
    timestamp: string;
    requestId?: string;
    details?: unknown;
    validationErrors?: Array<{
      field: string;
      message: string;
    }>;
  };
}

/**
 * Generic API errors
 */
export class ValidationError extends BaseError {
  constructor(message: string, details?: unknown) {
    super(message, ErrorCode.VALIDATION_ERROR, HttpStatus.BAD_REQUEST, true, details);
  }

  getUserMessage(): string {
    return 'Invalid input provided. Please check your data and try again.';
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message = 'Unauthorized access') {
    super(message, ErrorCode.UNAUTHORIZED, HttpStatus.UNAUTHORIZED, true);
  }

  getUserMessage(): string {
    return 'You need to be authenticated to access this resource.';
  }
}

export class ForbiddenError extends BaseError {
  constructor(resource: string) {
    super(
      `Access forbidden to resource: ${resource}`,
      ErrorCode.FORBIDDEN,
      HttpStatus.FORBIDDEN,
      true,
      { resource }
    );
  }

  getUserMessage(): string {
    return 'You do not have permission to access this resource.';
  }
}

export class NotFoundError extends BaseError {
  constructor(resource: string) {
    super(
      `Resource not found: ${resource}`,
      ErrorCode.NOT_FOUND,
      HttpStatus.NOT_FOUND,
      true,
      { resource }
    );
  }

  getUserMessage(): string {
    return 'The requested resource could not be found.';
  }
}

export class RateLimitError extends BaseError {
  constructor(limit: number, window: number, resetAt: Date) {
    super(
      `Rate limit exceeded: ${limit} requests per ${window} seconds`,
      ErrorCode.RATE_LIMIT_EXCEEDED,
      HttpStatus.TOO_MANY_REQUESTS,
      true,
      { limit, window, resetAt }
    );
  }

  getUserMessage(): string {
    return 'Too many requests. Please try again later.';
  }
}

export class ServiceUnavailableError extends BaseError {
  constructor(service: string, reason?: string) {
    super(
      `Service unavailable: ${service}${reason ? ` - ${reason}` : ''}`,
      ErrorCode.SERVICE_UNAVAILABLE,
      HttpStatus.SERVICE_UNAVAILABLE,
      true,
      { service, reason }
    );
  }

  getUserMessage(): string {
    return 'The service is temporarily unavailable. Please try again later.';
  }
}

/**
 * Format error for API response
 */
export function formatApiError(
  error: unknown,
  requestId?: string
): { response: NextResponse; logError: boolean } {
  let baseError: BaseError;
  let logError = true;

  // Handle different error types
  if (error instanceof BaseError) {
    baseError = error;
    logError = !baseError.isOperational;
  } else if (error instanceof ZodError) {
    // Handle Zod validation errors
    const validationErrors = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    baseError = new ValidationError('Validation failed', { validationErrors });
  } else if (error instanceof Error) {
    // Generic error - treat as internal error
    baseError = new InternalServerError(
      error.message,
      { originalError: error.message, stack: error.stack }
    );
  } else {
    // Unknown error type
    baseError = new InternalServerError(
      'An unexpected error occurred',
      { originalError: error }
    );
  }

  // Log the error
  if (logError) {
    baseError.log();
  }

  // Create error response
  const errorResponse: ApiErrorResponse = {
    success: false,
    error: {
      code: baseError.code,
      message: baseError.getUserMessage(),
      statusCode: baseError.statusCode,
      timestamp: new Date().toISOString(),
      ...(requestId && { requestId }),
      ...(process.env.NODE_ENV === 'development' && {
        details: baseError.details,
        ...((baseError.details as any)?.validationErrors && {
          validationErrors: (baseError.details as any).validationErrors,
        }),
      }),
    },
  };

  // Add specific headers based on error type
  const headers = new Headers();
  
  if (baseError.code === ErrorCode.RATE_LIMIT_EXCEEDED) {
    const details = baseError.details as any;
    headers.set('X-RateLimit-Limit', details.limit.toString());
    headers.set('X-RateLimit-Remaining', '0');
    headers.set('X-RateLimit-Reset', details.resetAt.toISOString());
    headers.set('Retry-After', Math.ceil((details.resetAt.getTime() - Date.now()) / 1000).toString());
  }

  return {
    response: NextResponse.json(errorResponse, {
      status: baseError.statusCode,
      headers,
    }),
    logError,
  };
}

/**
 * Create error response helper
 */
export function createErrorResponse(
  error: unknown,
  requestId?: string
): NextResponse {
  const { response } = formatApiError(error, requestId);
  return response;
}

/**
 * Error handler middleware for API routes
 */
export function withErrorHandler<T extends unknown[], R>(
  handler: (...args: T) => Promise<R>
): (...args: T) => Promise<R | NextResponse> {
  return async (...args: T) => {
    try {
      return await handler(...args);
    } catch (error) {
      return createErrorResponse(error);
    }
  };
}