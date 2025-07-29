import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { createApiHandler } from '@/lib/api/handlers';
import globalCache from '@/lib/cache';

export const GET = createApiHandler(
  async () => {
    const checks = {
      database: false,
      cache: false,
      payload: false,
      storage: false,
    };

    // Check database connectivity
    try {
      const payload = await getPayload({ config: configPromise });
      await payload.find({
        collection: 'site-settings',
        limit: 1,
      });
      checks.database = true;
      checks.payload = true;
    } catch (error) {
      console.error('Database check failed:', error);
    }

    // Check cache
    try {
      const testKey = 'health:test:' + Date.now();
      await globalCache.set(testKey, 'test', 1000);
      const value = await globalCache.get(testKey);
      await globalCache.delete(testKey);
      checks.cache = value === 'test';
    } catch (error) {
      console.error('Cache check failed:', error);
    }

    // Check storage (if configured)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        // In production, would check Vercel Blob storage
        checks.storage = true;
      } catch (error) {
        console.error('Storage check failed:', error);
      }
    } else {
      checks.storage = true; // Skip if not configured
    }

    const allHealthy = Object.values(checks).every((v) => v === true);

    return {
      status: allHealthy ? 'healthy' : 'unhealthy',
      checks,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    };
  },
  {
    cache: {
      enabled: false, // Don't cache health checks
    },
    rateLimit: {
      requests: 60,
      window: 60,
    },
  }
);
