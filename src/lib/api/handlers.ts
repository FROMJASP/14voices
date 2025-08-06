import { NextRequest, NextResponse } from 'next/server';
import globalCache, { CacheManager } from '@/lib/cache';

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiHandlerOptions {
  cache?: {
    enabled?: boolean;
    ttl?: number;
    key?: string | ((req: NextRequest) => string);
    invalidatePatterns?: string[];
  };
  rateLimit?: {
    requests: number;
    window: number;
  };
  transform?: (data: unknown) => unknown;
  validate?: (data: unknown) => boolean | Promise<boolean>;
}

export interface ApiError {
  message: string;
  code?: string;
  status: number;
  details?: unknown;
}

export class ApiResponse {
  static success<T>(data: T, status = 200): NextResponse {
    return NextResponse.json(
      {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      },
      { status }
    );
  }

  static error(error: ApiError): NextResponse {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message,
          code: error.code,
          details: error.details,
        },
        timestamp: new Date().toISOString(),
      },
      { status: error.status }
    );
  }

  static paginated<T>(data: T[], total: number, params: PaginationParams): NextResponse {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      timestamp: new Date().toISOString(),
    });
  }
}

export function parsePaginationParams(req: NextRequest): PaginationParams {
  const { searchParams } = new URL(req.url);

  return {
    page: Math.max(1, parseInt(searchParams.get('page') || '1')),
    limit: Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10'))),
    sort: searchParams.get('sort') || undefined,
    order: (searchParams.get('order') || 'asc') as 'asc' | 'desc',
  };
}

