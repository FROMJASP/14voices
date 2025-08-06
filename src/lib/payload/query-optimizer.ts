import type { Payload, Where } from 'payload';

interface OptimizedQueryOptions {
  collection: string;
  where?: Where;
  depth?: number;
  locale?: string;
  page?: number;
  limit?: number;
  sort?: string;
  populate?: Record<string, boolean | OptimizedQueryOptions>;
}

interface BatchQueryOptions {
  collection: string;
  ids: string[];
  depth?: number;
  locale?: string;
  populate?: Record<string, boolean | OptimizedQueryOptions>;
}

export class QueryOptimizer {
  private payload: Payload;
  private cache: Map<string, { data: unknown; timestamp: number }>;
  private cacheTTL: number;

  constructor(payload: Payload, cacheTTL: number = 5 * 60 * 1000) {
    this.payload = payload;
    this.cache = new Map();
    this.cacheTTL = cacheTTL;
  }

  /**
   * Performs an optimized query with proper depth control and relation population
   */
  async find<T = unknown>(
    options: OptimizedQueryOptions
  ): Promise<{
    docs: T[];
    totalDocs: number;
    totalPages: number;
    page: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }> {
    const cacheKey = this.generateCacheKey(options);
    const cached = this.getFromCache(cacheKey) as {
      docs: T[];
      totalDocs: number;
      totalPages: number;
      page: number;
      limit: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    } | null;

    if (cached) {
      return cached;
    }

    // Ensure minimum depth of 2 for proper relation population
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { populate, ...payloadOptions } = options;
    const optimizedOptions = {
      ...payloadOptions,
      depth: Math.max(options.depth || 2, 2),
      collection: payloadOptions.collection as Parameters<
        typeof this.payload.find
      >[0]['collection'],
    };

    const result = await this.payload.find(
      optimizedOptions as Parameters<typeof this.payload.find>[0]
    );

    this.setCache(cacheKey, result);

    return result as unknown as {
      docs: T[];
      totalDocs: number;
      totalPages: number;
      page: number;
      limit: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }

  /**
   * Batch fetch multiple records by IDs to prevent N+1 queries
   */
  async findByIds<T = unknown>(options: BatchQueryOptions): Promise<Map<string, T>> {
    const { collection, ids, depth = 2, locale } = options;

    if (ids.length === 0) {
      return new Map();
    }

    // Remove duplicates
    const uniqueIds = [...new Set(ids)];

    // Check cache for already loaded items
    const uncachedIds: string[] = [];
    const cachedItems = new Map<string, T>();

    for (const id of uniqueIds) {
      const cacheKey = `${collection}:${id}:${locale || 'default'}`;
      const cached = this.getFromCache(cacheKey);

      if (cached) {
        cachedItems.set(id, cached as T);
      } else {
        uncachedIds.push(id);
      }
    }

    // Fetch uncached items in a single query
    if (uncachedIds.length > 0) {
      const result = await this.payload.find({
        collection: collection as Parameters<typeof this.payload.find>[0]['collection'],
        where: {
          id: {
            in: uncachedIds,
          },
        },
        depth,
        locale,
        limit: uncachedIds.length,
      } as Parameters<typeof this.payload.find>[0]);

      // Cache individual items and add to result map
      for (const doc of result.docs) {
        const cacheKey = `${collection}:${doc.id}:${locale || 'default'}`;
        this.setCache(cacheKey, doc);
        cachedItems.set(String(doc.id), doc as T);
      }
    }

    return cachedItems;
  }

  /**
   * Populate relations for a set of documents efficiently
   */
  async populateRelations<T = unknown>(docs: T[], relations: Record<string, string>): Promise<T[]> {
    const relationMap = new Map<string, Set<string>>();

    // Collect all relation IDs
    for (const doc of docs) {
      for (const [field, collection] of Object.entries(relations)) {
        const value = (doc as Record<string, unknown>)[field];

        if (!value) continue;

        if (!relationMap.has(collection)) {
          relationMap.set(collection, new Set());
        }

        if (typeof value === 'string') {
          relationMap.get(collection)!.add(value);
        } else if (Array.isArray(value)) {
          value.forEach((v) => {
            if (typeof v === 'string') {
              relationMap.get(collection)!.add(v);
            }
          });
        }
      }
    }

    // Batch fetch all relations
    const relationData = new Map<string, Map<string, unknown>>();

    for (const [collection, ids] of relationMap.entries()) {
      const items = await this.findByIds({
        collection,
        ids: Array.from(ids),
      });
      relationData.set(collection, items);
    }

    // Populate the documents
    return docs.map((doc) => {
      const populated = { ...doc };

      for (const [field, collection] of Object.entries(relations)) {
        const value = (doc as Record<string, unknown>)[field];
        const collectionData = relationData.get(collection);

        if (!value || !collectionData) continue;

        if (typeof value === 'string') {
          (populated as Record<string, unknown>)[field] = collectionData.get(value) || value;
        } else if (Array.isArray(value)) {
          (populated as Record<string, unknown>)[field] = value.map((v) => {
            if (typeof v === 'string') {
              return collectionData.get(v) || v;
            }
            return v;
          });
        }
      }

      return populated;
    });
  }

  /**
   * Execute multiple queries in parallel for better performance
   */
  async parallel<T extends Record<string, OptimizedQueryOptions>>(
    queries: T
  ): Promise<{ [K in keyof T]: unknown }> {
    const entries = Object.entries(queries);
    const results = await Promise.all(entries.map(([, options]) => this.find(options)));

    return Object.fromEntries(entries.map(([key], index) => [key, results[index]])) as {
      [K in keyof T]: unknown;
    };
  }

  /**
   * Clear expired cache entries
   */
  clearExpiredCache(): void {
    const now = Date.now();

    for (const [key, { timestamp }] of this.cache.entries()) {
      if (now - timestamp > this.cacheTTL) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  private generateCacheKey(options: OptimizedQueryOptions): string {
    return JSON.stringify({
      collection: options.collection,
      where: options.where,
      locale: options.locale,
      page: options.page,
      limit: options.limit,
      sort: options.sort,
    });
  }

  private getFromCache(key: string): unknown | null {
    const cached = this.cache.get(key);

    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > this.cacheTTL) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCache(key: string, data: unknown): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });

    // Limit cache size
    if (this.cache.size > 1000) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
  }
}

