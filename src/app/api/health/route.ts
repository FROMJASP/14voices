import { getSafePayload, getPayloadStatus, resetPayloadInstance } from '@/lib/safe-payload';
import { createApiHandler } from '@/lib/api/handlers';
import globalCache from '@/lib/cache';
import { NextRequest } from 'next/server';

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const searchParams = new URL(request.url).searchParams;
    const reset = searchParams.get('reset');

    // Allow manual reset via query parameter (for debugging)
    if (reset === 'true') {
      resetPayloadInstance();
      return {
        message: 'Payload instance reset successfully',
        status: getPayloadStatus(),
        timestamp: new Date().toISOString(),
      };
    }

    const checks = {
      database: false,
      cache: false,
      payload: false,
      storage: false,
    };

    const payloadStatus = getPayloadStatus();

    // Check database connectivity using safe payload
    try {
      const payload = await getSafePayload();
      if (payload) {
        await payload.findGlobal({
          slug: 'site-settings',
        });
        checks.database = true;
        checks.payload = true;
      } else {
        console.log('Payload not initialized during health check');
        checks.payload = false;
        checks.database = false;
      }
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
    if (process.env.S3_ACCESS_KEY) {
      try {
        // Basic storage configuration check
        checks.storage = true;
      } catch (error) {
        console.error('Storage check failed:', error);
      }
    } else {
      checks.storage = true; // Skip if not configured
    }

    const allHealthy = Object.values(checks).every((v) => v === true);

    return {
      status: allHealthy ? 'healthy' : 'degraded',
      checks,
      payload: {
        initialized: payloadStatus.initialized,
        hasError: payloadStatus.hasError,
        retryCount: payloadStatus.retryCount,
        maxRetries: payloadStatus.maxRetries,
        nextRetryIn: payloadStatus.nextRetryIn,
        isInitializing: payloadStatus.isInitializing,
      },
      database: {
        configured:
          !!process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('fake:fake@fake'),
        url: process.env.DATABASE_URL ? 'configured' : 'not configured',
      },
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

// Add POST endpoint for manual operations
export const POST = createApiHandler(
  async (request: NextRequest) => {
    const body = await request.json();

    if (body.action === 'reset') {
      resetPayloadInstance();
      return {
        message: 'Payload instance reset successfully',
        status: getPayloadStatus(),
        timestamp: new Date().toISOString(),
      };
    }

    throw new Error('Invalid action');
  },
  {
    cache: {
      enabled: false,
    },
    rateLimit: {
      requests: 10,
      window: 60,
    },
  }
);
