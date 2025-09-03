// Optimized fetch with client-side caching
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  etag?: string;
}

class FetchCache {
  private cache = new Map<string, CacheEntry<any>>();
  private pendingRequests = new Map<string, Promise<any>>();

  async fetch<T>(
    url: string,
    options: RequestInit & {
      cacheTime?: number;
      cacheKey?: string;
      forceRefresh?: boolean;
    } = {}
  ): Promise<T> {
    const { cacheTime = 60000, cacheKey, forceRefresh = false, ...fetchOptions } = options;
    const key = cacheKey || url;

    // Check if we're already fetching this resource
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!;
    }

    // Return cached data if still valid and not forcing refresh
    if (!forceRefresh) {
      const cached = this.cache.get(key);
      if (cached && Date.now() - cached.timestamp < cacheTime) {
        return cached.data;
      }
    }

    // Create new fetch promise
    const fetchPromise = this.performFetch<T>(url, fetchOptions, key);
    this.pendingRequests.set(key, fetchPromise);

    try {
      const result = await fetchPromise;
      return result;
    } finally {
      this.pendingRequests.delete(key);
    }
  }

  private async performFetch<T>(url: string, options: RequestInit, cacheKey: string): Promise<T> {
    try {
      // Add conditional headers for cache validation
      const headers = new Headers(options.headers);
      const cached = this.cache.get(cacheKey);

      if (cached?.etag) {
        headers.set('If-None-Match', cached.etag);
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle 304 Not Modified
      if (response.status === 304 && cached) {
        // Update timestamp but keep existing data
        cached.timestamp = Date.now();
        this.cache.set(cacheKey, cached);
        return cached.data;
      }

      if (!response.ok) {
        throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const etag = response.headers.get('ETag') || undefined;

      // Cache the response
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        etag,
      });

      // Clean up old cache entries periodically
      this.cleanCache();

      return data;
    } catch (error) {
      // Return stale data if available during errors
      const cached = this.cache.get(cacheKey);
      if (cached) {
        console.warn('Returning stale data due to fetch error:', error);
        return cached.data;
      }
      throw error;
    }
  }

  private cleanCache() {
    // Only clean every 100 requests to avoid performance impact
    if (Math.random() > 0.01) return;

    const maxAge = 3600000; // 1 hour
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > maxAge) {
        this.cache.delete(key);
      }
    }
  }

  // Manual cache invalidation
  invalidate(pattern?: string) {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  // Preload resources
  async preload<T>(url: string, options?: RequestInit & { cacheTime?: number }): Promise<void> {
    // Fire and forget - don't await
    this.fetch<T>(url, options).catch(() => {
      // Silently handle preload errors
    });
  }
}

// Export singleton instance
export const optimizedFetch = new FetchCache();

// Convenience wrapper for common use cases
export async function fetchWithCache<T>(
  url: string,
  options?: {
    cacheTime?: number;
    forceRefresh?: boolean;
  }
): Promise<T> {
  return optimizedFetch.fetch<T>(url, options);
}

// Batch fetch helper for parallel requests
export async function batchFetch<T extends Record<string, any>>(
  requests: Array<{
    key: keyof T;
    url: string;
    options?: RequestInit & { cacheTime?: number };
  }>
): Promise<T> {
  const promises = requests.map(async ({ key, url, options }) => {
    const data = await optimizedFetch.fetch(url, options);
    return { key, data };
  });

  const results = await Promise.all(promises);

  return results.reduce((acc, { key, data }) => {
    (acc as any)[key] = data;
    return acc;
  }, {} as T);
}