/**
 * Create indexes recommendations based on common query patterns
 */
export function generateIndexRecommendations(
  queryPatterns: Array<{
    collection: string;
    where: Where;
    sort?: string;
  }>
): string[] {
  const recommendations: string[] = [];
  const indexMap = new Map<string, Set<string>>();

  for (const pattern of queryPatterns) {
    const { collection, where, sort } = pattern;

    if (!indexMap.has(collection)) {
      indexMap.set(collection, new Set());
    }

    const indexes = indexMap.get(collection)!;

    // Extract fields from where clause
    const whereFields = extractFieldsFromWhere(where);

    // Single field indexes
    whereFields.forEach((field) => {
      indexes.add(`idx_${collection}_${field}`);
    });

    // Composite indexes for common patterns
    if (whereFields.length > 1) {
      const compositeIndex = `idx_${collection}_${whereFields.join('_')}`;
      indexes.add(compositeIndex);
    }

    // Sort field index
    if (sort) {
      const sortField = sort.replace(/^-/, '');
      indexes.add(`idx_${collection}_${sortField}`);

      // Composite index with where + sort
      if (whereFields.length > 0) {
        const compositeSortIndex = `idx_${collection}_${whereFields.join('_')}_${sortField}`;
        indexes.add(compositeSortIndex);
      }
    }
  }

  // Generate SQL statements
  for (const [collection, indexes] of indexMap.entries()) {
    for (const index of indexes) {
      const fields = index.replace(`idx_${collection}_`, '').split('_');
      recommendations.push(
        `CREATE INDEX CONCURRENTLY IF NOT EXISTS ${index} ON "${collection}"(${fields.join(', ')});`
      );
    }
  }

  return recommendations;
}

function extractFieldsFromWhere(where: Where): string[] {
  const fields: string[] = [];

  function traverse(obj: Record<string, unknown>, prefix: string = '') {
    for (const key in obj) {
      if (key === 'and' || key === 'or') {
        if (Array.isArray(obj[key])) {
          obj[key].forEach((condition: Record<string, unknown>) => traverse(condition, prefix));
        }
      } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        const field = prefix ? `${prefix}.${key}` : key;
        if (
          ![
            'equals',
            'not_equals',
            'in',
            'not_in',
            'greater_than',
            'less_than',
            'greater_than_equal',
            'less_than_equal',
            'like',
            'contains',
          ].includes(key)
        ) {
          fields.push(field);
        }
        if (obj[key] !== null) {
          traverse(obj[key] as Record<string, unknown>, field);
        }
      } else if (
        prefix &&
        ![
          'equals',
          'not_equals',
          'in',
          'not_in',
          'greater_than',
          'less_than',
          'greater_than_equal',
          'less_than_equal',
          'like',
          'contains',
        ].includes(key)
      ) {
        fields.push(prefix);
      }
    }
  }

  traverse(where);
  return [...new Set(fields)];
}
