'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';
import { logger } from '@/lib/errors/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, errorInfo: ErrorInfo) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
  isolate?: boolean;
  level?: 'page' | 'section' | 'component';
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorBoundaryKey: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: NodeJS.Timeout | null = null;
  private errorCounter = 0;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorBoundaryKey: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { onError, level = 'component' } = this.props;

    this.errorCounter++;

    // Log the error
    logger.error(`React ErrorBoundary caught error at ${level} level`, error, {
      action: 'error_boundary',
      metadata: {
        componentStack: errorInfo.componentStack,
        level,
        errorCount: this.errorCounter,
      },
    });

    // Report to Sentry
    if (process.env.NODE_ENV === 'production') {
      Sentry.withScope((scope) => {
        scope.setTag('error_boundary', true);
        scope.setTag('error_boundary_level', level);
        scope.setContext('errorInfo', {
          componentStack: errorInfo.componentStack,
          errorCount: this.errorCounter,
        });
        Sentry.captureException(error);
      });
    }

    // Call custom error handler
    onError?.(error, errorInfo);

    // Update state with error info
    this.setState({ errorInfo });

    // Auto-reset after 10 seconds for component-level errors
    if (level === 'component' && this.errorCounter < 3) {
      this.resetTimeoutId = setTimeout(() => {
        this.resetErrorBoundary();
      }, 10000);
    }
  }

  componentDidUpdate(prevProps: Props): void {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (resetKeys?.some((key, idx) => key !== prevProps.resetKeys?.[idx])) {
        this.resetErrorBoundary();
      }
    }

    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.resetErrorBoundary();
    }
  }

  componentWillUnmount(): void {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  resetErrorBoundary = (): void => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
      this.resetTimeoutId = null;
    }

    this.errorCounter = 0;
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorBoundaryKey: this.state.errorBoundaryKey + 1,
    });
  };

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback, isolate, level = 'component' } = this.props;

    if (hasError && error) {
      // Custom fallback
      if (typeof fallback === 'function') {
        return fallback(error, errorInfo!);
      }

      // Provided fallback component
      if (fallback) {
        return fallback;
      }

      // Default fallback based on level
      return <ErrorFallback error={error} level={level} onReset={this.resetErrorBoundary} />;
    }

    // Wrap in a key to force re-mount on reset
    return isolate ? <div key={this.state.errorBoundaryKey}>{children}</div> : children;
  }
}

interface ErrorFallbackProps {
  error: Error;
  level: 'page' | 'section' | 'component';
  onReset: () => void;
}

function ErrorFallback({ error, level, onReset }: ErrorFallbackProps) {
  if (level === 'page') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-surface">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <svg
              className="mx-auto h-12 w-12 text-red-500"
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
          <h1 className="text-2xl font-semibold text-text-primary mb-2">Something went wrong</h1>
          <p className="text-text-secondary mb-6">
            We&apos;re sorry for the inconvenience. Please try refreshing the page.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-sm text-text-secondary hover:text-text-primary">
                Error details
              </summary>
              <pre className="mt-2 text-xs text-text-secondary overflow-auto p-4 bg-background rounded-lg">
                {error.message}
                {error.stack}
              </pre>
            </details>
          )}
          <div className="flex gap-4 justify-center">
            <button
              onClick={onReset}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-surface text-text-primary rounded-lg hover:bg-surface/80 transition-colors"
            >
              Refresh page
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (level === 'section') {
    return (
      <div className="p-8 text-center bg-surface rounded-lg">
        <svg
          className="mx-auto h-8 w-8 text-yellow-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-text-secondary mb-4">This section couldn&apos;t be loaded</p>
        <button
          onClick={onReset}
          className="text-sm text-primary hover:text-primary/80 transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  // Component level - minimal UI
  return (
    <div className="p-4 text-center text-sm text-text-secondary">
      <p>Unable to load this component</p>
      <button
        onClick={onReset}
        className="mt-2 text-primary hover:text-primary/80 transition-colors"
      >
        Retry
      </button>
    </div>
  );
}

// Export a higher-order component for easier use
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
): React.ComponentType<P> {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}
