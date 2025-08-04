'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log critical errors
    console.error('Global application error:', error);
    
    // Send to monitoring in production
    // Sentry integration disabled temporarily
    // if (process.env.NODE_ENV === 'production' && window.Sentry) {
    //   window.Sentry.captureException(error, {
    //     level: 'fatal',
    //     tags: {
    //       errorBoundary: 'global'
    //     }
    //   });
    // }
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
          <div className="max-w-md w-full text-center">
            <h1 className="text-6xl font-bold text-red-600 mb-4">Critical Error</h1>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              The application encountered a critical error
            </h2>
            <p className="text-gray-600 mb-8">
              Please refresh the page to continue. If the problem persists, contact support.
            </p>
            <button
              onClick={reset}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}