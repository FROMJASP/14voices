/**
 * Database Query Optimization Utilities
 * Implements advanced caching, query optimization, and performance monitoring
 */

import { getPayload } from 'payload';
import type { Where } from 'payload';
import configPromise from '@payload-config';
import globalCache from '@/lib/cache';

// Query performance monitoring
interface QueryMetrics {
  queryKey: string;
  duration: number;
  cacheHit: boolean;
  resultCount: number;
  timestamp: number;
}

const queryMetrics: QueryMetrics[] = [];

// Advanced caching with intelligent invalidation
class QueryCache {
  private cache = globalCache;
  private dependencyMap = new Map<string, Set<string>>();

  // Generate cache key with dependency tracking
  generateKey(collection: string, query: any, dependencies?: string[]): string {
    const keyBase = `${collection}:${JSON.stringify(query)}`;
    const keyHash = Buffer.from(keyBase).toString('base64').slice(0, 32);
    
    // Track dependencies for intelligent invalidation
    if (dependencies) {
      dependencies.forEach(dep => {
        if (!this.dependencyMap.has(dep)) {
          this.dependencyMap.set(dep, new Set());
        }
        this.dependencyMap.get(dep)!.add(keyHash);
      });
    }
    
    return keyHash;
  }

  // Invalidate cache by dependencies
  async invalidateByDependency(dependency: string): Promise<void> {
    const affectedKeys = this.dependencyMap.get(dependency);
    if (affectedKeys) {
      for (const key of affectedKeys) {
        await this.cache.delete(key);
      }
      this.dependencyMap.delete(dependency);
    }
  }

  // Smart cache with fallback strategies
  async get<T>(key: string): Promise<T | undefined> {
    return this.cache.get<T>(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    return this.cache.set(key, value, ttl);
  }
}

const queryCache = new QueryCache();

// Optimized voiceover queries with aggressive caching
export class OptimizedVoiceoverQueries {
  
  // Get homepage voiceovers with multi-layer caching
  static async getHomepageVoiceovers(options: {
    limit?: number;
    includeUnavailable?: boolean;
    cacheTTL?: number;
  } = {}) {
    const { limit = 50, includeUnavailable = false, cacheTTL = 1000 * 60 * 30 } = options;
    
    const cacheKey = queryCache.generateKey('voiceovers-homepage', {
      limit,
      includeUnavailable,
      status: 'active'
    }, ['voiceovers', 'homepage']);

    const startTime = performance.now();
    
    // Try cache first
    const cached = await queryCache.get(cacheKey);
    if (cached && Array.isArray(cached)) {
      this.recordMetrics(cacheKey, performance.now() - startTime, true, Array.isArray(cached) ? cached.length : 1);
      return cached;
    }

    // Optimized database query
    const payload = await getPayload({ config: configPromise });
    
    // Use select to limit fields and reduce payload size
    const result = await payload.find({
      collection: 'voiceovers',
      where: {
        status: { equals: 'active' },
        ...(includeUnavailable ? {} : {
          or: [
            { 'availability.isAvailable': { equals: true } },
            { 'availability.isAvailable': { exists: false } }
          ]
        })
      },
      limit,
      depth: 2,
      sort: '-updatedAt',
      // Optimize by selecting only necessary fields
      select: {
        name: true,
        slug: true,
        profilePhoto: true,
        status: true,
        styleTags: true,
      }
    });

    const transformedResult = result.docs;
    
    // Cache the result
    await queryCache.set(cacheKey, transformedResult, cacheTTL);
    
    this.recordMetrics(cacheKey, performance.now() - startTime, false, transformedResult.length);
    return transformedResult;
  }

