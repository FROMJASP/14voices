/**
 * Server-side data fetching optimization utilities
 * Includes caching, deduplication, pagination, and selective field querying
 */

import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { LRUCache } from 'lru-cache';

// Types for optimized queries
interface OptimizedQueryOptions {
  collection: string;
  where?: any;
  limit?: number;
  page?: number;
  depth?: number;
  select?: Record<string, boolean>;
  sort?: string;
  cacheKey?: string;
  cacheTTL?: number;
}

interface PaginatedResult<T> {
  docs: T[];
  totalDocs: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Global cache instance
const queryCache = new LRUCache<string, any>({
  max: 1000,
  ttl: 1000 * 60 * 15, // 15 minutes default TTL
});

// Request deduplication map
const pendingRequests = new Map<string, Promise<any>>();

/**
 * Generate optimized cache key for queries
 */
function generateCacheKey(options: OptimizedQueryOptions): string {
  const { collection, where, limit, page, depth, select, sort } = options;
  const keyData = {
    collection,
    where: JSON.stringify(where || {}),
    limit,
    page,
    depth,
    select: JSON.stringify(select || {}),
    sort,
  };
  return `query:${Buffer.from(JSON.stringify(keyData)).toString('base64')}`;
}

/**
 * Optimized data fetching with caching and deduplication
 */
export async function fetchOptimized<T = any>(
  options: OptimizedQueryOptions
): Promise<PaginatedResult<T>> {
  const cacheKey = options.cacheKey || generateCacheKey(options);
  
  // Check cache first
  const cached = queryCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Check for pending request (deduplication)
  const pending = pendingRequests.get(cacheKey);
  if (pending) {
    return pending;
  }

  // Create new request
  const requestPromise = async () => {
    try {
      const payload = await getPayload({ config: configPromise });
      
      const result = await payload.find({
        collection: options.collection as any,
        where: options.where,
        limit: options.limit || 10,
        page: options.page || 1,
        depth: options.depth || 1,
        select: options.select as any,
        sort: options.sort,
      });

      const transformedResult: PaginatedResult<T> = {
        docs: result.docs as T[],
        totalDocs: result.totalDocs,
        page: result.page || 1,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage || false,
        hasPrevPage: result.hasPrevPage || false,
      };

      // Cache the result
      queryCache.set(cacheKey, transformedResult, {
        ttl: options.cacheTTL || 1000 * 60 * 15,
      });

      return transformedResult;
    } finally {
      // Remove from pending requests
      pendingRequests.delete(cacheKey);
    }
  };

  const promise = requestPromise();
  pendingRequests.set(cacheKey, promise);

  return promise;
}

/**
 * Clear cache for specific collection or pattern
 */
export function clearCache(pattern?: string): void {
  if (pattern) {
    const keys = [...queryCache.keys()];
    keys.forEach(key => {
      if (key.includes(pattern)) {
        queryCache.delete(key);
      }
    });
  } else {
    queryCache.clear();
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    size: queryCache.size,
    max: queryCache.max,
    pendingRequests: pendingRequests.size,
  };
}