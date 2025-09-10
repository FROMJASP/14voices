import * as Sentry from '@sentry/nextjs';

/**
 * Base error class for all application errors
 */
export abstract class BaseError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: unknown;
  public readonly timestamp: Date;

  constructor(
    message: string,
    code: string,
    statusCode: number,
    isOperational = true,
    details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    this.timestamp = new Date();

    // Ensure proper prototype chain
    Object.setPrototypeOf(this, new.target.prototype);

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Log the error with appropriate context
   */
  log(): void {
    const errorInfo = {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      isOperational: this.isOperational,
      details: this.details,
      timestamp: this.timestamp,
      stack: this.stack,
    };

    if (this.isOperational) {
      console.warn('[Operational Error]', errorInfo);
    } else {
      console.error('[Programming Error]', errorInfo);
    }

    // Send to Sentry in production
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureException(this, {
        tags: {
          error_code: this.code,
          is_operational: this.isOperational,
        },
        extra: {
          details: this.details,
          statusCode: this.statusCode,
        },
      });
    }
  }

  /**
   * Convert error to a safe object for client response
   */
  toJSON(): Record<string, unknown> {
    return {
      error: {
        name: this.name,
        code: this.code,
        message: this.message,
        statusCode: this.statusCode,
        timestamp: this.timestamp,
        // Only include details in development
        ...(process.env.NODE_ENV === 'development' && { details: this.details }),
      },
    };
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(): string {
    // Override in subclasses for custom user messages
    return this.message;
  }
}

/**
 * Error codes enum for consistency
 */
export enum ErrorCode {
  // General errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  BAD_REQUEST = 'BAD_REQUEST',

  // Domain-specific errors
  VOICEOVER_NOT_FOUND = 'VOICEOVER_NOT_FOUND',
  VOICEOVER_UNAVAILABLE = 'VOICEOVER_UNAVAILABLE',
  BOOKING_FAILED = 'BOOKING_FAILED',
  BOOKING_NOT_FOUND = 'BOOKING_NOT_FOUND',
  BOOKING_ALREADY_EXISTS = 'BOOKING_ALREADY_EXISTS',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_PROCESSING = 'PAYMENT_PROCESSING',
  INVALID_PAYMENT_METHOD = 'INVALID_PAYMENT_METHOD',
  EMAIL_SEND_FAILED = 'EMAIL_SEND_FAILED',
  EMAIL_TEMPLATE_NOT_FOUND = 'EMAIL_TEMPLATE_NOT_FOUND',
  FILE_UPLOAD_FAILED = 'FILE_UPLOAD_FAILED',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  DATABASE_ERROR = 'DATABASE_ERROR',
  CACHE_ERROR = 'CACHE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
}

/**
 * HTTP status codes
 */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  PAYLOAD_TOO_LARGE = 413,
  UNSUPPORTED_MEDIA_TYPE = 415,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}