  // Optimized single voiceover query with related data
  static async getVoiceoverBySlug(slug: string, options: {
    includeRelated?: boolean;
    cacheTTL?: number;
  } = {}) {
    const { includeRelated = false, cacheTTL = 1000 * 60 * 60 } = options; // 1 hour cache
    
    const cacheKey = queryCache.generateKey('voiceover-detail', {
      slug,
      includeRelated
    }, ['voiceovers', `voiceover-${slug}`]);

    const startTime = performance.now();
    
    const cached = await queryCache.get(cacheKey);
    if (cached) {
      this.recordMetrics(cacheKey, performance.now() - startTime, true, 1);
      return cached;
    }

    const payload = await getPayload({ config: configPromise });
    
    // Main voiceover query
    const voiceoverResult = await payload.find({
      collection: 'voiceovers',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 3, // Deep load for detail page
    });

    if (voiceoverResult.docs.length === 0) {
      throw new Error(`Voiceover with slug "${slug}" not found`);
    }

    const voiceover = voiceoverResult.docs[0];
    let result = { voiceover, related: [] };

    // Conditionally load related voiceovers
    if (includeRelated && voiceover.styleTags?.length) {
      const relatedTags = voiceover.styleTags.map(st => st.tag);
      
      const relatedResult = await payload.find({
        collection: 'voiceovers',
        where: {
          and: [
            { id: { not_equals: voiceover.id } },
            { status: { equals: 'active' } },
            {
              or: relatedTags.map(tag => ({
                'styleTags.tag': { equals: tag }
              }))
            }
          ]
        },
        limit: 6,
        select: {
          name: true,
          slug: true,
          profilePhoto: true,
          styleTags: true,
        }
      });
      
      result.related = relatedResult.docs as any;
    }

    await queryCache.set(cacheKey, result, cacheTTL);
    this.recordMetrics(cacheKey, performance.now() - startTime, false, 1);
    
    return result;
  }

  // Optimized search with fuzzy matching and caching
  static async searchVoiceovers(query: string, options: {
    limit?: number;
    filters?: any;
    cacheTTL?: number;
  } = {}) {
    const { limit = 20, filters = {}, cacheTTL = 1000 * 60 * 10 } = options; // 10 min cache
    
    const cacheKey = queryCache.generateKey('voiceover-search', {
      query: query.toLowerCase().trim(),
      limit,
      filters
    }, ['voiceovers', 'search']);

    const startTime = performance.now();
    
    const cached = await queryCache.get(cacheKey);
    if (cached) {
      this.recordMetrics(cacheKey, performance.now() - startTime, true, Array.isArray(cached) ? cached.length : 1);
      return cached;
    }

    const payload = await getPayload({ config: configPromise });
    
    // Optimized search query with multiple search strategies
    const searchTerms = query.toLowerCase().trim().split(' ').filter(Boolean);
    
    const searchConditions = searchTerms.flatMap(term => [
      { name: { like: term } } as any,
      { bio: { like: term } } as any,
      { 'styleTags.tag': { like: term } } as any,
      { 'styleTags.customTag': { like: term } } as any
    ]);

    const filterConditions: Where[] = Object.entries(filters).map(([key, value]) => ({ [key]: value }) as Where);

    const result = await payload.find({
      collection: 'voiceovers',
      where: {
        and: [
          { status: { equals: 'active' } },
          { or: searchConditions },
          ...filterConditions
        ]
      },
      limit,
      select: {
        name: true,
        slug: true,
        profilePhoto: true,
        styleTags: true,
      },
      sort: '-updatedAt'
    });

    await queryCache.set(cacheKey, result.docs, cacheTTL);
    this.recordMetrics(cacheKey, performance.now() - startTime, false, result.docs.length);
    
    return result.docs;
  }

  // Batch query optimization for multiple voiceovers
  static async getVoiceoversByIds(ids: string[], options: {
    includeUnavailable?: boolean;
    cacheTTL?: number;
  } = {}) {
    const { includeUnavailable = false, cacheTTL = 1000 * 60 * 15 } = options;
    
    const cacheKey = queryCache.generateKey('voiceovers-batch', {
      ids: ids.sort(), // Sort for consistent caching
      includeUnavailable
    }, ['voiceovers']);

    const cached = await queryCache.get(cacheKey);
    if (cached) return cached;

    const payload = await getPayload({ config: configPromise });
    
    const result = await payload.find({
      collection: 'voiceovers',
      where: {
        and: [
          { id: { in: ids } },
          ...(includeUnavailable ? [] : [
            {
              or: [
                { 'availability.isAvailable': { equals: true } },
                { 'availability.isAvailable': { exists: false } }
              ]
            }
          ])
        ]
      },
      limit: ids.length,
      select: {
        name: true,
        slug: true,
        profilePhoto: true,
        styleTags: true,
      }
    });

    await queryCache.set(cacheKey, result.docs, cacheTTL);
    return result.docs;
  }

