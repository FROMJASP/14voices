import { CacheManager } from '@/lib/cache';
import { securityConfig } from '@/config/security';

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
}

interface RateLimitOptions {
  requests: number;
  window: number; // in seconds
  keyPrefix?: string;
}

export class RedisRateLimiter {
  private cache: CacheManager;
  private keyPrefix: string;

  constructor(cache: CacheManager, keyPrefix = 'ratelimit:') {
    this.cache = cache;
    this.keyPrefix = keyPrefix;
  }

  private getKey(identifier: string, endpoint: string): string {
    return `${this.keyPrefix}${endpoint}:${identifier}`;
  }

  async checkLimit(
    identifier: string,
    endpoint: string,
    options: RateLimitOptions
  ): Promise<RateLimitResult> {
    const key = this.getKey(identifier, endpoint);
    const now = Date.now();
    const windowMs = options.window * 1000;
    const resetAt = now + windowMs;

    // Try to get current count from cache
    const currentData = await this.cache.get<{ count: number; resetAt: number }>(key);

    if (!currentData || now >= currentData.resetAt) {
      // Start a new window
      const newData = { count: 1, resetAt };
      await this.cache.set(key, newData, windowMs);

      return {
        allowed: true,
        remaining: options.requests - 1,
        resetAt,
        limit: options.requests,
      };
    }

    // Check if limit exceeded
    if (currentData.count >= options.requests) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: currentData.resetAt,
        limit: options.requests,
      };
    }

    // Increment counter
    const updatedData = {
      count: currentData.count + 1,
      resetAt: currentData.resetAt,
    };

    // Calculate remaining TTL
    const remainingTTL = currentData.resetAt - now;
    await this.cache.set(key, updatedData, remainingTTL);

    return {
      allowed: true,
      remaining: options.requests - updatedData.count,
      resetAt: currentData.resetAt,
      limit: options.requests,
    };
  }

  async reset(identifier: string, endpoint: string): Promise<void> {
    const key = this.getKey(identifier, endpoint);
    await this.cache.delete(key);
  }

  async getRemainingAttempts(
    identifier: string,
    endpoint: string,
    options: RateLimitOptions
  ): Promise<number> {
    const key = this.getKey(identifier, endpoint);
    const currentData = await this.cache.get<{ count: number; resetAt: number }>(key);

    if (!currentData || Date.now() >= currentData.resetAt) {
      return options.requests;
    }

    return Math.max(0, options.requests - currentData.count);
  }
}

// Global rate limiter instance
let globalRateLimiter: RedisRateLimiter | null = null;

export function getRateLimiter(cache?: CacheManager): RedisRateLimiter {
  if (!globalRateLimiter) {
    const cacheInstance =
      cache ||
      new CacheManager({
        useRedis: true,
        layers: {
          memory: false, // Don't use memory layer for rate limiting
          redis: true,
        },
      });
    globalRateLimiter = new RedisRateLimiter(cacheInstance);
  }
  return globalRateLimiter;
}

// Helper function to get rate limit configuration for an endpoint type
export function getRateLimitConfig(type: keyof typeof securityConfig.rateLimits): RateLimitOptions {
  const config = securityConfig.rateLimits[type] || securityConfig.rateLimits.public;
  return {
    requests: config.max,
    window: Math.floor(config.windowMs / 1000), // Convert to seconds
  };
}

// Middleware helper for Next.js API routes
export async function checkRateLimit(
  request: Request,
  endpointType: keyof typeof securityConfig.rateLimits
): Promise<RateLimitResult> {
  const rateLimiter = getRateLimiter();

  // Extract identifier from request
  const identifier =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') || // Cloudflare
    'anonymous';

  const options = getRateLimitConfig(endpointType);

  return rateLimiter.checkLimit(identifier, endpointType, options);
}
