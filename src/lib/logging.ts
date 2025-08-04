import * as Sentry from '@sentry/nextjs';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}

export interface LogContext {
  userId?: string;
  requestId?: string;
  path?: string;
  method?: string;
  statusCode?: number;
  duration?: number;
  error?: Error;
  metadata?: Record<string, unknown>;
}

class Logger {
  private context: LogContext = {};

  setContext(context: Partial<LogContext>) {
    this.context = { ...this.context, ...context };
  }

  clearContext() {
    this.context = {};
  }

  private formatMessage(level: LogLevel, message: string, context?: Partial<LogContext>) {
    const timestamp = new Date().toISOString();
    const fullContext = { ...this.context, ...context };
    
    return {
      timestamp,
      level,
      message,
      ...fullContext
    };
  }

  private log(level: LogLevel, message: string, context?: Partial<LogContext>) {
    const formatted = this.formatMessage(level, message, context);
    
    // Console logging
    switch (level) {
      case LogLevel.DEBUG:
        if (process.env.NODE_ENV !== 'production') {
          console.debug(JSON.stringify(formatted));
        }
        break;
      case LogLevel.INFO:
        console.info(JSON.stringify(formatted));
        break;
      case LogLevel.WARN:
        console.warn(JSON.stringify(formatted));
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(JSON.stringify(formatted));
        break;
    }

    // Send to Sentry in production
    if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
      if (level === LogLevel.ERROR || level === LogLevel.FATAL) {
        Sentry.captureMessage(message, {
          level: level === LogLevel.FATAL ? 'fatal' : 'error',
          tags: {
            logLevel: level
          },
          extra: formatted
        });
      }

      if (context?.error) {
        Sentry.captureException(context.error, {
          tags: {
            logLevel: level
          },
          extra: formatted
        });
      }
    }
  }

  debug(message: string, context?: Partial<LogContext>) {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Partial<LogContext>) {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Partial<LogContext>) {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, context?: Partial<LogContext>) {
    this.log(LogLevel.ERROR, message, context);
  }

  fatal(message: string, context?: Partial<LogContext>) {
    this.log(LogLevel.FATAL, message, context);
  }

  // Performance logging
  startTimer(label: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.info(`Performance: ${label}`, { duration });
    };
  }

  // API request logging
  logApiRequest(req: Request, res: Response, duration: number) {
    const context: LogContext = {
      path: new URL(req.url).pathname,
      method: req.method,
      statusCode: res.status,
      duration,
      metadata: {
        userAgent: req.headers.get('user-agent'),
        referer: req.headers.get('referer')
      }
    };

    const message = `${req.method} ${new URL(req.url).pathname} ${res.status} ${duration}ms`;
    
    if (res.status >= 500) {
      this.error(message, context);
    } else if (res.status >= 400) {
      this.warn(message, context);
    } else {
      this.info(message, context);
    }
  }

  // Database query logging
  logQuery(query: string, duration: number, error?: Error) {
    const context: LogContext = {
      duration,
      error,
      metadata: {
        query: query.substring(0, 200) // Truncate long queries
      }
    };

    if (error) {
      this.error('Database query failed', context);
    } else if (duration > 1000) {
      this.warn('Slow database query', context);
    } else {
      this.debug('Database query executed', context);
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Middleware for request logging
export function withRequestLogging<T extends (...args: any[]) => Promise<Response>>(
  handler: T
): T {
  return (async (...args) => {
    const start = performance.now();
    const [req] = args as [Request];
    
    logger.setContext({
      requestId: crypto.randomUUID(),
      path: new URL(req.url).pathname,
      method: req.method
    });

    try {
      const response = await handler(...args);
      const duration = performance.now() - start;
      
      logger.logApiRequest(req, response, duration);
      
      return response;
    } catch (error) {
      const duration = performance.now() - start;
      
      logger.error('Request failed', {
        error: error as Error,
        duration
      });
      
      throw error;
    } finally {
      logger.clearContext();
    }
  }) as T;
}