import { NextResponse } from 'next/server';

// Dynamic imports to prevent build-time issues
const getDatabaseMetrics = async () => {
  try {
    const { OptimizedVoiceoverQueries } = await import('@/lib/database-optimizations');
    return OptimizedVoiceoverQueries.getPerformanceMetrics();
  } catch {
    return { error: 'Database metrics unavailable' };
  }
};

const getAPIMetrics = async () => {
  try {
    const { APIPerformanceMonitor } = await import('@/lib/api-optimizations');
    return APIPerformanceMonitor.getMetrics();
  } catch {
    return { error: 'API metrics unavailable' };
  }
};

const getCacheMetrics = async () => {
  try {
    const [{ getCacheStats }, globalCache] = await Promise.all([
      import('@/lib/data-fetching-server'),
      import('@/lib/cache')
    ]);
    return {
      dataFetching: getCacheStats(),
      global: globalCache.default.getStats(),
    };
  } catch {
    return { error: 'Cache metrics unavailable' };
  }
};

// Disable static optimization for this API route
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const startTime = performance.now();

    // Gather performance metrics from different systems
    const [dbMetrics, apiMetrics, cacheMetrics] = await Promise.all([
      getDatabaseMetrics(),
      getAPIMetrics(),
      getCacheMetrics(),
    ]);

    // System performance metrics
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();

    const metrics = {
      timestamp: new Date().toISOString(),
      system: {
        uptime: Math.floor(uptime),
        memory: {
          used: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
          total: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
          external: Math.round(memoryUsage.external / 1024 / 1024), // MB
          rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
        },
        nodeVersion: process.version,
        platform: process.platform,
      },
      database: dbMetrics,
      api: apiMetrics,
      cache: cacheMetrics,
      responseTime: performance.now() - startTime,
    };

    // Record this API call (only if monitor is available)
    try {
      const { APIPerformanceMonitor } = await import('@/lib/api-optimizations');
      APIPerformanceMonitor.recordMetric(
        '/api/performance/metrics',
        'GET',
        performance.now() - startTime,
        false,
        200
      );
    } catch {
      // Ignore if monitoring is unavailable
    }

    return NextResponse.json(metrics, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Performance metrics error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch performance metrics',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
