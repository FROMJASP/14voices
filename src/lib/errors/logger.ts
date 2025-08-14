import * as Sentry from '@sentry/nextjs';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

export interface LogContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  action?: string;
  resource?: string;
  metadata?: Record<string, unknown>;
}

export interface Logger {
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, error?: unknown, context?: LogContext): void;
  fatal(message: string, error?: unknown, context?: LogContext): void;
}

class ConsoleLogger implements Logger {
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage(LogLevel.DEBUG, message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    console.info(this.formatMessage(LogLevel.INFO, message, context));
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage(LogLevel.WARN, message, context));
  }

  error(message: string, error?: unknown, context?: LogContext): void {
    console.error(this.formatMessage(LogLevel.ERROR, message, context), error);
  }

  fatal(message: string, error?: unknown, context?: LogContext): void {
    console.error(this.formatMessage(LogLevel.FATAL, message, context), error);
  }
}

class SentryLogger implements Logger {
  private consoleLogger = new ConsoleLogger();

  private enrichScope(context?: LogContext): void {
    if (!context) return;

    Sentry.withScope((scope) => {
      if (context.userId) scope.setUser({ id: context.userId });
      if (context.sessionId) scope.setTag('session_id', context.sessionId);
      if (context.requestId) scope.setTag('request_id', context.requestId);
      if (context.action) scope.setTag('action', context.action);
      if (context.resource) scope.setTag('resource', context.resource);
      if (context.metadata) {
        Object.entries(context.metadata).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
      }
    });
  }

  debug(message: string, context?: LogContext): void {
    this.consoleLogger.debug(message, context);
  }

  info(message: string, context?: LogContext): void {
    this.consoleLogger.info(message, context);
    
    if (process.env.NODE_ENV === 'production') {
      this.enrichScope(context);
      Sentry.addBreadcrumb({
        message,
        level: 'info',
        category: 'app',
        data: context,
      });
    }
  }

  warn(message: string, context?: LogContext): void {
    this.consoleLogger.warn(message, context);
    
    if (process.env.NODE_ENV === 'production') {
      this.enrichScope(context);
      Sentry.addBreadcrumb({
        message,
        level: 'warning',
        category: 'app',
        data: context,
      });
    }
  }

  error(message: string, error?: unknown, context?: LogContext): void {
    this.consoleLogger.error(message, error, context);
    
    if (process.env.NODE_ENV === 'production') {
      this.enrichScope(context);
      
      if (error instanceof Error) {
        Sentry.captureException(error, {
          extra: { message, ...context },
        });
      } else {
        Sentry.captureMessage(message, 'error');
      }
    }
  }

  fatal(message: string, error?: unknown, context?: LogContext): void {
    this.consoleLogger.fatal(message, error, context);
    
    if (process.env.NODE_ENV === 'production') {
      this.enrichScope(context);
      
      if (error instanceof Error) {
        Sentry.captureException(error, {
          level: 'fatal',
          extra: { message, ...context },
        });
      } else {
        Sentry.captureMessage(message, 'fatal');
      }
    }
  }
}

// Export singleton logger instance
export const logger: Logger = process.env.NODE_ENV === 'production' 
  ? new SentryLogger()
  : new ConsoleLogger();

/**
 * Error logging utilities
 */
export function logError(error: unknown, context?: LogContext): void {
  if (error instanceof Error) {
    logger.error(error.message, error, context);
  } else {
    logger.error('Unknown error occurred', error, context);
  }
}

/**
 * Performance logging decorator
 */
export function logPerformance<T extends unknown[], R>(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: T): Promise<R> {
    const start = performance.now();
    const context: LogContext = {
      action: `${target.constructor.name}.${propertyKey}`,
      metadata: { args: args.slice(0, 3) }, // Log first 3 args only
    };

    try {
      const result = await originalMethod.apply(this, args);
      const duration = performance.now() - start;
      
      logger.info(`Performance: ${propertyKey} completed in ${duration.toFixed(2)}ms`, {
        ...context,
        metadata: { ...context.metadata, duration },
      });
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      
      logger.error(`Performance: ${propertyKey} failed after ${duration.toFixed(2)}ms`, error, {
        ...context,
        metadata: { ...context.metadata, duration },
      });
      
      throw error;
    }
  };

  return descriptor;
}

/**
 * Log API request
 */
export function logApiRequest(
  method: string,
  path: string,
  context?: LogContext
): void {
  logger.info(`API Request: ${method} ${path}`, {
    ...context,
    action: 'api_request',
    metadata: {
      method,
      path,
      ...context?.metadata,
    },
  });
}

/**
 * Log API response
 */
export function logApiResponse(
  method: string,
  path: string,
  statusCode: number,
  duration: number,
  context?: LogContext
): void {
  const level = statusCode >= 500 ? LogLevel.ERROR : statusCode >= 400 ? LogLevel.WARN : LogLevel.INFO;
  
  logger[level](`API Response: ${method} ${path} - ${statusCode} (${duration.toFixed(2)}ms)`, {
    ...context,
    action: 'api_response',
    metadata: {
      method,
      path,
      statusCode,
      duration,
      ...context?.metadata,
    },
  });
}