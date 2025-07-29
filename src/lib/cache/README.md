# Cache Layer Documentation

## Overview

High-performance caching layer with in-memory LRU cache and optional Redis support for the 14voices platform.

## Features

- **In-memory LRU Cache**: Fast, size-limited cache with automatic eviction
- **Redis Integration**: Optional distributed caching with environment-based configuration
- **TTL Support**: Time-to-live for cache entries
- **Cache Invalidation**: Pattern-based cache clearing
- **Performance Monitoring**: Built-in metrics and hit rate tracking
- **Multiple Strategies**: Write-through, write-behind, refresh-ahead, etc.

## Usage

### Basic Usage

```typescript
import globalCache from '@/lib/cache';

// Set a value
await globalCache.set('key', { data: 'value' }, 300000); // 5 min TTL

// Get a value
const cached = await globalCache.get('key');

// Wrap a function
const result = await globalCache.wrap(
  'expensive-operation',
  async () => await expensiveOperation(),
  600000 // 10 min TTL
);
```

### API Handlers

```typescript
import { createApiHandler, createPaginatedHandler } from '@/lib/api/handlers';

// Simple cached API
export const GET = createApiHandler(
  async (req) => {
    return await fetchData();
  },
  {
    cache: {
      enabled: true,
      ttl: 300000,
      invalidatePatterns: ['data:*'],
    },
    rateLimit: {
      requests: 30,
      window: 60,
    },
  }
);

// Paginated API
export const GET = createPaginatedHandler(
  async (params) => {
    const data = await fetchPaginatedData(params);
    return { data: data.docs, total: data.total };
  },
  {
    cache: { enabled: true, ttl: 600000 },
  }
);
```

### Cache Strategies

```typescript
import { createCacheStrategy } from '@/lib/cache/strategies';

// Write-through cache
const strategy = createCacheStrategy('write-through', {
  cache: globalCache,
  dataFetcher: async (key) => await fetchFromDB(key),
});

// Refresh-ahead cache
const refreshStrategy = createCacheStrategy('refresh-ahead', {
  cache: globalCache,
  dataFetcher: async (key) => await fetchFromAPI(key),
  refreshThreshold: 0.8, // Refresh when 80% of TTL expired
  refreshInterval: 10000,
});
```

## Configuration

### Environment Variables

```env
# Redis Configuration (optional)
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
CACHE_KEY_PREFIX=cache:
```

### Cache Options

```typescript
const cache = new CacheManager({
  maxSize: 100 * 1024 * 1024, // 100MB
  defaultTTL: 300000, // 5 minutes
  useRedis: true,
  layers: {
    memory: true,
    redis: true,
  },
  onEvict: (key, value) => {
    console.log(`Evicted ${key}`);
  },
});
```

## Performance Metrics

Access cache metrics via the API:

```bash
GET /api/cache/metrics
```

Response:

```json
{
  "stats": {
    "hits": 1234,
    "misses": 56,
    "evictions": 12,
    "size": 5242880,
    "maxSize": 104857600
  },
  "hitRate": "95.65%",
  "utilization": "5.00%",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Cache Invalidation

```typescript
// Invalidate by pattern
await globalCache.invalidate(['voiceovers:*', 'testimonials:*']);

// Clear all
await globalCache.clear();

// Delete specific key
await globalCache.delete('specific-key');
```

## Best Practices

1. **Key Naming**: Use hierarchical keys (e.g., `collection:id:field`)
2. **TTL Selection**: Balance freshness vs performance
3. **Size Limits**: Monitor cache size to prevent memory issues
4. **Error Handling**: Cache operations should fail gracefully
5. **Monitoring**: Track hit rates and adjust TTLs accordingly
