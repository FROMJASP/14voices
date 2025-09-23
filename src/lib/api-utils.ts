/**
 * API utility functions with rate limiting protection
 */

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitInfo>();

/**
 * Simple client-side rate limiter
 */
export function checkRateLimit(
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const info = rateLimitMap.get(key);

  // Clean up old entries
  if (info && now > info.resetTime) {
    rateLimitMap.delete(key);
  }

  // Check current rate limit
  const current = rateLimitMap.get(key) || { count: 0, resetTime: now + windowMs };

  if (current.count >= maxRequests) {
    console.warn(
      `Rate limit exceeded for ${key}. Try again after ${new Date(current.resetTime).toLocaleTimeString()}`
    );
    return false;
  }

  // Update count
  rateLimitMap.set(key, {
    count: current.count + 1,
    resetTime: current.resetTime,
  });

  return true;
}

/**
 * Debounced fetch to prevent rapid requests
 */
export function createDebouncedFetch<T>(
  fetchFn: () => Promise<T>,
  delay: number = 1000
): () => Promise<T | null> {
  let lastFetch = 0;

  return async () => {
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetch;

    // If we fetched recently, return null
    if (timeSinceLastFetch < delay) {
      console.log(`Debounced: waiting ${delay - timeSinceLastFetch}ms before next fetch`);
      return null;
    }

    lastFetch = now;
    return fetchFn();
  };
}
