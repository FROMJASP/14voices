'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { errorMonitoring } from '@/lib/errors/monitoring';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error with enhanced monitoring
    console.error('Application error:', error);

    // Capture error with context
    const errorContext = {
      tags: {
        error_boundary: 'app',
        digest: error.digest || 'unknown',
      },
      extra: {
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack,
      },
    };

    // Send to monitoring service
    errorMonitoring.captureError(error, errorContext);

    // Add breadcrumb for error occurrence
    errorMonitoring.addBreadcrumb({
      message: 'App error boundary triggered',
      level: 'error',
      category: 'error-boundary',
      data: {
        errorMessage: error.message,
        digest: error.digest,
      },
    });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-surface">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <svg
            className="mx-auto h-16 w-16 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-text-primary mb-4">Oops! Something went wrong</h1>
        <p className="text-text-secondary mb-8">
          We apologize for the inconvenience. Our team has been automatically notified and is
          working to fix this issue.
        </p>

        {/* Error ID for support reference */}
        {error.digest && (
          <p className="text-sm text-text-secondary mb-6">
            Error ID:{' '}
            <code className="font-mono text-xs bg-background px-2 py-1 rounded">
              {error.digest}
            </code>
          </p>
        )}

        {/* Development error details */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mb-8 text-left">
            <summary className="cursor-pointer text-sm text-text-secondary hover:text-text-primary transition-colors">
              Error details (development only)
            </summary>
            <div className="mt-4 space-y-2">
              <div className="text-xs text-text-secondary">
                <strong>Message:</strong>
                <pre className="mt-1 overflow-auto p-3 bg-background rounded-lg whitespace-pre-wrap">
                  {error.message}
                </pre>
              </div>
              {error.stack && (
                <div className="text-xs text-text-secondary">
                  <strong>Stack trace:</strong>
                  <pre className="mt-1 overflow-auto p-3 bg-background rounded-lg text-xs max-h-64">
                    {error.stack}
                  </pre>
                </div>
              )}
            </div>
          </details>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => {
              errorMonitoring.addBreadcrumb({
                message: 'User clicked Try Again',
                category: 'user-action',
                data: { errorDigest: error.digest },
              });
              reset();
            }}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Try again
          </button>
          <button
            onClick={() => {
              errorMonitoring.addBreadcrumb({
                message: 'User navigated to home',
                category: 'user-action',
                data: { errorDigest: error.digest },
              });
              router.push('/');
            }}
            className="px-6 py-3 bg-surface border border-border text-text-primary rounded-lg hover:bg-background transition-colors font-medium"
          >
            Go to homepage
          </button>
        </div>
      </div>
    </div>
  );
}
