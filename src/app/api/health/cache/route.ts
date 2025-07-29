import globalCache from '@/lib/cache';
import { createApiHandler } from '@/lib/api/handlers';

export const GET = createApiHandler(
  async () => {
    const stats = globalCache.getStats();
    const hitRate =
      stats.hits + stats.misses > 0
        ? ((stats.hits / (stats.hits + stats.misses)) * 100).toFixed(2)
        : '0.00';

    return {
      status: 'healthy',
      cache: {
        hitRate: `${hitRate}%`,
        hits: stats.hits,
        misses: stats.misses,
        evictions: stats.evictions,
        size: stats.size,
        maxSize: stats.maxSize,
        utilization: `${((stats.size / stats.maxSize) * 100).toFixed(2)}%`,
      },
      timestamp: new Date().toISOString(),
    };
  },
  {
    cache: {
      enabled: false, // Don't cache health checks
    },
    rateLimit: {
      requests: 30,
      window: 60,
    },
  }
);