  // Analytics and performance monitoring
  private static recordMetrics(queryKey: string, duration: number, cacheHit: boolean, resultCount: number) {
    queryMetrics.push({
      queryKey,
      duration,
      cacheHit,
      resultCount,
      timestamp: Date.now()
    });

    // Keep only last 1000 metrics
    if (queryMetrics.length > 1000) {
      queryMetrics.splice(0, queryMetrics.length - 1000);
    }

    // Log slow queries in development
    if (process.env.NODE_ENV === 'development' && duration > 1000) {
      console.warn(`Slow query detected: ${queryKey} took ${duration.toFixed(2)}ms`);
    }
  }

  // Get performance analytics
  static getPerformanceMetrics() {
    const recent = queryMetrics.filter(m => Date.now() - m.timestamp < 1000 * 60 * 60); // Last hour
    
    return {
      totalQueries: recent.length,
      cacheHitRate: recent.filter(m => m.cacheHit).length / recent.length,
      averageQueryTime: recent.reduce((sum, m) => sum + m.duration, 0) / recent.length,
      slowQueries: recent.filter(m => m.duration > 500).length,
      totalResults: recent.reduce((sum, m) => sum + m.resultCount, 0)
    };
  }

  // Cache invalidation methods
  static async invalidateVoiceoverCache(voiceoverId?: string) {
    if (voiceoverId) {
      await queryCache.invalidateByDependency(`voiceover-${voiceoverId}`);
    }
    await queryCache.invalidateByDependency('voiceovers');
    await queryCache.invalidateByDependency('homepage');
    await queryCache.invalidateByDependency('search');
  }
}

// Database indexing recommendations (to be run manually)
export const RECOMMENDED_INDEXES = [
  // Voiceovers collection
  'CREATE INDEX IF NOT EXISTS idx_voiceovers_status ON voiceovers(status)',
  'CREATE INDEX IF NOT EXISTS idx_voiceovers_slug ON voiceovers(slug)',
  'CREATE INDEX IF NOT EXISTS idx_voiceovers_updated_at ON voiceovers(updated_at)',
  'CREATE INDEX IF NOT EXISTS idx_voiceovers_availability ON voiceovers((availability->\'isAvailable\'))',
  'CREATE INDEX IF NOT EXISTS idx_voiceovers_search ON voiceovers USING gin(to_tsvector(\'english\', name || \' \' || bio))',
  
  // Style tags for filtering
  'CREATE INDEX IF NOT EXISTS idx_voiceovers_style_tags ON voiceovers USING gin((style_tags))',
  
  // Demos collection
  'CREATE INDEX IF NOT EXISTS idx_demos_voiceover_id ON demos(voiceover_id)',
  'CREATE INDEX IF NOT EXISTS idx_demos_is_primary ON demos(is_primary)',
  
  // Media collection
  'CREATE INDEX IF NOT EXISTS idx_media_filename ON media(filename)',
  'CREATE INDEX IF NOT EXISTS idx_media_size ON media(file_size)',
];

// Query plan analysis helper
export async function analyzeQueryPerformance() {
  const metrics = OptimizedVoiceoverQueries.getPerformanceMetrics();
  
  console.log('=== Database Query Performance Analysis ===');
  console.log(`Total queries in last hour: ${metrics.totalQueries}`);
  console.log(`Cache hit rate: ${(metrics.cacheHitRate * 100).toFixed(2)}%`);
  console.log(`Average query time: ${metrics.averageQueryTime.toFixed(2)}ms`);
  console.log(`Slow queries (>500ms): ${metrics.slowQueries}`);
  console.log(`Total results returned: ${metrics.totalResults}`);
  
  return metrics;
}