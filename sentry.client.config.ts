import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  debug: process.env.NODE_ENV !== 'production',
  enabled: process.env.NODE_ENV === 'production',
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
  environment: process.env.VERCEL_ENV || process.env.NODE_ENV,

  // Performance monitoring configuration
  tracePropagationTargets: [
    'localhost',
    /^https:\/\/14voices\.com/,
    /^https:\/\/[\w-]+\.vercel\.app/,
  ],

  // Error filtering and preprocessing
  beforeSend(event) {
    // Filter out known noise or sensitive information
    if (event.exception?.values?.[0]?.type === 'ChunkLoadError') {
      return null; // Ignore chunk loading errors
    }
    return event;
  },

  // Contextual information
  beforeBreadcrumb(breadcrumb) {
    // Sanitize potentially sensitive data from breadcrumbs
    if (breadcrumb.data) {
      delete breadcrumb.data.url;
      delete breadcrumb.data.referrer;
    }
    return breadcrumb;
  },
});
