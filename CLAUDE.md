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
- **CMS**: Payload CMS 3.49.1 - Headless CMS with PostgreSQL
- **Database**: PostgreSQL (via @payloadcms/db-postgres)
- **Styling**: Tailwind CSS v4
- **Package Manager**: Bun (required - npm/yarn will not work)
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Email**: Resend API with custom email marketing system
- **Storage**: Vercel Blob for media/documents

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
│   └── storage/         # Blob storage utilities
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
