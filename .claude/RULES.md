# RULES.md - Critical Rules for 14Voices

## 🚫 NEVER DO (Blocking)

### Package Manager

- ❌ NEVER use npm, yarn, or pnpm
- ❌ NEVER write npm install, npm run, npx
- ✅ ALWAYS use bun, bunx

### Build & Deploy

- ❌ NEVER push without local build success
- ❌ NEVER debug on Vercel first
- ❌ NEVER skip type generation after schema changes

### Code Quality

- ❌ NEVER use `any` type in TypeScript
- ❌ NEVER leave duplicate code
- ❌ NEVER ignore ESLint errors

### Payload CMS

- ❌ NEVER create complex admin UI customizations
- ❌ NEVER skip import map generation for custom components

## ✅ ALWAYS DO

### Development Flow

```bash
1. bun run build         # Must succeed
2. bun payload generate:types
3. bun payload generate:importmap  # If custom components
4. git commit -m "clear message"
5. git push
```

### When Debugging

```bash
1. Check local build first
2. Compare .env.local vs Vercel
3. Verify all dependencies
4. Check import paths
5. Only then check Vercel logs
```

## 🎯 Performance Requirements

### User-Facing

- Demo loading: <2s
- API responses: <200ms
- Order submission: <1s
- Page load: <3s

### Development

- Local build: <30s
- Hot reload: instant
- Type generation: <10s

## 🔒 Security Rules

### Always

- Validate all inputs with Zod
- Use parameterized queries
- Sanitize user content
- Check authentication
- Use environment variables for secrets

### Never

- Store passwords in plain text
- Trust user input
- Expose internal errors
- Skip validation
- Commit secrets

### Protected Features

- Payment processing (Stripe)
- Customer data
- Order management
- Talent information
- Admin access

## 🚀 Git & Deployment

### Before Major Changes

```bash
git add .
git commit -m "checkpoint before [change]"
```

### Deployment Checklist

1. All tests passing
2. Build succeeds locally
3. Types are current
4. Environment variables set
5. No console errors

## 📊 Sentry Integration

### Exception Catching

Use `Sentry.captureException(error)` to capture exceptions in try-catch blocks.

### Tracing Examples

#### Component Actions

```javascript
function TestComponent() {
  const handleTestButtonClick = () => {
    Sentry.startSpan(
      {
        op: 'ui.click',
        name: 'Test Button Click',
      },
      (span) => {
        const value = 'some config';
        const metric = 'some metric';

        span.setAttribute('config', value);
        span.setAttribute('metric', metric);

        doSomething();
      }
    );
  };

  return (
    <button type="button" onClick={handleTestButtonClick}>
      Test Sentry
    </button>
  );
}
```

#### API Calls

```javascript
async function fetchUserData(userId) {
  return Sentry.startSpan(
    {
      op: 'http.client',
      name: `GET /api/users/${userId}`,
    },
    async () => {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      return data;
    }
  );
}
```

### Logging Configuration

#### NextJS File Locations

- Client: `instrumentation-client.ts`
- Server: `sentry.server.config.ts`
- Edge: `sentry.edge.config.ts`

#### Baseline Setup

```javascript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://a34d9edc9cc737c5fec550f28ce673ff@o4509604139565056.ingest.de.sentry.io/4509604184260688',
  _experiments: {
    enableLogs: true,
  },
});
```

#### Logger Integration

```javascript
Sentry.init({
  dsn: 'https://a34d9edc9cc737c5fec550f28ce673ff@o4509604139565056.ingest.de.sentry.io/4509604184260688',
  integrations: [Sentry.consoleLoggingIntegration({ levels: ['log', 'error', 'warn'] })],
});
```

#### Logger Examples

```javascript
logger.trace('Starting database connection', { database: 'users' });
logger.debug(logger.fmt`Cache miss for user: ${userId}`);
logger.info('Updated profile', { profileId: 345 });
logger.warn('Rate limit reached for endpoint', {
  endpoint: '/api/results/',
  isEnterprise: false,
});
logger.error('Failed to process payment', {
  orderId: 'order_123',
  amount: 99.99,
});
logger.fatal('Database connection pool exhausted', {
  database: 'users',
  activeConnections: 100,
});
```

---

_These rules are non-negotiable for project stability and quality_
