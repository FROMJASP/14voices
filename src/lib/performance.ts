// Performance monitoring and optimization utilities

/**
 * Performance monitoring utility for tracking component render times and identifying bottlenecks
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private measurements: Map<string, number[]> = new Map();
  private observers: Map<string, PerformanceObserver> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Start measuring a performance metric
   */
  startMeasurement(name: string): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(`${name}-start`);
    }
  }

  /**
   * End measuring a performance metric and store the result
   */
  endMeasurement(name: string): number | null {
    if (typeof window !== 'undefined' && 'performance' in window) {
      try {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);

        const entries = performance.getEntriesByName(name, 'measure');
        if (entries.length > 0) {
          const duration = entries[entries.length - 1].duration;

          // Store measurement
          if (!this.measurements.has(name)) {
            this.measurements.set(name, []);
          }
          this.measurements.get(name)!.push(duration);

          // Clean up marks
          performance.clearMarks(`${name}-start`);
          performance.clearMarks(`${name}-end`);
          performance.clearMeasures(name);

          return duration;
        }
      } catch (error) {
        console.warn(`Performance measurement failed for ${name}:`, error);
      }
    }
    return null;
  }

  /**
   * Get statistics for a performance metric
   */
  getStats(name: string): {
    count: number;
    average: number;
    min: number;
    max: number;
    latest: number;
  } | null {
    const measurements = this.measurements.get(name);
    if (!measurements || measurements.length === 0) {
      return null;
    }

    const count = measurements.length;
    const sum = measurements.reduce((a, b) => a + b, 0);
    const average = sum / count;
    const min = Math.min(...measurements);
    const max = Math.max(...measurements);
    const latest = measurements[measurements.length - 1];

    return { count, average, min, max, latest };
  }

  /**
   * Monitor Long Task API for performance issues
   */
  monitorLongTasks(callback?: (entry: PerformanceEntry) => void): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            console.warn(`Long task detected: ${entry.duration}ms`, entry);
            callback?.(entry);
          });
        });
        observer.observe({ entryTypes: ['longtask'] });
        this.observers.set('longtask', observer);
      } catch {
        console.warn('Long Task API not supported');
      }
    }
  }

  /**
   * Monitor Layout Shift (CLS) for performance issues
   */
  monitorLayoutShift(callback?: (entry: PerformanceEntry) => void): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (entry.hadRecentInput) return; // Ignore user-initiated shifts
            console.warn(`Layout shift detected: ${entry.value}`, entry);
            callback?.(entry);
          });
        });
        observer.observe({ entryTypes: ['layout-shift'] });
        this.observers.set('layout-shift', observer);
      } catch {
        console.warn('Layout Shift API not supported');
      }
    }
  }

  /**
   * Get all performance measurements
   */
  getAllStats(): Record<string, any> {
    const stats: Record<string, any> = {};
    this.measurements.forEach((_measurements, name) => {
      stats[name] = this.getStats(name);
    });
    return stats;
  }

  /**
   * Clear all measurements
   */
  clearMeasurements(): void {
    this.measurements.clear();
  }

  /**
   * Disconnect all observers
   */
  disconnect(): void {
    this.observers.forEach((observer) => {
      observer.disconnect();
    });
    this.observers.clear();
  }
}

/**
 * React Hook for performance monitoring
 */
export const usePerformanceMonitor = (componentName: string) => {
  const monitor = PerformanceMonitor.getInstance();

  const startMeasurement = React.useCallback(() => {
    monitor.startMeasurement(componentName);
  }, [monitor, componentName]);

  const endMeasurement = React.useCallback(() => {
    return monitor.endMeasurement(componentName);
  }, [monitor, componentName]);

  const getStats = React.useCallback(() => {
    return monitor.getStats(componentName);
  }, [monitor, componentName]);

  return { startMeasurement, endMeasurement, getStats };
};

/**
 * Higher-order component for automatic performance monitoring
 */
export function withPerformanceMonitoring<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) {
  const displayName =
    componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const MonitoredComponent = React.memo(
    React.forwardRef<any, P>((props, ref) => {
      const monitor = PerformanceMonitor.getInstance();

      React.useEffect(() => {
        monitor.startMeasurement(`${displayName}-render`);

        return () => {
          const duration = monitor.endMeasurement(`${displayName}-render`);
          if (duration && duration > 16) {
            // Warn if render takes longer than one frame
            console.warn(`Slow render detected in ${displayName}: ${duration.toFixed(2)}ms`);
          }
        };
      });

      return React.createElement(WrappedComponent, { ...props, ref } as any);
    })
  );

  MonitoredComponent.displayName = `withPerformanceMonitoring(${displayName})`;

  return MonitoredComponent;
}

/**
 * Utility for measuring async operations
 */
export const measureAsync = async <T>(
  name: string,
  asyncOperation: () => Promise<T>
): Promise<T> => {
  const monitor = PerformanceMonitor.getInstance();
  monitor.startMeasurement(name);

  try {
    const result = await asyncOperation();
    const duration = monitor.endMeasurement(name);

    if (duration && duration > 1000) {
      // Warn if async operation takes longer than 1 second
      console.warn(`Slow async operation detected: ${name} took ${duration.toFixed(2)}ms`);
    }

    return result;
  } catch (error) {
    monitor.endMeasurement(name);
    throw error;
  }
};

/**
 * Debounce utility for expensive operations
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttle utility for frequent operations
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

/**
 * Memory usage monitoring
 */
export const getMemoryUsage = (): {
  used: number;
  total: number;
  percentage: number;
} | null => {
  if (typeof window !== 'undefined' && 'performance' in window && 'memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
    };
  }
  return null;
};

/**
 * Initialize performance monitoring
 */
export const initializePerformanceMonitoring = () => {
  if (typeof window !== 'undefined') {
    const monitor = PerformanceMonitor.getInstance();

    // Monitor long tasks
    monitor.monitorLongTasks((entry) => {
      // Report to analytics service if needed
      console.warn('Long task detected:', entry.duration);
    });

    // Monitor layout shifts
    monitor.monitorLayoutShift((entry: any) => {
      // Report to analytics service if needed
      console.warn('Layout shift detected:', entry.value);
    });

    // Monitor memory usage periodically
    setInterval(() => {
      const memoryUsage = getMemoryUsage();
      if (memoryUsage && memoryUsage.percentage > 90) {
        console.warn('High memory usage detected:', memoryUsage);
      }
    }, 30000); // Check every 30 seconds
  }
};

// Re-export React import for the hook
import React from 'react';
