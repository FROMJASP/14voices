/**
 * Production Performance Monitoring
 * Utilities for monitoring and reporting performance metrics
 */

import globalCache from '@/lib/cache';

export interface PerformanceMetrics {
  timestamp: number;
  route: string;
  method: string;
  statusCode: number;
  responseTime: number;
  cacheHit?: boolean;
  dbQueries?: number;
  memoryUsage?: NodeJS.MemoryUsage;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private maxMetrics = 1000; // Keep last 1000 metrics

  recordMetric(metric: PerformanceMetrics) {
    this.metrics.push(metric);

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  getMetrics(timeRange: number = 3600000): PerformanceMetrics[] {
    const cutoff = Date.now() - timeRange; // Default: last hour
    return this.metrics.filter((m) => m.timestamp >= cutoff);
  }

  getAverageResponseTime(route?: string): number {
    const recentMetrics = this.getMetrics();
    const filtered = route ? recentMetrics.filter((m) => m.route === route) : recentMetrics;

    if (filtered.length === 0) return 0;

    const total = filtered.reduce((sum, m) => sum + m.responseTime, 0);
    return total / filtered.length;
  }

  getCacheHitRate(): number {
    const recentMetrics = this.getMetrics();
    const withCacheInfo = recentMetrics.filter((m) => m.cacheHit !== undefined);

    if (withCacheInfo.length === 0) return 0;

    const hits = withCacheInfo.filter((m) => m.cacheHit).length;
    return (hits / withCacheInfo.length) * 100;
  }

  getSlowestEndpoints(limit = 10): Array<{ route: string; avgTime: number; count: number }> {
    const recentMetrics = this.getMetrics();
    const routeStats = new Map<string, { total: number; count: number }>();

    recentMetrics.forEach((metric) => {
      const key = `${metric.method} ${metric.route}`;
      const current = routeStats.get(key) || { total: 0, count: 0 };
      current.total += metric.responseTime;
      current.count += 1;
      routeStats.set(key, current);
    });

    return Array.from(routeStats.entries())
      .map(([route, stats]) => ({
        route,
        avgTime: stats.total / stats.count,
        count: stats.count,
      }))
      .sort((a, b) => b.avgTime - a.avgTime)
      .slice(0, limit);
  }

  getHealthSummary() {
    const cacheStats = globalCache.getStats();

    return {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      averageResponseTime: this.getAverageResponseTime(),
      cacheHitRate: this.getCacheHitRate(),
      cacheStats,
      totalRequests: this.getMetrics().length,
      errorRate: this.getErrorRate(),
    };
  }

  private getErrorRate(): number {
    const recentMetrics = this.getMetrics();
    if (recentMetrics.length === 0) return 0;

    const errors = recentMetrics.filter((m) => m.statusCode >= 400).length;
    return (errors / recentMetrics.length) * 100;
  }

  // Performance warning thresholds
  checkPerformanceWarnings(): string[] {
    const warnings: string[] = [];
    const avgResponseTime = this.getAverageResponseTime();
    const cacheHitRate = this.getCacheHitRate();
    const errorRate = this.getErrorRate();

    if (avgResponseTime > 1000) {
      warnings.push(`High average response time: ${avgResponseTime.toFixed(2)}ms`);
    }

    if (cacheHitRate < 70) {
      warnings.push(`Low cache hit rate: ${cacheHitRate.toFixed(2)}%`);
    }

    if (errorRate > 5) {
      warnings.push(`High error rate: ${errorRate.toFixed(2)}%`);
    }

    const memUsage = process.memoryUsage();
    if (memUsage.heapUsed / memUsage.heapTotal > 0.9) {
      warnings.push('High memory usage detected');
    }

    return warnings;
  }
}

export const performanceMonitor = new PerformanceMonitor();

/**
 * Middleware to automatically track performance metrics
 */
export function withPerformanceTracking<T extends (...args: any[]) => Promise<Response>>(
  handler: T,
  route: string
): T {
  return (async (...args: any[]) => {
    const start = performance.now();
    const startTime = Date.now();

    try {
      const response = await handler(...args);
      const responseTime = performance.now() - start;

      performanceMonitor.recordMetric({
        timestamp: startTime,
        route,
        method: args[0]?.method || 'GET',
        statusCode: response.status,
        responseTime,
        cacheHit: response.headers.get('X-Cache') === 'HIT',
        memoryUsage: process.memoryUsage(),
      });

      // Log slow requests in development
      if (process.env.NODE_ENV === 'development' && responseTime > 1000) {
        console.warn(`🐌 Slow request: ${route} took ${responseTime.toFixed(2)}ms`);
      }

      return response;
    } catch (error) {
      const responseTime = performance.now() - start;

      performanceMonitor.recordMetric({
        timestamp: startTime,
        route,
        method: args[0]?.method || 'GET',
        statusCode: 500,
        responseTime,
        memoryUsage: process.memoryUsage(),
      });

      throw error;
    }
  }) as T;
}

/**
 * Performance report for monitoring dashboards
 */
export function generatePerformanceReport() {
  const health = performanceMonitor.getHealthSummary();
  const warnings = performanceMonitor.checkPerformanceWarnings();
  const slowEndpoints = performanceMonitor.getSlowestEndpoints(5);

  return {
    timestamp: new Date().toISOString(),
    status: warnings.length === 0 ? 'healthy' : 'warning',
    health,
    warnings,
    slowEndpoints,
    recommendations: getPerformanceRecommendations(health, warnings),
  };
}

function getPerformanceRecommendations(health: any, _warnings: string[]): string[] {
  const recommendations: string[] = [];

  if (health.cacheHitRate < 70) {
    recommendations.push('Consider increasing cache TTL for frequently accessed data');
  }

  if (health.averageResponseTime > 500) {
    recommendations.push('Review database queries and add indexes for slow operations');
  }

  if (health.memoryUsage.heapUsed / health.memoryUsage.heapTotal > 0.8) {
    recommendations.push('Monitor memory usage and consider optimizing data structures');
  }

  if (health.errorRate > 2) {
    recommendations.push('Investigate error sources and improve error handling');
  }

  return recommendations;
}
