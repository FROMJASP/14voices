# CLAUDE.md

## Critical Production Issues & Solutions

### Blank Page with CSP Errors

If the site shows a blank page in production with Content Security Policy errors in the console:

**Problem**: CSP blocking Next.js inline scripts

```
Refused to execute inline script because it violates the following Content Security Policy directive: "script-src 'self'..."
```

**Solution**: Ensure `src/config/security.ts` includes `'unsafe-inline'` in production:

```typescript
'script-src': ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net']
```

**Prevention**:

- Always test production builds locally with `bun run build && bun start`
- Check browser console for CSP violations
- Next.js REQUIRES inline scripts to function

### TypeScript Compilation Errors

**Problem**: Build fails on Vercel with TypeScript errors not caught locally

**Common Issues**:

- Payload CMS expects numeric IDs for user relationships: `String(user.id)`
- Missing `Where` type imports from 'payload'
- Domain types not matching Payload collection schemas

**Prevention**:

- Always run `bun run build` before pushing
- Check that domain types match collection fields exactly
- Import `Where` type when using Payload queries

## Common Development Commands

```bash
# Install dependencies (MUST use Bun, not npm/yarn)
bun install

# Development server
bun dev                    # Standard Next.js dev server
bun dev:turbo             # With Turbopack for faster builds

# Build & production
bun run build             # Build for production
bun run build:vercel      # Build with import map generation for Vercel
bun start                 # Start production server

# Testing
bun test                  # Run unit tests with Vitest
bun test:watch           # Run tests in watch mode
bun test:coverage        # Generate coverage report
bun test:e2e             # Run Playwright E2E tests
bun test:e2e:ui          # Run Playwright tests with UI

# Code quality
bun run lint             # Run ESLint
bun run format           # Format code with Prettier
bun run format:check     # Check formatting

# Payload CMS
bun payload generate:types      # Generate TypeScript types after schema changes
bun payload generate:importmap  # Generate import map after adding custom components
bun payload migrate            # Run database migrations

# Database seeding
bun run seed             # Seed database with sample data
```

## Architecture Overview

### Tech Stack

