# CLAUDE.md

## Recent Updates (January 2025)

### Navigation & Hero Section Redesign

The navbar and hero section have been completely redesigned to match the mockup at `/public/mockups/navbar-hero-redesign/`:

**Changes Made**:

1. **InfoNavbar Component**
   - New top information bar above main navigation
   - Uses CSS variables for all colors (theme-aware)
   - Removed dividers, uses proper spacing (40px gap)
   - Located at `src/components/common/layout/header/info-navbar/`

2. **Navigation Component Updates**
   - Removed "Mijn omgeving" button
   - Changed Login from button to minimal text link
   - Fixed duplicate mobile menu elements on desktop
   - All styling uses CSS variables for proper dark mode support

3. **Hero Section Redesign**
   - Removed old animated SVG background
   - Removed rotating word effect component
   - Updated to clean, modern design with proper font weights (800 for titles)
   - Fixed button padding (10px 20px instead of 14px 28px)
   - All text uses theme CSS variables

4. **Font Configuration**
   - Updated Bricolage Grotesque to include weight 800
   - Fixed font weight issues in hero title

**Component Structure**:

```
src/components/
├── common/layout/header/
│   ├── info-navbar/      # Info navbar component (top bar)
│   │   ├── InfoNavbar.tsx
│   │   ├── InfoNavbar.types.ts
│   │   └── index.ts
│   ├── navigation/       # Main navigation components
│   │   ├── Navigation.tsx
│   │   ├── Navigation.types.ts
│   │   ├── NavigationItem.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── MobileMenu.tsx
│   │   └── index.ts
│   ├── logo/            # Logo component
│   │   ├── Logo.tsx
│   │   ├── Logo.types.ts
│   │   └── index.ts
│   ├── Header.tsx       # Combines InfoNavbar + Navigation
│   └── index.ts
└── features/homepage/
    ├── HeroSection.tsx   # Homepage hero section
    ├── HomepageContainer.tsx
    └── index.ts
```

**Theme Variables Used**:

- `--text-primary`: Main text color
- `--text-secondary`: Secondary/muted text
- `--background`: Background color
- `--surface`: Surface color for cards/dropdowns
- `--border`: Border color
- `--primary`: Primary accent color

All components now properly support dark mode through CSS variables instead of hardcoded colors.

**Removed Components**:

- `TopBar` - Redundant with InfoNavbar
- `AnnouncementBar` - Old animated banner component not in new design
- `BannerPreview` - Admin component for AnnouncementBar

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

   **Latest Fix (Aug 2025)**: Fixed dotenv import in reset-admin-access.ts with environment check

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

**Test Files in Production Build**

- Problem: Test files (`*.test.ts`, `*.spec.ts`) being included in production build
- Error: `Cannot find module '@testing-library/react'` or similar test dependencies
- Solution: Test files are now excluded via:
  - `tsconfig.json` - Updated exclude patterns
  - `tsconfig.typecheck.json` - Dedicated config for type checking
  - `next.config.ts` - Webpack IgnorePlugin for test files
- Prevention: Test dependencies MUST stay in devDependencies

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
bun run validate:pre-push # Comprehensive pre-push validation (runs automatically)
bun run validate:deps    # Check dependency categorization

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
- **Storage**: MinIO (S3-compatible) for media/documents
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
│   │   │   └── header/   # Header with navigation & info navbar
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
│   └── storage/         # MinIO storage utilities
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
- **Sentry Configuration**: `.sentryclirc` must use environment variable: `token=${SENTRY_AUTH_TOKEN}`
- **Admin Scripts**: Never log passwords to console, even in utility scripts
- **Environment Examples**: Use placeholders like `<generate-strong-password>` in `.env.example`
- **Git Security**: Add sensitive config files (`.sentryclirc`) to `.gitignore`
- **CSRF Protection**: Use dedicated `CSRF_SECRET` environment variable, separate from `PAYLOAD_SECRET`
- **Session Security**: Sessions configured with `sameSite: 'strict'` for maximum protection
- **CSP Note**: 'unsafe-inline' is required for Next.js compatibility - see SECURITY.md for details
- **Security Headers**: Comprehensive headers including HSTS, CORP, COOP, and COEP

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
3. Common import issue detection (including dynamic imports)
4. Full production build test

