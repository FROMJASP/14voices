import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }
}

// Type definitions matching Sentry's expectations
type RequestInfo = {
  path: string;
  method: string;
  headers: Record<string, string | string[] | undefined>;
};

type ErrorContext = {
  routerKind: string;
  routePath: string;
  routeType: string;
};

export async function onRequestError(
  error: unknown,
  request: RequestInfo,
  errorContext: ErrorContext
): Promise<void> {
  Sentry.captureRequestError(error, request, errorContext);
}
