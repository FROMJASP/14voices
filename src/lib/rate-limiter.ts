import { CacheManager } from './cache';
import { logSecurityEvent } from './security-monitoring';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

// Create a dedicated cache manager for rate limiting
const rateLimitCache = new CacheManager({
  useRedis: true,
  redis: {
    keyPrefix: 'ratelimit:',
  },
  layers: {
    memory: false, // Disable memory layer for distributed consistency
    redis: true,
  },
});

// In-memory store as fallback (only for when Redis is unavailable)
const rateLimitStore = new Map<string, number[]>();

/**
 * Rate limiter with Redis implementation
 */
export async function checkRateLimit(
  clientId: string,
  limit: number = 60,
  windowMs: number = 60000
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = now - windowMs;
  const key = `${clientId}:${Math.floor(now / windowMs)}`;

  try {
    // Try Redis first
    const currentCount = await rateLimitCache.get<number>(key);
    
    if (currentCount !== undefined) {
      // Redis path
      if (currentCount >= limit) {
        return {
          allowed: false,
          remaining: 0,
          resetTime: Math.floor(now / windowMs) * windowMs + windowMs,
        };
      }

      await rateLimitCache.set(key, currentCount + 1, windowMs);
      
      return {
        allowed: true,
        remaining: limit - currentCount - 1,
        resetTime: Math.floor(now / windowMs) * windowMs + windowMs,
      };
    } else {
      // Initialize counter in Redis
      await rateLimitCache.set(key, 1, windowMs);
      
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime: Math.floor(now / windowMs) * windowMs + windowMs,
      };
    }
  } catch (redisError) {
    // Log Redis failure
    console.error('Redis rate limit error, falling back to in-memory:', redisError);
    
    // Fallback to in-memory store
    const fallbackKey = `rate_limit:${clientId}`;
    let requests = rateLimitStore.get(fallbackKey) || [];
    
    // Remove old requests outside the window
    requests = requests.filter(timestamp => timestamp > windowStart);
    
    if (requests.length >= limit) {
      const oldestTimestamp = requests[0];
      const resetTime = oldestTimestamp + windowMs;
      
      // Log potential rate limit bypass due to Redis failure
      await logSecurityEvent({
        type: 'suspicious_activity',
        severity: 'medium',
        details: {
          reason: 'Rate limiting using fallback due to Redis failure',
          clientId,
          requestCount: requests.length,
        },
        timestamp: new Date(),
      });
      
      return {
        allowed: false,
        remaining: 0,
        resetTime,
      };
    }

    // Add current request
    requests.push(now);
    rateLimitStore.set(fallbackKey, requests);
    
    // Clean up old entries periodically
    if (Math.random() < 0.01) { // 1% chance to clean up
      for (const [k, v] of rateLimitStore.entries()) {
        const filtered = v.filter(t => t > now - windowMs);
        if (filtered.length === 0) {
          rateLimitStore.delete(k);
        } else {
          rateLimitStore.set(k, filtered);
        }
      }
    }

    return {
      allowed: true,
      remaining: limit - requests.length,
      resetTime: now + windowMs,
    };
  }
}

/**
 * Get rate limit key for different contexts
 */
export function getRateLimitKey(req: Request, context: string = 'global'): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  
  // Add user ID if authenticated
  const userId = (req as any).user?.id;
  
  return userId ? `${context}:user:${userId}` : `${context}:ip:${ip}`;
}

/**
 * Cleanup expired rate limit entries (run periodically)
 */
export async function cleanupRateLimits(): Promise<void> {
  const now = Date.now();
  const oneHourAgo = now - 3600000;
  
  // Clean up in-memory store
  for (const [key, timestamps] of rateLimitStore.entries()) {
    const filtered = timestamps.filter(t => t > oneHourAgo);
    if (filtered.length === 0) {
      rateLimitStore.delete(key);
    } else if (filtered.length !== timestamps.length) {
      rateLimitStore.set(key, filtered);
    }
  }
}