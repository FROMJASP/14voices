'use client';

/**
 * Client-side data fetching hooks with SWR-like behavior
 */
import { useState, useEffect, useCallback, useRef } from 'react';

interface OptimizedQueryOptions {
  url: string;
  method?: 'GET' | 'POST';
  body?: any;
  revalidateOnFocus?: boolean;
  refreshInterval?: number;
  cacheKey?: string;
}

interface QueryResult<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isValidating: boolean;
  mutate: (data?: T) => void;
  refresh: () => Promise<void>;
}

// Client-side cache
const clientCache = new Map<string, any>();

/**
 * React hook for optimized data fetching with SWR-like behavior
 */
export function useOptimizedQuery<T = any>(
  options: OptimizedQueryOptions,
  dependencies: any[] = []
): QueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const cacheKey = options.cacheKey || options.url;

  const fetchData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      setIsValidating(true);
      setError(null);

      // Check cache first
      const cached = clientCache.get(cacheKey);
      if (cached && !showLoading) {
        setData(cached);
        setIsLoading(false);
      }

      const response = await fetch(options.url, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Update cache
      clientCache.set(cacheKey, result);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
      setIsValidating(false);
    }
  }, [options.url, options.method, options.body, cacheKey]);

  const mutate = useCallback((newData?: T) => {
    if (newData !== undefined) {
      setData(newData);
      clientCache.set(cacheKey, newData);
    } else {
      fetchData(false);
    }
  }, [fetchData, cacheKey]);

  const refresh = useCallback(() => fetchData(false), [fetchData]);

  // Initial fetch and dependency updates
  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  // Focus revalidation
  useEffect(() => {
    if (!options.revalidateOnFocus) return;

    const handleFocus = () => {
      if (!document.hidden) {
        refresh();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [options.revalidateOnFocus, refresh]);

  // Refresh interval
  useEffect(() => {
    if (!options.refreshInterval) return;

    intervalRef.current = setInterval(refresh, options.refreshInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [options.refreshInterval, refresh]);

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
    refresh,
  };
}

/**
 * Hook for infinite loading/pagination
 */
export function useInfiniteQuery<T = any>(
  baseUrl: string,
  options: {
    limit?: number;
    initialPage?: number;
    getNextPageParam?: (lastPage: any, allPages: any[]) => number | null;
  } = {}
) {
  const [pages, setPages] = useState<T[][]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { limit = 10, initialPage = 1, getNextPageParam } = options;

  const fetchNextPage = useCallback(async () => {
    if (!hasNextPage || isFetchingNextPage) return;

    if (pages.length === 0) {
      setIsLoading(true);
    }
    setIsFetchingNextPage(true);
    setError(null);

    try {
      const nextPage = getNextPageParam 
        ? getNextPageParam(pages[pages.length - 1], pages)
        : initialPage + pages.length;

      if (nextPage === null) {
        setHasNextPage(false);
        return;
      }

      const response = await fetch(`${baseUrl}?page=${nextPage}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      setPages(prev => [...prev, result.docs || result]);
      setHasNextPage(result.hasNextPage ?? (result.docs?.length === limit));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsFetchingNextPage(false);
      setIsLoading(false);
    }
  }, [baseUrl, limit, pages, hasNextPage, isFetchingNextPage, getNextPageParam, initialPage]);

  const reset = useCallback(() => {
    setPages([]);
    setHasNextPage(true);
    setError(null);
  }, []);

  // Initial load
  useEffect(() => {
    if (pages.length === 0) {
      fetchNextPage();
    }
  }, [fetchNextPage, pages.length]);

  const data = pages.flat();

  return {
    data,
    pages,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    reset,
  };
}