- **Framework**: Next.js 15.4.5 with App Router
- **CMS**: Payload CMS 3.50.0 - Headless CMS with PostgreSQL
- **Database**: PostgreSQL (via @payloadcms/db-postgres)
- **Styling**: Tailwind CSS v4
- **Package Manager**: Bun (required - npm/yarn will not work)
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Email**: Resend API with custom email marketing system
- **Storage**: Vercel Blob for media/documents
- **Cache & Rate Limiting**: Redis (optional, with in-memory fallback)

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (app)/             # Public-facing routes
│   │   ├── (with-global-layout)/  # Routes with main layout
│   │   ├── order/         # Order flow pages
│   │   └── producties/    # Production pages
│   ├── (payload)/         # Payload admin panel routes
│   └── api/               # API endpoints
├── collections/           # Payload CMS collections (data models)
├── components/            # React components
│   ├── admin/            # Payload admin customizations
│   │   ├── cells/        # Admin table cell renderers
│   │   ├── graphics/     # Admin-specific graphics
│   │   └── login/        # Admin login components
│   ├── common/           # Shared, reusable components
│   │   ├── layout/       # Layout components
│   │   │   ├── footer/   # Footer component
│   │   │   └── header/   # Header with navigation & banner
│   │   ├── ui/           # Basic UI components
│   │   │   └── magic/    # Magic UI components
│   │   └── widgets/      # Complex reusable widgets
│   │       ├── drawer/   # Drawer components & hooks
│   │       ├── feedback/ # Error & maintenance components
│   │       ├── forms/    # Form components
│   │       └── media/    # Media player components
│   ├── domains/          # Domain-specific components
│   │   ├── cart/         # Shopping cart components
│   │   ├── pricing/      # Price calculator components
│   │   ├── production/   # Production order components
│   │   └── voiceover/    # Voiceover cards & search
│   ├── features/         # Feature-specific components
│   │   └── homepage/     # Homepage container
│   └── index.ts          # Central component exports
├── domains/              # Domain-driven design layers
│   ├── email/            # Email marketing domain
│   ├── booking/          # Bookings & scripts domain
│   ├── billing/          # Invoicing & payments domain
│   └── voiceover/        # Voiceover domain logic
├── config/               # Centralized configuration
├── contexts/             # React contexts
├── fields/               # Payload field configurations
├── globals/              # Payload globals
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── cache/           # Redis caching layer
│   ├── email/           # Email system utilities
│   ├── rate-limiter/    # Rate limiting implementation
│   └── storage/         # Blob storage utilities
├── middleware/           # Next.js middleware utilities
├── seed/                 # Database seeding scripts
├── types/                # TypeScript type definitions
├── utilities/            # Helper utilities
└── payload.config.ts     # Payload CMS configuration
```

### Domain-Driven Design

Each domain follows a consistent structure:

```
src/domains/{domain}/
├── types/          # Domain-specific TypeScript types
├── services/       # Business logic and orchestration
├── repositories/   # Data access layer
└── index.ts        # Public API exports
```

For detailed architecture documentation, see:

- [Architecture Overview](./docs/architecture/README.md)
- [Architecture Decision Records](./docs/architecture/adr/)

## Key Development Patterns

### API Routes

- Use domain services instead of direct Payload access
- Validate input with Zod schemas
- Handle errors gracefully
- Return consistent response formats

### Component Organization

- `admin/` - Payload admin customizations only
- `features/` - Complex feature-specific components
- `domains/` - Domain-specific business components
- `common/` - Shared, reusable components
  - `layout/` - Page layout components
  - `ui/` - Simple, reusable UI components
  - `widgets/` - Self-contained widget components

### Type Safety

- Generate types after schema changes: `bun payload generate:types`
- Use generated types from `@/payload-types`
- Domain types in `src/domains/{domain}/types`
- Shared types in `src/types/shared`

### Testing Strategy

- Unit tests with Vitest for utilities and services
- Integration tests for API routes
- E2E tests with Playwright for critical user flows
- Run before committing: `bun test`

### Performance Optimization

- Use React Server Components by default
- Implement Redis caching for frequently accessed data
- Optimize images with Next.js Image component
- Lazy load heavy components

### Security Best Practices

- Validate all user input with Zod
- Use Payload's built-in auth for protected routes
- Implement rate limiting on API endpoints
- Never expose sensitive data in client components

### Rate Limiting

The application uses Redis-based rate limiting with automatic fallback:

- **Redis-based**: Distributed rate limiting across server instances
- **Edge-safe fallback**: In-memory rate limiting for middleware
- **Automatic detection**: Different limits for auth, forms, uploads, etc.
- **Configuration**: See `src/config/security.ts` for rate limit settings

Rate limits are automatically applied to all API routes via middleware.
See [Rate Limiting Documentation](./docs/rate-limiting.md) for details.

### Redis & Caching

The application supports Redis for caching and rate limiting with automatic fallback:

- **Production**: Uses Redis when `REDIS_URL` is configured
- **Development**: Automatically falls back to in-memory cache if Redis is not running
- **No Redis errors**: Connection failures are handled gracefully without console spam
- **Automatic fallback**: System works seamlessly without Redis in development

To use Redis in development:

1. Install Redis locally: `brew install redis` (macOS) or use Docker
2. Start Redis: `redis-server` or `docker run -p 6379:6379 redis`
3. Set `REDIS_URL=redis://localhost:6379` in `.env.local`

The system will automatically detect and use Redis if available, or fall back to in-memory caching.

## Vercel Deployment Considerations

### Package Manager and Build Compatibility

**Critical Warning**: Bun is NOT supported on Vercel for production builds

- **Build Requirements**:
  - Use `npm` for Vercel deployments
  - Explicitly install ALL dependencies with `npm install`
  - Do NOT rely on Bun-specific features in production

**Recommended Workflow**:

```bash
# Local development (use Bun)
bun install
bun dev

# Vercel deployment preparation
npm install      # Ensure ALL dependencies are installed
npm run build    # Use npm for Vercel builds
```

### DevDependencies and Production Builds

**Problem**: DevDependencies are NOT automatically installed on Vercel production builds

- Always ensure critical build tools are in `dependencies`, not `devDependencies`
- Use `npm install [package] --save-prod` for build-critical packages
- Verify that build scripts work with npm

### Optional Dependencies and Dynamic Imports

**Bundle Analyzer and Conditional Loading Pattern**:

- Use dynamic imports with optional chaining for optional dependencies
- Implement fallback mechanisms for missing dependencies

```typescript
// Example of safe optional dependency loading
const loadBundleAnalyzer = async () => {
  try {
    const withBundleAnalyzer = (await import('@next/bundle-analyzer'))?.default;
    return withBundleAnalyzer({
      enabled: process.env.ANALYZE === 'true',
    });
  } catch {
    return (config) => config; // Return identity function if not available
  }
};
```

**Key Considerations**:

- Local development: Continue using Bun (`bun dev`, `bun test`, `bun run build`)
- Vercel automatically uses npm for production builds
- Be prepared to modify import strategies for optional dependencies
- Platform-specific native dependencies (sharp, lightningcss) are handled by postinstall script

### Troubleshooting Vercel Deployment

- Check Vercel build logs for specific dependency or import errors
- Ensure all required environment variables are configured
- Verify that Next.js configuration is compatible with Vercel's build process
- Use Vercel's GitHub integration for automatic deployments

**Recommended Vercel Settings**:

- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
