import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  debug: process.env.NODE_ENV === 'development',

  // Capture unhandled promise rejections
  integrations: [
    Sentry.captureConsoleIntegration({
      levels: ['error', 'warn'],
    }),
  ],

  beforeSend(event) {
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[Sentry Server]', event.exception || event.message);
      // Don't send to Sentry unless it's a test
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
