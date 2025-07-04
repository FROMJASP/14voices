import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Capture unhandled promise rejections
  integrations: [
    Sentry.captureConsoleIntegration({
      levels: ['error', 'warn'],
    }),
  ],

  beforeSend(event) {
    // Don't send to Sentry in development unless it's a test
    if (process.env.NODE_ENV === 'development') {
      if (!event.message?.includes('Test')) {
        return null;
      }
    }

    // Filter out non-critical errors
    if (event.level === 'log' || event.level === 'info') {
      return null;
    }

    // Don't send 404s
    if (event.tags?.statusCode === '404') {
      return null;
    }

    return event;
  },
});
