/**
 * API Response Optimization Utilities
 * Implements response compression, field selection, and intelligent caching
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import globalCache from '@/lib/cache';

// Response compression utilities
export function compressResponse<T>(data: T): T {
  if (Array.isArray(data)) {
    return data.map(compressResponse) as T;
  }

  if (data && typeof data === 'object') {
    const compressed: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      // Skip null/undefined values
      if (value === null || value === undefined) continue;

      // Skip empty arrays
      if (Array.isArray(value) && value.length === 0) continue;

      // Skip empty objects
      if (
        typeof value === 'object' &&
        !Array.isArray(value) &&
        Object.keys(value as Record<string, unknown>).length === 0
      )
        continue;

      compressed[key] = compressResponse(value);
    }

    return compressed as T;
  }

  return data;
}

// Field selection for API responses
export function selectFields<T extends Record<string, any>>(
  data: T,
  fields: string[] | undefined
): Partial<T> {
  if (!fields || fields.length === 0) return data;

  const selected: Partial<T> = {};

  fields.forEach((field) => {
    if (field.includes('.')) {
      // Handle nested field selection
      const [root, ...nested] = field.split('.');
      if (data[root] && typeof data[root] === 'object') {
        if (!selected[root as keyof T]) {
          selected[root as keyof T] = {} as T[keyof T];
        }
        // Simplified nested selection - could be enhanced
        if (nested.length === 1 && data[root][nested[0]] !== undefined) {
          (selected[root as keyof T] as any)[nested[0]] = data[root][nested[0]];
        }
      }
    } else if (data[field] !== undefined) {
      selected[field as keyof T] = data[field];
    }
  });

  return selected;
}

// API response wrapper with caching and compression
export class OptimizedAPIResponse {
  private request: NextRequest;
  private cacheTTL: number;

  constructor(request: NextRequest, cacheTTL: number = 300) {
    this.request = request;
    this.cacheTTL = cacheTTL * 1000; // Convert to milliseconds
  }

  // Generate cache key from request
  private getCacheKey(): string {
    const url = new URL(this.request.url);
    const params = new URLSearchParams(url.search);

    // Sort params for consistent caching
    const sortedParams = Array.from(params.entries()).sort(([a], [b]) => a.localeCompare(b));

    const cacheableParams = sortedParams
      .filter(([key]) => !['_timestamp', 'cache-bust'].includes(key))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    return `api:${url.pathname}:${cacheableParams}`;
  }

  // Check if request supports compression
  private supportsCompression(): boolean {
    const acceptEncoding = this.request.headers.get('accept-encoding') || '';
    return acceptEncoding.includes('gzip') || acceptEncoding.includes('br');
  }

  // Parse query parameters with validation
  parseQuery<T>(schema: z.ZodSchema<T>): T {
    const url = new URL(this.request.url);
    const params = Object.fromEntries(url.searchParams.entries());

    // Convert string numbers to actual numbers
    const processedParams: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value === 'true') processedParams[key] = true;
      else if (value === 'false') processedParams[key] = false;
      else if (!isNaN(Number(value)) && value !== '') processedParams[key] = Number(value);
      else processedParams[key] = value;
    }

    return schema.parse(processedParams);
  }

  // Create optimized response with caching
  async createResponse<T, R = T>(
    dataFetcher: () => Promise<T>,
    options: {
      fields?: string[];
      transform?: (data: T) => R;
      cacheKey?: string;
      headers?: Record<string, string>;
      compress?: boolean;
    } = {}
  ): Promise<NextResponse> {
    const { fields, transform, cacheKey, headers = {}, compress = true } = options;

    const finalCacheKey = cacheKey || this.getCacheKey();

    try {
      // Check cache first
      const cached = await globalCache.get(finalCacheKey);
      if (cached) {
        return NextResponse.json(cached, {
          headers: {
            'X-Cache': 'HIT',
            'Cache-Control': `public, max-age=${this.cacheTTL / 1000}`,
            ...headers,
          },
        });
      }

      // Fetch fresh data
      const startTime = performance.now();
      const rawData = await dataFetcher();
      const fetchTime = performance.now() - startTime;

      // Apply transformations
      let processedData = transform ? transform(rawData) : (rawData as R);

      // Select specific fields if requested
      if (fields && Array.isArray(processedData)) {
        processedData = processedData.map((item: Record<string, unknown>) =>
          selectFields(item, fields)
        ) as R;
      } else if (fields && typeof processedData === 'object') {
        processedData = selectFields(processedData as Record<string, unknown>, fields) as R;
      }

      // Compress response if supported and enabled
      if (compress && this.supportsCompression()) {
        processedData = compressResponse(processedData);
      }

      // Cache the result
      await globalCache.set(finalCacheKey, processedData, this.cacheTTL);

      // Performance headers
      const responseHeaders: Record<string, string> = {
        'X-Cache': 'MISS',
        'X-Response-Time': `${fetchTime.toFixed(2)}ms`,
        'Cache-Control': `public, max-age=${this.cacheTTL / 1000}`,
        'Content-Type': 'application/json',
        ...headers,
      };

      // Add compression header if applied
      if (compress && this.supportsCompression()) {
        responseHeaders['X-Compressed'] = 'true';
      }

      return NextResponse.json(processedData, { headers: responseHeaders });
    } catch (error) {
      console.error('API Response Error:', error);

      return NextResponse.json(
        {
          error: 'Internal Server Error',
          message: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
        },
        {
          status: 500,
          headers: {
            'X-Cache': 'ERROR',
            ...headers,
          },
        }
      );
    }
  }

  // Paginated response helper
  async createPaginatedResponse<T>(
    dataFetcher: (limit: number, offset: number) => Promise<{ data: T[]; total: number }>,
    options: {
      page?: number;
      limit?: number;
      maxLimit?: number;
      fields?: string[];
      transform?: (data: T[]) => any;
    } = {}
  ): Promise<NextResponse> {
    const { page = 1, limit = 10, maxLimit = 100, fields, transform } = options;

    const finalLimit = Math.min(limit, maxLimit);
    const offset = (page - 1) * finalLimit;

    return this.createResponse(
      async () => {
        const { data, total } = await dataFetcher(finalLimit, offset);

        return {
          data: transform ? transform(data) : data,
          pagination: {
            page,
            limit: finalLimit,
            total,
            pages: Math.ceil(total / finalLimit),
            hasNext: page * finalLimit < total,
            hasPrev: page > 1,
          },
        };
      },
      { fields }
    );
  }
}

// Validation schemas for common API parameters
export const commonSchemas = {
  pagination: z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
  }),

  fieldSelection: z.object({
    fields: z
      .string()
      .optional()
      .transform((str) =>
        str
          ? str
              .split(',')
              .map((f) => f.trim())
              .filter(Boolean)
          : undefined
      ),
  }),

  voiceoverQuery: z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(50).default(10),
    search: z.string().optional(),
    status: z.enum(['active', 'inactive', 'draft']).optional(),
    tags: z
      .string()
      .optional()
      .transform((str) =>
        str
          ? str
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          : undefined
      ),
    available: z.boolean().optional(),
    cohort: z.string().optional(),
    fields: z
      .string()
      .optional()
      .transform((str) =>
        str
          ? str
              .split(',')
              .map((f) => f.trim())
              .filter(Boolean)
          : undefined
      ),
  }),
};

// Response time monitoring
export class APIPerformanceMonitor {
  private static metrics: Array<{
    endpoint: string;
    method: string;
    duration: number;
    cacheHit: boolean;
    timestamp: number;
    status: number;
  }> = [];

  static recordMetric(
    endpoint: string,
    method: string,
    duration: number,
    cacheHit: boolean,
    status: number
  ) {
    this.metrics.push({
      endpoint,
      method,
      duration,
      cacheHit,
      timestamp: Date.now(),
      status,
    });

    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics.splice(0, this.metrics.length - 1000);
    }

    // Log slow endpoints
    if (duration > 2000 && process.env.NODE_ENV === 'development') {
      console.warn(`Slow API endpoint: ${method} ${endpoint} took ${duration.toFixed(2)}ms`);
    }
  }

  static getMetrics(timeframe: number = 3600000) {
    // 1 hour default
    const cutoff = Date.now() - timeframe;
    const recentMetrics = this.metrics.filter((m) => m.timestamp > cutoff);

    if (recentMetrics.length === 0) {
      return { message: 'No metrics available' };
    }

    const totalRequests = recentMetrics.length;
    const cacheHits = recentMetrics.filter((m) => m.cacheHit).length;
    const errors = recentMetrics.filter((m) => m.status >= 400).length;
    const avgResponseTime = recentMetrics.reduce((sum, m) => sum + m.duration, 0) / totalRequests;

    const endpointStats = recentMetrics.reduce(
      (acc, metric) => {
        const key = `${metric.method} ${metric.endpoint}`;
        if (!acc[key]) {
          acc[key] = { count: 0, totalTime: 0, errors: 0 };
        }
        acc[key].count++;
        acc[key].totalTime += metric.duration;
        if (metric.status >= 400) acc[key].errors++;
        return acc;
      },
      {} as Record<string, { count: number; totalTime: number; errors: number }>
    );

    return {
      summary: {
        totalRequests,
        cacheHitRate: ((cacheHits / totalRequests) * 100).toFixed(2),
        errorRate: ((errors / totalRequests) * 100).toFixed(2),
        avgResponseTime: avgResponseTime.toFixed(2),
      },
      endpoints: Object.entries(endpointStats)
        .map(([endpoint, stats]) => ({
          endpoint,
          requests: stats.count,
          avgTime: (stats.totalTime / stats.count).toFixed(2),
          errorRate: ((stats.errors / stats.count) * 100).toFixed(2),
        }))
        .sort((a, b) => parseFloat(b.avgTime) - parseFloat(a.avgTime)),
    };
  }
}
