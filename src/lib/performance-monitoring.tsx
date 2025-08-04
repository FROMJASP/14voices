/**
 * Performance monitoring utilities for tracking bundle sizes and runtime metrics
 * Built specifically for Next.js applications with performance optimization
 */

// Bundle size tracking interface
interface BundleMetrics {
  totalSize: number;
  jsSize: number;
  cssSize: number;
  imageSize: number;
  timestamp: number;
}

// Core Web Vitals tracking
interface WebVitals {
  CLS: number | null;
  FID: number | null;
  FCP: number | null;
  LCP: number | null;
  TTFB: number | null;
  INP: number | null;
}

// Performance observer for tracking metrics
export class PerformanceMonitor {
  private metrics: WebVitals = {
    CLS: null,
    FID: null,
    FCP: null,
    LCP: null,
    TTFB: null,
    INP: null,
  };

  private bundleMetrics: BundleMetrics[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers();
      this.trackInitialLoad();
    }
  }

  private initializeObservers() {
    // Performance Observer for Core Web Vitals
    if ('PerformanceObserver' in window) {
      // LCP Observer
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.metrics.LCP = lastEntry.startTime;
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // FID Observer
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.FID = entry.processingStart - entry.startTime;
        });
      });
      fidObserver.observe({ type: 'first-input', buffered: true });

      // CLS Observer
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.metrics.CLS = clsValue;
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });

      // Navigation timing for TTFB and FCP
      const navigationObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.entryType === 'navigation') {
            this.metrics.TTFB = entry.responseStart - entry.requestStart;
          }
          if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
            this.metrics.FCP = entry.startTime;
          }
        });
      });
      navigationObserver.observe({ type: 'navigation', buffered: true });
      navigationObserver.observe({ type: 'paint', buffered: true });
    }
  }

  private trackInitialLoad() {
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.collectBundleMetrics();
        }, 1000);
      });
    }
  }

  private collectBundleMetrics() {
    if (!('performance' in window)) return;

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    let totalSize = 0;
    let jsSize = 0;
    let cssSize = 0;
    let imageSize = 0;

    resources.forEach((resource) => {
      const size = resource.transferSize || resource.encodedBodySize || 0;
      totalSize += size;

      if (resource.name.includes('.js')) {
        jsSize += size;
      } else if (resource.name.includes('.css')) {
        cssSize += size;
      } else if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        imageSize += size;
      }
    });

    this.bundleMetrics.push({
      totalSize,
      jsSize,
      cssSize,
      imageSize,
      timestamp: Date.now(),
    });
  }

  /**
   * Get current Core Web Vitals metrics
   */
  getWebVitals(): WebVitals {
    return { ...this.metrics };
  }

  /**
   * Get bundle size metrics
   */
  getBundleMetrics(): BundleMetrics[] {
    return [...this.bundleMetrics];
  }

  /**
   * Log performance summary to console (development only)
   */
  logPerformanceSummary() {
    if (process.env.NODE_ENV !== 'development') return;

    console.group('🚀 Performance Metrics');
    console.log('Core Web Vitals:', this.getWebVitals());
    
    const latestBundle = this.bundleMetrics[this.bundleMetrics.length - 1];
    if (latestBundle) {
      console.log('Bundle Sizes:', {
        total: `${(latestBundle.totalSize / 1024).toFixed(2)} KB`,
        js: `${(latestBundle.jsSize / 1024).toFixed(2)} KB`,
        css: `${(latestBundle.cssSize / 1024).toFixed(2)} KB`,
        images: `${(latestBundle.imageSize / 1024).toFixed(2)} KB`,
      });
    }
    console.groupEnd();
  }

  /**
   * Track component render performance
   */
  trackComponentRender(componentName: string, renderTime: number) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`⚡ ${componentName} rendered in ${renderTime.toFixed(2)}ms`);
    }
  }

  /**
   * Measure and track lazy component loading time
   */
  async measureLazyLoad<T>(
    componentName: string,
    importPromise: Promise<T>
  ): Promise<T> {
    const startTime = performance.now();
    
    try {
      const result = await importPromise;
      const loadTime = performance.now() - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`🎯 ${componentName} lazy loaded in ${loadTime.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      console.error(`❌ Failed to lazy load ${componentName}:`, error);
      throw error;
    }
  }

  /**
   * Track memory usage (development only)
   */
  trackMemoryUsage() {
    if (process.env.NODE_ENV !== 'development' || !('memory' in performance)) return;

    const memory = (performance as any).memory;
    console.log('Memory Usage:', {
      used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
      total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
      limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`,
    });
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// HOC for performance tracking
export function withPerformanceTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => {
    const renderStartTime = React.useRef<number>(0);

    React.useLayoutEffect(() => {
      renderStartTime.current = performance.now();
    });

    React.useEffect(() => {
      const renderTime = performance.now() - renderStartTime.current;
      performanceMonitor.trackComponentRender(componentName, renderTime);
    });

    return <Component ref={ref} {...(props as P)} />;
  });

  WrappedComponent.displayName = `withPerformanceTracking(${componentName})`;
  return WrappedComponent;
}

// Hook for component-specific performance tracking
export function usePerformanceTracking(componentName: string) {
  const renderStartTime = React.useRef<number>(0);

  React.useLayoutEffect(() => {
    renderStartTime.current = performance.now();
  });

  React.useEffect(() => {
    const renderTime = performance.now() - renderStartTime.current;
    performanceMonitor.trackComponentRender(componentName, renderTime);
  });

  return {
    trackOperation: (operationName: string, operation: () => void) => {
      const startTime = performance.now();
      operation();
      const operationTime = performance.now() - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⚡ ${componentName} - ${operationName}: ${operationTime.toFixed(2)}ms`);
      }
    },
  };
}

// Import for React
import React from 'react';