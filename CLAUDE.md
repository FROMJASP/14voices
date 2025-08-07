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

### Dependency Issues

**Problem**: Build fails with "Module not found" errors

**Common Causes**:

1. **DevDependencies Used in Production Code**
   - Example: `@sentry/nextjs` was in devDependencies but imported in production files
   - Vercel does NOT install devDependencies during production builds
   - Any dependency imported in production code MUST be in `dependencies`
   - **CSS imports count too!** `tw-animate-css` must be in dependencies if imported in CSS

2. **Script-Only Dependencies**
   - Scripts like `reset-admin-access.ts` should handle missing devDependencies gracefully
   - Use conditional imports with environment checks:

   ```typescript
   // ✅ Safe pattern for optional dev dependencies
   if (process.env.NODE_ENV !== 'production') {
     try {
       require.resolve('dotenv');
       const dotenv = await import('dotenv');
       // Use dotenv here
     } catch (e) {
       // Handle gracefully
     }
   }
   ```

3. **Missing Platform-Specific Binaries**
   - Sharp, lightningcss require platform-specific binaries
   - Handled automatically by postinstall script

**Prevention**:

- Check all imports in production files reference packages in `dependencies`
- CSS imports (`@import 'package-name'`) also need packages in `dependencies`
- Run `bun run validate:build` to test production build locally
- Never manually install platform-specific binaries
- Scripts should use conditional imports for dev dependencies

### Build Warnings & Errors

**ESLint During Builds**

- Warning: "ESLint must be installed in order to run during builds"
- Solution: ESLint is disabled during production builds in `next.config.ts`
- Run linting locally with `bun run lint` before pushing

**Deprecated Type Packages**

- Warnings about `@types/dompurify` and `@types/bcryptjs` being stubs
- These packages now provide their own types
- Remove these from dependencies to eliminate warnings

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
bun run typecheck        # Run TypeScript type checking

# Pre-deployment validation (CRITICAL - RUN BEFORE EVERY PUSH)
bun run validate         # Run all validation checks
bun run validate:build   # Test production build locally
bun run validate:full    # Complete validation including architecture

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

See [Architecture Documentation](./docs/architecture/) for detailed design decisions.

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

### Redis, Caching & Rate Limiting

The application uses Redis for both caching and rate limiting with automatic fallback:

- **Production**: Uses Redis when `REDIS_URL` is configured
- **Development**: Automatically falls back to in-memory cache/rate limiting
- **No errors**: Connection failures handled gracefully without console spam
- **Configuration**: See `src/config/security.ts` for rate limit settings

**Key Features**:

- Distributed rate limiting across server instances
- Different limits for auth, forms, uploads, etc.
- Edge-safe fallback for middleware
- Automatic detection and fallback

**Local Redis Setup** (optional):

```bash
# macOS
brew install redis
redis-server

# Docker
docker run -p 6379:6379 redis

# Configure
echo "REDIS_URL=redis://localhost:6379" >> .env.local
```

## Pre-Deployment Checklist

### 🚨 AUTOMATIC BUILD VALIDATION

**Git Pre-Push Hook**: The repository now has automatic validation that runs before every push!

When you run `git push`, the following checks are automatically performed:

1. TypeScript compilation check
2. Dependency validation (dev vs prod)
3. Common import issue detection
4. Full production build test

**If any check fails, the push will be blocked** to prevent breaking production.

### MANDATORY Before Pushing Code

**🚨 CRITICAL**: These checks are now automated but can be run manually:

1. **Quick Validation**: `bun run validate:pre-push`
   - Comprehensive validation including build test
   - Catches ALL common deployment issues
   - Run this if you want to test before attempting to push

2. **Type Checking**: `bun run typecheck`
   - Ensures no TypeScript compilation errors
   - Catches type mismatches between domains and Payload
   - Verifies all imports are properly typed

3. **Build Validation**: `bun run validate:build`
   - Runs a full production build locally
   - Tests both Next.js and Payload compilation
   - Verifies all imports and dependencies
   - Catches module resolution errors before deployment

4. **Full Validation**: `bun run validate:full`
   - Runs lint, format check, typecheck, tests, AND build
   - Validates dependencies and architecture
   - Ensures code quality standards are met
   - Prevents ALL common deployment failures