export function createCacheKey(base: string, params: Record<string, unknown>): string {
  const sortedParams = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}:${JSON.stringify(value)}`)
    .join('|');

  return `${base}${sortedParams ? `|${sortedParams}` : ''}`;
}

// In-memory rate limit store for API routes (server-side only)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export async function checkRateLimit(
  identifier: string,
  limit: number,
  window: number
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const now = Date.now();
  const windowMs = window * 1000;

  // Try to use Redis-based rate limiter if available
  try {
    // Dynamic import to avoid Edge Runtime issues
    const { getRateLimiter } = await import('@/lib/rate-limiter');
    const rateLimiter = getRateLimiter();
    const result = await rateLimiter.checkLimit(identifier, 'legacy', {
      requests: limit,
      window,
    });

    return {
      allowed: result.allowed,
      remaining: result.remaining,
      resetAt: result.resetAt,
    };
  } catch (error) {
    // Fallback to in-memory rate limiting
    let record = rateLimitStore.get(identifier);

    if (!record || now >= record.resetAt) {
      record = { count: 0, resetAt: now + windowMs };
      rateLimitStore.set(identifier, record);
    }

    const allowed = record.count < limit;
    const remaining = Math.max(0, limit - record.count - 1);

    if (allowed) {
      record.count++;
    }

    return { allowed, remaining, resetAt: record.resetAt };
  }
}

export function withCache<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  options: {
    keyGenerator: (...args: T) => string;
    ttl?: number;
    cache?: CacheManager;
  }
): (...args: T) => Promise<R> {
  const cache = options.cache || globalCache;

  return async (...args: T): Promise<R> => {
    const key = options.keyGenerator(...args);

    const cached = await cache.get<R>(key);
    if (cached !== undefined) {
      return cached;
    }

    const result = await fn(...args);
    await cache.set(key, result, options.ttl);

    return result;
  };
}

export function createApiHandler<T = unknown>(
  handler: (req: NextRequest) => Promise<T>,
  options: ApiHandlerOptions = {}
): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest) => {
    try {
      if (options.rateLimit) {
        const identifier =
          req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous';

        const { allowed, remaining, resetAt } = await checkRateLimit(
          identifier,
          options.rateLimit.requests,
          options.rateLimit.window
        );

        if (!allowed) {
          return ApiResponse.error({
            message: 'Too many requests',
            code: 'RATE_LIMIT_EXCEEDED',
            status: 429,
            details: { resetAt: new Date(resetAt).toISOString() },
          });
        }

        const response = await handleWithCache(req, handler, options);
        response.headers.set('X-RateLimit-Limit', options.rateLimit.requests.toString());
        response.headers.set('X-RateLimit-Remaining', remaining.toString());
        response.headers.set('X-RateLimit-Reset', resetAt.toString());

        return response;
      }

      return await handleWithCache(req, handler, options);
    } catch (error) {
      console.error('API handler error:', error);

      if (error instanceof Error) {
        return ApiResponse.error({
          message: error.message,
          status: 500,
        });
      }

      return ApiResponse.error({
        message: 'Internal server error',
        status: 500,
      });
    }
  };
}

async function handleWithCache<T>(
  req: NextRequest,
  handler: (req: NextRequest) => Promise<T>,
  options: ApiHandlerOptions
): Promise<NextResponse> {
  if (options.cache?.enabled !== false && req.method === 'GET') {
    const cacheKey =
      typeof options.cache?.key === 'function'
        ? options.cache.key(req)
        : options.cache?.key ||
          createCacheKey(req.url, Object.fromEntries(req.nextUrl.searchParams));

    const cached = await globalCache.get<T>(cacheKey);
    if (cached !== undefined) {
      const transformed = options.transform ? options.transform(cached) : cached;
      const response = ApiResponse.success(transformed);
      response.headers.set('X-Cache', 'HIT');
      return response;
    }

    const result = await handler(req);

    if (options.validate) {
      const isValid = await options.validate(result);
      if (!isValid) {
        return ApiResponse.error({
          message: 'Validation failed',
          status: 400,
        });
      }
    }

    await globalCache.set(cacheKey, result, options.cache?.ttl);

    const transformed = options.transform ? options.transform(result) : result;
    const response = ApiResponse.success(transformed);
    response.headers.set('X-Cache', 'MISS');
    return response;
  }

  const result = await handler(req);

  if (options.validate) {
    const isValid = await options.validate(result);
    if (!isValid) {
      return ApiResponse.error({
        message: 'Validation failed',
        status: 400,
      });
    }
  }

  if (options.cache?.invalidatePatterns && req.method !== 'GET') {
    await globalCache.invalidate(options.cache.invalidatePatterns);
  }

  const transformed = options.transform ? options.transform(result) : result;
  return ApiResponse.success(transformed);
}

export function createPaginatedHandler<T>(
  fetcher: (
    params: PaginationParams & Record<string, unknown>
  ) => Promise<{ data: T[]; total: number }>,
  options: ApiHandlerOptions = {}
): (req: NextRequest) => Promise<NextResponse> {
  return createApiHandler(
    async (req: NextRequest) => {
      const paginationParams = parsePaginationParams(req);
      const { searchParams } = new URL(req.url);

      const additionalParams: Record<string, unknown> = {};
      for (const [key, value] of searchParams.entries()) {
        if (!['page', 'limit', 'sort', 'order'].includes(key)) {
          additionalParams[key] = value;
        }
      }

      const { data, total } = await fetcher({ ...paginationParams, ...additionalParams });

      return {
        data,
        meta: {
          page: paginationParams.page!,
          limit: paginationParams.limit!,
          total,
          totalPages: Math.ceil(total / paginationParams.limit!),
        },
      };
    },
    {
      ...options,
      transform: (result: unknown) => {
        const typedResult = result as { data: unknown };
        const transformed = options.transform
          ? options.transform(typedResult.data)
          : typedResult.data;
        return {
          ...typedResult,
          data: transformed,
        };
      },
    }
  );
}

export async function batchProcess<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  options: {
    batchSize?: number;
    onProgress?: (processed: number, total: number) => void;
    onError?: (error: Error, item: T) => void;
  } = {}
): Promise<R[]> {
  const { batchSize = 10, onProgress, onError } = options;
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchPromises = batch.map(async (item) => {
      try {
        return await processor(item);
      } catch (error) {
        if (onError) {
          onError(error as Error, item);
        }
        throw error;
      }
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    if (onProgress) {
      onProgress(results.length, items.length);
    }
  }

  return results;
}

export function measurePerformance<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  name: string
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    const start = performance.now();
    try {
      const result = await fn(...args);
      const duration = performance.now() - start;
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`[Performance] ${name} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  };
}

export const withPerformanceLogging = <T extends unknown[], R>(
  handler: (...args: T) => Promise<R>,
  name: string
) => measurePerformance(handler, name);

export function createCachedFetcher<T>(
  fetcher: () => Promise<T>,
  cacheKey: string,
  ttl?: number
): () => Promise<T> {
  return withCache(fetcher, {
    keyGenerator: () => cacheKey,
    ttl,
  });
}
