import * as Sentry from '@sentry/nextjs';
import { BaseError } from './base';

/**
 * Error monitoring configuration
 */
export interface ErrorMonitoringConfig {
  enableBreadcrumbs?: boolean;
  enableUserContext?: boolean;
  enableRequestContext?: boolean;
  sensitiveDataPatterns?: RegExp[];
}

const defaultConfig: ErrorMonitoringConfig = {
  enableBreadcrumbs: true,
  enableUserContext: true,
  enableRequestContext: true,
  sensitiveDataPatterns: [
    /password/i,
    /token/i,
    /secret/i,
    /api[_-]?key/i,
    /authorization/i,
    /credit[_-]?card/i,
    /cvv/i,
    /ssn/i,
  ],
};

/**
 * Enhanced error monitoring service
 */
export class ErrorMonitoring {
  private config: ErrorMonitoringConfig;

  constructor(config: ErrorMonitoringConfig = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Capture and enrich error with context
   */
  captureError(error: unknown, context?: ErrorContext): void {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    Sentry.withScope((scope) => {
      // Add error context
      if (context) {
        this.enrichScope(scope, context);
      }

      // Add error-specific tags
      if (error instanceof BaseError) {
        scope.setTag('error_code', error.code);
        scope.setTag('is_operational', error.isOperational);
        scope.setLevel(error.isOperational ? 'warning' : 'error');

        if (error.details) {
          scope.setContext(
            'error_details',
            this.sanitizeData(error.details) as Record<string, any>
          );
        }
      }

      // Capture the error
      Sentry.captureException(error);
    });
  }

  /**
   * Track error metrics
   */
  trackErrorMetrics(error: BaseError, _context?: ErrorContext): void {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    // Track error metrics using tags and user feedback instead of deprecated metrics API
    Sentry.setTag('error_code', error.code);
    Sentry.setTag('is_operational', String(error.isOperational));

    // Add domain information
    const domain = this.getErrorDomain(error);
    if (domain) {
      Sentry.setTag('error_domain', domain);
    }

    // Track HTTP status codes
    if (error.statusCode) {
      Sentry.setTag('status_code', String(error.statusCode));
    }
  }

  /**
   * Create error report
   */
  createErrorReport(error: BaseError, context?: ErrorContext): ErrorReport {
    const report: ErrorReport = {
      id: Sentry.lastEventId() || 'unknown',
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        isOperational: error.isOperational,
      },
      context: context ? this.sanitizeData(context) : undefined,
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown',
      release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
    };

    return report;
  }

  /**
   * Set user context for error tracking
   */
  setUserContext(user: UserContext): void {
    if (!this.config.enableUserContext) {
      return;
    }

    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.username,
      ip_address: user.ipAddress,
    });
  }

  /**
   * Clear user context
   */
  clearUserContext(): void {
    Sentry.setUser(null);
  }

  /**
   * Add breadcrumb for tracking user actions
   */
  addBreadcrumb(breadcrumb: Breadcrumb): void {
    if (!this.config.enableBreadcrumbs) {
      return;
    }

    Sentry.addBreadcrumb({
      message: breadcrumb.message,
      level: breadcrumb.level || 'info',
      category: breadcrumb.category || 'user-action',
      data: breadcrumb.data
        ? (this.sanitizeData(breadcrumb.data) as Record<string, any>)
        : undefined,
      timestamp: breadcrumb.timestamp || Date.now(),
    });
  }

  /**
   * Start a new transaction for performance monitoring
   */
  startTransaction(name: string, op: string): any {
    return Sentry.startSpan({ name, op }, () => {
      // Transaction logic would go here
    });
  }

  /**
   * Enrich Sentry scope with context
   */
  private enrichScope(scope: Sentry.Scope, context: ErrorContext): void {
    // Set tags
    if (context.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    // Set extra data
    if (context.extra) {
      const sanitized = this.sanitizeData(context.extra) as Record<string, any>;
      Object.entries(sanitized).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }

    // Set request context
    if (context.request && this.config.enableRequestContext) {
      scope.setContext('request', {
        method: context.request.method,
        url: context.request.url,
        headers: this.sanitizeHeaders(context.request.headers),
        query: this.sanitizeData(context.request.query) as Record<string, any>,
      });
    }

    // Set custom contexts
    if (context.contexts) {
      Object.entries(context.contexts).forEach(([key, value]) => {
        scope.setContext(key, this.sanitizeData(value) as Record<string, any>);
      });
    }
  }

  /**
   * Sanitize sensitive data
   */
  private sanitizeData(data: unknown): unknown {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const sanitized: any = Array.isArray(data) ? [] : {};

    for (const [key, value] of Object.entries(data)) {
      // Check if key contains sensitive patterns
      const isSensitive = this.config.sensitiveDataPatterns?.some((pattern) => pattern.test(key));

      if (isSensitive) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeData(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Sanitize HTTP headers
   */
  private sanitizeHeaders(headers?: Record<string, string>): Record<string, string> {
    if (!headers) return {};

    const sanitized: Record<string, string> = {};
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'x-auth-token'];

    for (const [key, value] of Object.entries(headers)) {
      if (sensitiveHeaders.includes(key.toLowerCase())) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Get error domain from error type
   */
  private getErrorDomain(error: BaseError): string | null {
    const errorTypeToDomain: Record<string, string> = {
      VoiceoverError: 'voiceover',
      BookingError: 'booking',
      PaymentError: 'payment',
      EmailError: 'email',
      FileUploadError: 'file_upload',
      DatabaseError: 'database',
      CacheError: 'cache',
    };

    return errorTypeToDomain[error.constructor.name] || null;
  }
}

/**
 * Error context interface
 */
export interface ErrorContext {
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
  request?: {
    method: string;
    url: string;
    headers?: Record<string, string>;
    query?: Record<string, unknown>;
  };
  contexts?: Record<string, unknown>;
}

/**
 * User context interface
 */
export interface UserContext {
  id: string;
  email?: string;
  username?: string;
  ipAddress?: string;
}

/**
 * Breadcrumb interface
 */
export interface Breadcrumb {
  message: string;
  level?: Sentry.SeverityLevel;
  category?: string;
  data?: Record<string, unknown>;
  timestamp?: number;
}

/**
 * Error report interface
 */
export interface ErrorReport {
  id: string;
  timestamp: string;
  error: {
    name: string;
    message: string;
    code: string;
    statusCode: number;
    isOperational: boolean;
  };
  context?: unknown;
  environment: string;
  release?: string;
}

// Export singleton instance
export const errorMonitoring = new ErrorMonitoring();
