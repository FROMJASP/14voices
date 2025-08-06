# Redis-Based Rate Limiting

This document describes the Redis-based rate limiting implementation for the 14voices application.

## Overview

The rate limiting system uses Redis to track request counts across multiple server instances, ensuring consistent rate limiting in a distributed environment.

## Architecture

### Components

1. **RedisRateLimiter** (`/src/lib/rate-limiter/index.ts`)
   - Core rate limiting logic using Redis for storage
   - Sliding window implementation
   - Per-endpoint and per-user rate limiting

2. **Middleware** (`/src/middleware.ts` and `/src/middleware/rate-limit.ts`)
   - Automatic rate limiting for all API routes
   - Pattern-based endpoint type detection
   - Rate limit headers on all responses

3. **Security Configuration** (`/src/config/security.ts`)
   - Centralized rate limit configurations
   - Different limits for different endpoint types

## Configuration

Rate limits are configured in `/src/config/security.ts`:

```typescript
rateLimits: {
  public: { windowMs: 60000, max: 60 },        // 60 requests per minute
  authenticated: { windowMs: 60000, max: 100 }, // 100 requests per minute
  forms: { windowMs: 60000, max: 10 },         // 10 form submissions per minute
  auth: { windowMs: 900000, max: 5 },          // 5 auth attempts per 15 minutes
  email: { windowMs: 300000, max: 10 },        // 10 emails per 5 minutes
  admin: { windowMs: 3600000, max: 100 },      // 100 admin actions per hour
  webhooks: { windowMs: 60000, max: 1000 },    // 1000 webhook calls per minute
  fileUpload: { windowMs: 300000, max: 20 },   // 20 uploads per 5 minutes
  importExport: { windowMs: 300000, max: 5 },  // 5 import/export per 5 minutes
}
```

## Endpoint Type Detection

The middleware automatically detects endpoint types based on URL patterns:

- `/api/auth/*`, `/api/login`, `/api/register` → `auth`
- `/api/admin/*`, `/admin/*` → `admin`
- `/api/forms/*`, `/api/contact` → `forms`
- `/api/email/*`, `/api/campaigns/*` → `email`
- `/api/webhooks/*` → `webhooks`
- `/api/upload/*`, `/api/files/*` → `fileUpload`
- `/api/import/*`, `/api/export/*` → `importExport`
- All other endpoints → `public`

## Usage

### Automatic Rate Limiting

All API routes are automatically rate-limited by the middleware. No additional code is needed.

### Custom Rate Limiting in API Routes

```typescript
import { createApiHandler } from '@/lib/api/handlers';

export const GET = createApiHandler(
  async (request) => {
    // Your API logic
    return { data: 'response' };
  },
  {
    rateLimit: {
      requests: 10,
      window: 60, // seconds
    },
  }
);
```

### Manual Rate Limiting

```typescript
import { getRateLimiter } from '@/lib/rate-limiter';

const rateLimiter = getRateLimiter();
const result = await rateLimiter.checkLimit(
  'user-123', // identifier
  '/api/custom', // endpoint
  { requests: 5, window: 60 } // config
);

if (!result.allowed) {
  // Handle rate limit exceeded
}
```

## Response Headers

All rate-limited endpoints include these headers:

- `X-RateLimit-Limit`: Total requests allowed in the window
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: Unix timestamp when the window resets
- `Retry-After`: Seconds until rate limit resets (only on 429 responses)

## Testing

Run the test script to verify Redis rate limiting:

```bash
bun scripts/test-rate-limit.ts
```

## Redis Configuration

Set these environment variables for Redis connection:

- `REDIS_URL`: Full Redis connection URL (preferred)
- `REDIS_HOST`: Redis server hostname
- `REDIS_PORT`: Redis server port
- `REDIS_PASSWORD`: Redis password (if required)
- `REDIS_DB`: Redis database number
- `CACHE_KEY_PREFIX`: Prefix for cache keys (default: 'cache:')

## Fallback Behavior

If Redis is unavailable:

- The system falls back to in-memory rate limiting
- Rate limits are still enforced but won't be synchronized across instances
- A warning is logged but requests continue to be processed

## Monitoring

Monitor rate limiting effectiveness by:

1. Checking Redis keys: `cache:ratelimit:*`
2. Monitoring 429 response rates
3. Analyzing rate limit headers in responses
4. Reviewing application logs for rate limit violations

## Best Practices

1. **Set appropriate limits**: Balance security with user experience
2. **Use different limits**: Stricter limits for sensitive endpoints
3. **Monitor usage**: Adjust limits based on actual usage patterns
4. **Graceful degradation**: System continues working if Redis fails
5. **Clear error messages**: Help users understand rate limits