**If any check fails, the push will be blocked** to prevent breaking production.

**Enhanced Validation System** (Aug 2025):

- `bun run validate:pre-push` - Comprehensive validation including:
  - TypeScript compilation check
  - Dependency validation with dynamic import detection
  - Common import issue detection
  - Full production build test
  - Clear error reporting with fix suggestions
- `validate-dependencies.js` now detects:
  - Dynamic imports (e.g., `await import('dotenv')`)
  - Unguarded dev dependency imports
  - CSS imports that need dependencies

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

## Self-Hosted Deployment with Coolify

### Critical Build Configuration

**Database Connection During Build**: Next.js attempts to connect to the database during static page generation, which fails in Docker builds.

**Solution**: The Dockerfile uses a fake database URL during build:

```dockerfile
DATABASE_URL=postgresql://fake:fake@fake:5432/fake
```

**Required Code Patterns**:

1. **Pages with Database Access**:

   ```typescript
   export const dynamic = 'force-dynamic';
   ```

2. **Metadata Functions**:

   ```typescript
   export async function generateMetadata() {
     // Check for fake database URL during build
     if (process.env.DATABASE_URL?.includes('fake:fake@fake')) {
       return {
         title: 'Default Title',
         description: 'Default description',
       };
     }
     // ... normal database queries
   }
   ```

3. **Layout Components**:
   ```typescript
   // In getInfoNavbarData or similar functions
   if (process.env.DATABASE_URL?.includes('fake:fake@fake')) {
     return defaultData;
   }
   ```

**Never Remove**: The fake database URL in Dockerfile is critical - removing it will cause build failures.

### Storage Configuration

- **MinIO Storage**: The application uses MinIO (S3-compatible) for file storage
- **Environment Variables**: See `docs/DEPLOYMENT_GUIDE.md` for complete setup
- **Automatic Migration**: Single migration script handles all database setup

## Simplified Deployment Process

### Single Migration Approach

**Previous Issues**:

- 22+ migration scripts causing confusion
- Missing Payload CMS relationship tables
- Complex dependency management

**New Solution**:

- **Single Migration Script**: `scripts/payload-migrate.js` handles all database setup
- **Automatic Migrations**: Run automatically on first deployment
- **Self-Hosted Ready**: No cloud provider dependencies
- **Standard PostgreSQL**: Works with any PostgreSQL database

### Database Setup

The migration process is now fully automated:

1. **Automatic on Deploy**: Docker entrypoint runs migrations
2. **Idempotent**: Safe to run multiple times
3. **Complete**: Creates all tables, indexes, and relationships
4. **Seeding**: Optional admin user and sample data

```bash
# Manual migration (if needed)
node scripts/payload-migrate.js

# Or via Payload CLI
bun payload migrate
```

### Environment Variables

**Required for Deployment**:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Payload CMS
PAYLOAD_SECRET=<32+ character secret>
NEXT_PUBLIC_SERVER_URL=https://yourdomain.com

# Email
RESEND_API_KEY=re_xxxxxxxxxxxx

# Storage (MinIO/S3)
S3_ENDPOINT=http://minio:9000
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
S3_BUCKET=your-bucket-name
S3_REGION=us-east-1

# Admin (for initial setup)
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=<strong-password>
```

## MCP Server Instructions

The following MCP servers are available and should be used when appropriate:

### coolify

Use this server to interact with Coolify instances for deployment and infrastructure management. This server allows you to:

- List and manage servers, projects, applications, services, and databases
- Deploy applications and monitor deployment status
- Manage environment variables and configurations
- Create and update resources in Coolify
- Handle self-hosted deployments

When working with deployment tasks, infrastructure management, or self-hosted deployment configurations, use the Coolify MCP tools to interact with the Coolify instance.
