export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }
}

export const onRequestError = async (err: unknown, request: unknown, context: unknown) => {
  const Sentry = await import('@sentry/nextjs');
  Sentry.captureRequestError(
    err as Error,
    request as {
      path: string;
      method: string;
      headers: Record<string, string | string[] | undefined>;
    },
    context as { routerKind: string; routePath: string; routeType: string }
  );
};
