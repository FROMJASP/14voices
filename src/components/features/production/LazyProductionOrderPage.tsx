/**
 * Lazy-loaded Production Order Page with optimized loading
 * This component is only loaded when a production drawer is opened
 */

'use client';

import React, { lazy, Suspense, memo } from 'react';
import { performanceMonitor } from '@/lib/performance-monitoring';

// Lazy load the actual ProductionOrderPage component
const ProductionOrderPageComponent = lazy(() =>
  performanceMonitor.measureLazyLoad(
    'ProductionOrderPage',
    import('./ProductionOrderPage').then((module) => ({
      default: module.ProductionOrderPage,
    }))
  )
);

// Optimized loading fallback for production order page
const OrderPageLoadingFallback = memo(() => (
  <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center p-8">
    <div className="animate-pulse space-y-4 w-full max-w-md">
      {/* Production header skeleton */}
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>

      {/* Form skeleton */}
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Button skeleton */}
      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mt-6"></div>
    </div>

    <div className="mt-4 flex items-center text-sm text-muted-foreground">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
      Loading order form...
    </div>
  </div>
));

OrderPageLoadingFallback.displayName = 'OrderPageLoadingFallback';

// Error boundary specific to order page
class OrderPageErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ProductionOrderPage Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="text-red-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Unable to load order form
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              There was a problem loading the production order form. Please try refreshing the page.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

interface LazyProductionOrderPageProps {
  productionIndex: number;
  voiceovers: any[];
  hideCloseButton?: boolean;
}

export const LazyProductionOrderPage = memo(function LazyProductionOrderPage({
  productionIndex,
  voiceovers,
  hideCloseButton = false,
}: LazyProductionOrderPageProps) {
  return (
    <OrderPageErrorBoundary>
      <Suspense fallback={<OrderPageLoadingFallback />}>
        <ProductionOrderPageComponent
          productionIndex={productionIndex}
          voiceovers={voiceovers}
          hideCloseButton={hideCloseButton}
        />
      </Suspense>
    </OrderPageErrorBoundary>
  );
});

LazyProductionOrderPage.displayName = 'LazyProductionOrderPage';
