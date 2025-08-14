import { NextResponse } from 'next/server';
import { OptimizedVoiceoverQueries } from '@/lib/database-optimizations';
import { APIPerformanceMonitor } from '@/lib/api-optimizations';
import { getCacheStats } from '@/lib/data-fetching-server';
import globalCache from '@/lib/cache';

export async function GET() {
  try {
    const startTime = performance.now();
    
    // Gather performance metrics from different systems
    const [
      dbMetrics,
      apiMetrics,
      cacheStats,
      globalCacheStats,
    ] = await Promise.all([
      OptimizedVoiceoverQueries.getPerformanceMetrics(),
      APIPerformanceMonitor.getMetrics(),
      getCacheStats(),
      globalCache.getStats(),
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
      cache: {
        dataFetching: cacheStats,
        global: globalCacheStats,
      },
      responseTime: performance.now() - startTime,
    };

    // Record this API call
    APIPerformanceMonitor.recordMetric(
      '/api/performance/metrics',
      'GET',
      performance.now() - startTime,
      false,
      200
    );

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