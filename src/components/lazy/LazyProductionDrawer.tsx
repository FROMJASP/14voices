/**
 * Lazy-loaded Production Drawer with optimized loading and error boundaries
 * This component is only loaded when needed to reduce initial bundle size
 */

'use client';

import React, { lazy, Suspense, memo } from 'react';
import { performanceMonitor } from '@/lib/performance-monitoring';

// Lazy load the actual ProductionDrawer component
const ProductionDrawerComponent = lazy(() => 
  performanceMonitor.measureLazyLoad(
    'ProductionDrawer',
    import('@/components/drawer/ProductionDrawerOptimized').then(module => ({
      default: module.ProductionDrawerOptimized
    }))
  )
);

// Optimized loading fallback
const DrawerLoadingFallback = memo(() => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] flex items-center justify-center">
    <div className="bg-white dark:bg-card rounded-lg p-6 shadow-2xl">
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        <span className="text-sm font-medium">Loading production details...</span>
      </div>
    </div>
  </div>
));

DrawerLoadingFallback.displayName = 'DrawerLoadingFallback';

// Error boundary component
class DrawerErrorBoundary extends React.Component<
  { children: React.ReactNode; onRetry?: () => void },
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
    console.error('ProductionDrawer Error:', error, errorInfo);
    
    // Track error in development
    if (process.env.NODE_ENV === 'development') {
      performanceMonitor.trackComponentRender('ProductionDrawer-Error', 0);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] flex items-center justify-center">
          <div className="bg-white dark:bg-card rounded-lg p-6 shadow-2xl max-w-md mx-4">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Something went wrong
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Unable to load the production details. Please try again.
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => {
                    this.setState({ hasError: false, error: null });
                    this.props.onRetry?.();
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/90 transition-colors"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

interface LazyProductionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  productionSlug: string | null;
  children: React.ReactNode;
}

export const LazyProductionDrawer = memo(function LazyProductionDrawer({
  isOpen,
  onClose,
  productionSlug,
  children,
}: LazyProductionDrawerProps) {
  // Don't render anything if drawer is not open
  if (!isOpen) {
    return null;
  }

  return (
    <DrawerErrorBoundary onRetry={() => window.location.reload()}>
      <Suspense fallback={<DrawerLoadingFallback />}>
        <ProductionDrawerComponent
          isOpen={isOpen}
          onClose={onClose}
          productionSlug={productionSlug}
        >
          {children}
        </ProductionDrawerComponent>
      </Suspense>
    </DrawerErrorBoundary>
  );
});

LazyProductionDrawer.displayName = 'LazyProductionDrawer';