### 🚨 Build Failure Quick Fixes

**Latest Issues Resolved:**

1. **Dynamic Import Errors (dotenv in scripts)**
   - Problem: TypeScript compilation fails on dynamic imports in scripts
   - Solution: Use environment checks before importing dev dependencies

   ```typescript
   if (process.env.NODE_ENV !== 'production') {
     try {
       require.resolve('dotenv');
       const dotenv = await import('dotenv');
     } catch (e) {}
   }
   ```

2. **Script Execution Context**
   - Scripts in `src/scripts/` are included in build but may not run in production
   - Always guard dev-only imports with environment checks
   - Use try-catch for optional dependencies

### Build Failure Prevention Guide

#### Dependency Validation

**Before pushing, verify dependencies:**

```bash
# Check if any devDependencies are imported in src/
bun run validate:deps  # Add this script if not exists

# Manually verify critical packages are in dependencies:
# - @sentry/nextjs (if using error monitoring)
# - Any packages imported in:
#   - src/app/**
#   - src/components/**
#   - src/lib/**
#   - src/domains/**
```

### Common Build Failure Causes

1. **Missing Type Imports**

   ```typescript
   // ❌ Will fail on Vercel
   const query: Where = { ... }

   // ✅ Correct
   import type { Where } from 'payload'
   const query: Where = { ... }
   ```

2. **Payload ID Type Mismatches**

   ```typescript
   // ❌ Payload expects numeric IDs
   user: currentUser.id; // if id is string

   // ✅ Correct
   user: Number(currentUser.id);
   ```

3. **Dev Dependencies in Production**
   - All runtime dependencies MUST be in `dependencies`, not `devDependencies`
   - Vercel doesn't install devDependencies
   - Common mistakes:
     - Error monitoring (@sentry/nextjs)
     - UI libraries used in components
     - Utilities imported in production code
   - Rule: If it's imported anywhere in `src/`, it belongs in `dependencies`

4. **Platform-Specific Dependencies**
   - Sharp, lightningcss handled by postinstall script
   - Don't manually install platform binaries

## Vercel Deployment Considerations

### Package Manager Notes

**Important**: Bun is NOT supported on Vercel

- **Local Development**: Use Bun (`bun install`, `bun dev`, `bun test`)
- **Vercel Production**: Automatically uses npm (configured in vercel.json)
- **No manual npm commands needed** - Vercel handles the conversion

### DevDependencies in Production

**Issue**: Vercel doesn't install devDependencies in production builds

**Solution**: Use conditional imports for optional dev tools:

```typescript
// Safe loading pattern for optional dependencies
if (process.env.NODE_ENV === 'development') {
  // Load dev-only dependencies here
}
```

**Note**: Platform-specific native dependencies (sharp, lightningcss) are handled automatically by the postinstall script.

### Troubleshooting Vercel Builds

1. **Module Not Found Errors**
   - Check if the missing module is in devDependencies
   - Move it to dependencies if imported in production code
   - Run `bun install` after moving dependencies

2. **TypeScript Errors**
   - Run `bun run typecheck` locally
   - Fix all errors before pushing
   - Ensure all type imports use `import type`

3. **Build Command Failures**
   - Test with `bun run build:vercel` locally
   - Check Vercel logs for specific error messages
   - Verify all environment variables are set

4. **Native Dependencies**
   - Sharp, lightningcss handled by postinstall script
   - Never manually install platform binaries
   - Check postinstall.js runs successfully

### Emergency Build Fix Procedure

If production build fails:

1. **DON'T PANIC** - Follow this checklist:

   ```bash
   # 1. Pull latest changes
   git pull origin main

   # 2. Clean install
   rm -rf node_modules bun.lockb
   bun install

   # 3. Run full validation
   bun run validate:full

   # 4. If validation passes but Vercel fails
   # Check the specific error in Vercel logs
   # Most common: dependency in wrong section
   ```

2. **For Dependency Errors**:
   - Find the missing module in package.json
   - If in devDependencies, move to dependencies
   - Commit and push the fix

3. **For TypeScript Errors**:
   - Run `bun run typecheck`
   - Fix all errors locally
   - Test with `bun run build`

4. **For Unknown Errors**:
   - Check Vercel build logs carefully
   - Compare with local build output
   - Ensure environment variables match
