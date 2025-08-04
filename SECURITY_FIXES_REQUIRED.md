# Security Fixes Required

## Critical Issues (Fix Immediately)

### 1. Apply CSRF Protection to All API Routes

**Problem:** CSRF protection is implemented but not used.

**Fix:** Update all POST/PUT/DELETE endpoints to use the `withAuth` middleware:

```typescript
// Before
export async function POST(req: NextRequest) {
  // handler code
}

// After
import { withAuth } from '@/lib/auth-middleware';

export const POST = withAuth(async (req: NextRequest) => {
  // handler code
}, {
  requireAuth: true,
  rateLimit: 'forms'
});
```

### 2. Fix Rate Limiter to Use Redis

**Problem:** In-memory rate limiting doesn't work across instances.

**Fix:** Update `/src/lib/rate-limiter.ts`:

```typescript
import { getRedisClient } from './cache';

export async function checkRateLimit(
  clientId: string,
  limit: number = 60,
  windowMs: number = 60000
): Promise<RateLimitResult> {
  const redis = await getRedisClient();
  const key = `rate_limit:${clientId}`;
  const now = Date.now();
  const windowStart = now - windowMs;

  // Use Redis sorted sets for sliding window
  await redis.zremrangebyscore(key, '-inf', windowStart);
  await redis.zadd(key, now, `${now}-${Math.random()}`);
  await redis.expire(key, Math.ceil(windowMs / 1000));
  
  const count = await redis.zcard(key);
  
  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    resetTime: now + windowMs
  };
}
```

### 3. Secure All Admin API Routes

Apply authentication to these unprotected routes:

- `/api/campaigns/*`
- `/api/audiences/*`
- `/api/admin/*`
- `/api/email/*`
- `/api/analytics/*`

### 4. Fix File Upload Security

Update `/src/collections/Media.ts`:

```typescript
import { validateFileContent, scanFileForThreats, sanitizeFilename } from '@/lib/file-security';

hooks: {
  beforeOperation: [
    async ({ args, operation }) => {
      if (operation === 'create' && args.req?.file) {
        const file = args.req.file;
        
        // Validate file content matches MIME type
        const buffer = Buffer.from(await file.arrayBuffer());
        const validation = await validateFileContent(buffer, file.mimetype);
        
        if (!validation.valid) {
          throw new Error(validation.error);
        }
        
        // Scan for threats
        const scan = await scanFileForThreats(buffer, file.filename);
        if (!scan.safe) {
          throw new Error(`Security threat detected: ${scan.threats?.join(', ')}`);
        }
        
        // Sanitize filename
        args.data.filename = sanitizeFilename(file.filename);
      }
      return args;
    }
  ]
}
```

### 5. Fix Webhook Timing Attack

Update `/src/app/api/webhooks/resend/route.ts` line 40:

```typescript
// Before
return crypto.timingSafeEqual(Buffer.from(receivedSignature), Buffer.from(expectedSignature));

// After
return crypto.timingSafeEqual(
  Buffer.from(receivedSignature, 'hex'),
  Buffer.from(expectedSignature, 'hex')
);
```

## High Priority Issues

### 6. Add Security Logging Collection

Create a Payload collection for security logs:

```typescript
// src/collections/SecurityLogs.ts
import type { CollectionConfig } from 'payload';

export const SecurityLogs: CollectionConfig = {
  slug: 'security-logs',
  access: {
    read: ({ req: { user } }) => user?.roles?.includes('admin'),
    create: () => false, // Only system can create
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: ['auth_failure', 'suspicious_activity', 'rate_limit_exceeded', 'invalid_input', 'file_threat']
    },
    {
      name: 'severity',
      type: 'select',
      required: true,
      options: ['low', 'medium', 'high', 'critical']
    },
    {
      name: 'userId',
      type: 'text',
    },
    {
      name: 'ipAddress',
      type: 'text',
    },
    {
      name: 'details',
      type: 'json',
    },
    {
      name: 'timestamp',
      type: 'date',
      required: true,
    }
  ],
  admin: {
    defaultColumns: ['type', 'severity', 'timestamp', 'ipAddress'],
  }
};
```

### 7. Implement API Key Authentication

For external API access:

```typescript
// src/lib/api-key-auth.ts
import crypto from 'crypto';

export async function validateAPIKey(key: string): Promise<{ valid: boolean; userId?: string }> {
  if (!key || !key.startsWith('14v_')) {
    return { valid: false };
  }
  
  const [prefix, keyId, secret] = key.split('_');
  
  // Verify against database
  const payload = await getPayload();
  const apiKey = await payload.find({
    collection: 'api-keys',
    where: {
      keyId: { equals: keyId },
      active: { equals: true }
    }
  });
  
  if (apiKey.totalDocs === 0) {
    return { valid: false };
  }
  
  const storedHash = apiKey.docs[0].hash;
  const hash = crypto.createHash('sha256').update(secret).digest('hex');
  
  if (!crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(storedHash))) {
    return { valid: false };
  }
  
  return { valid: true, userId: apiKey.docs[0].userId };
}
```

### 8. Add Request Signing for Critical Operations

```typescript
// src/lib/request-signing.ts
export function signRequest(payload: any, secret: string): string {
  const timestamp = Date.now();
  const message = `${timestamp}.${JSON.stringify(payload)}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('hex');
  
  return `t=${timestamp},v1=${signature}`;
}

export function verifyRequestSignature(
  payload: any,
  signature: string,
  secret: string,
  tolerance: number = 300000 // 5 minutes
): boolean {
  const parts = signature.split(',');
  const timestamp = parts[0]?.replace('t=', '');
  const sig = parts[1]?.replace('v1=', '');
  
  if (!timestamp || !sig) return false;
  
  // Check timestamp tolerance
  const age = Date.now() - parseInt(timestamp);
  if (age > tolerance) return false;
  
  // Verify signature
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${JSON.stringify(payload)}`)
    .digest('hex');
  
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig));
}
```

## Implementation Priority

1. **Week 1:** Apply auth middleware to all API routes
2. **Week 1:** Fix rate limiter to use Redis
3. **Week 2:** Implement file upload security
4. **Week 2:** Add security logging
5. **Week 3:** Deploy API key system
6. **Week 3:** Add request signing for critical operations

## Testing Security Fixes

```bash
# Test CSRF protection
curl -X POST http://localhost:3000/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}' \
  # Should fail without CSRF token

# Test rate limiting
for i in {1..100}; do
  curl http://localhost:3000/api/forms/submit
done
# Should get 429 after limit

# Test file upload validation
curl -X POST http://localhost:3000/api/upload \
  -F "file=@malicious.exe" \
  # Should be rejected
```

## Monitoring

Set up alerts for:
- Failed authentication attempts > 5 in 5 minutes
- Rate limit violations > 100 in 1 hour
- File upload threats detected
- Suspicious query patterns

## Additional Recommendations

1. **Enable Vercel WAF** for DDoS protection
2. **Set up Cloudflare** for additional security layers
3. **Regular security audits** every quarter
4. **Dependency scanning** with Snyk or GitHub Dependabot
5. **Penetration testing** before major releases