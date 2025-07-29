'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  errorCount: number;
  lastErrorTime: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorCount: 0,
      lastErrorTime: 0,
    };
  }

  static getDerivedStateFromError(): State {
    const now = Date.now();
    return {
      hasError: true,
      errorCount: 1,
      lastErrorTime: now,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const now = Date.now();
    const { errorCount, lastErrorTime } = this.state;

    // Log the full error details
    console.error('ErrorBoundary caught error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);

    // If errors are happening too frequently, it might be a render loop
    if (now - lastErrorTime < 1000) {
      this.setState((prev) => ({
        errorCount: prev.errorCount + 1,
        lastErrorTime: now,
      }));

      // If too many errors in a short time, stop rendering
      if (errorCount > 5) {
        console.error('Too many errors detected, possible infinite loop:', error);
        return;
      }
    }

    // Auto-recover after 5 seconds
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }

    this.resetTimeoutId = setTimeout(() => {
      this.setState({
        hasError: false,
        errorCount: 0,
        lastErrorTime: 0,
      });
    }, 5000);
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  render() {
    if (this.state.hasError && this.state.errorCount > 5) {
      return (
        <div
          style={{
            padding: '20px',
            background: '#fee',
            border: '1px solid #fcc',
            borderRadius: '4px',
            margin: '20px',
          }}
        >
          <h2>Critical Error: Rendering Loop Detected</h2>
          <p>The application has been stopped to prevent resource exhaustion.</p>
          <p>Please refresh the page to continue.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            style={{
              padding: '20px',
              background: '#ff0000',
              color: '#ffffff',
              border: '2px solid #ff0000',
              borderRadius: '4px',
              position: 'fixed',
              top: '20px',
              left: '20px',
              right: '20px',
              zIndex: 9999,
            }}
          >
            <h2>React Error Boundary Triggered</h2>
            <p>The component will auto-recover in a few seconds...</p>
            <p>Check browser console for detailed error information.</p>
            <p>Error count: {this.state.errorCount}</p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
