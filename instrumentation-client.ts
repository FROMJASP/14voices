import * as Sentry from '@sentry/nextjs';

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0, // 10% in prod, 100% in dev

  // Session Replay
  replaysOnErrorSampleRate: 1.0, // Always record replay when error occurs
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0, // 10% of sessions in prod, none in dev

  // Debug mode only in development
  debug: process.env.NODE_ENV === 'development',

  // Integrations
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Filter out noise
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
    // Network errors that are usually user connection issues
    /Failed to fetch/,
    /NetworkError/,
    /Load failed/,
  ],

  beforeSend(event, hint) {
    // Don't send events in development unless explicitly testing
    if (process.env.NODE_ENV === 'development') {
      console.error('Sentry captured:', hint.originalException);
      // Only send to Sentry if it's a test error
      if (!event.message?.includes('Test error')) {
        return null; // Don't send to Sentry
      }
    }

    // Filter out certain errors in production
    if (event.exception?.values?.[0]?.value?.includes('Script error')) {
      return null;
    }

    return event;
  },
});
