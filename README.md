# 14voices

## Tech Stack

- **Framework**: Next.js 15.4.5 (App Router)
- **CMS**: Payload CMS 3.50.0
- **Database**: PostgreSQL (via @payloadcms/db-postgres)
- **Styling**: Tailwind CSS v4
- **Authentication**: Built-in Payload auth
- **Media Storage**: Vercel Blob
- **Animation**: Motion (Framer Motion v12)
- **Email**: Resend API with custom email marketing system
- **TypeScript**: v5 with strict mode
- **Error Monitoring**: Sentry with Discord alerts
- **Testing**: Playwright (E2E) & Vitest (Unit)
- **Code Quality**: ESLint, Prettier, Husky
- **Package Manager**: Bun (required - npm/yarn will not work)
- **Cache & Rate Limiting**: Redis (optional, with in-memory fallback)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or cloud)
- Bun package manager (required, not npm/yarn)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/14voices.git
cd 14voices
```

2. Install dependencies:

```bash
bun install
```

**Note**: The postinstall script automatically installs platform-specific dependencies (Sharp and Tailwind CSS oxide) for Linux/Vercel deployments.

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Update `.env.local` with your database credentials and Payload secret.

5. Run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Key Features

- **Voice Talent Management**: Browse and filter professional voice actors
- **Production Ordering**: Custom order flow for different production types
- **Email Marketing**: Built-in email campaign system with audience management
- **Price Calculator**: Dynamic pricing based on production requirements
- **Admin Dashboard**: Full CMS control via Payload admin panel
- **Dark Mode**: Full theme support with CSS variables
- **Responsive Design**: Mobile-first approach with Tailwind CSS v4
- **Performance**: Redis caching, image optimization, lazy loading
- **Security**: Rate limiting, input validation, CSP headers

## Project Structure

```
14voices/
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (app)/          # Public-facing routes
│   │   ├── (payload)/      # Payload admin panel
│   │   └── api/            # API routes
│   ├── collections/        # Payload CMS collections
│   ├── components/         # React components
│   │   ├── admin/          # Payload admin customizations
│   │   ├── common/         # Shared, reusable components
│   │   │   ├── layout/     # Layout components
│   │   │   ├── ui/         # Basic UI components
│   │   │   └── widgets/    # Complex reusable widgets
│   │   ├── domains/        # Domain-specific components
│   │   └── features/       # Feature-specific components
│   ├── domains/            # Domain-driven business logic
│   │   ├── email/          # Email marketing domain
│   │   ├── booking/        # Bookings & scripts domain
│   │   ├── billing/        # Invoicing & payments domain
│   │   └── voiceover/      # Voice talent domain
│   ├── config/             # Centralized configuration
│   ├── contexts/           # React contexts
│   ├── fields/             # Payload field configurations
│   ├── globals/            # Payload globals
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   │   ├── cache/          # Redis caching
│   │   ├── email/          # Email utilities
│   │   └── storage/        # Blob storage utilities
│   ├── seed/               # Database seeding scripts
│   ├── types/              # TypeScript type definitions
│   ├── utilities/          # Helper utilities
│   └── payload.config.ts   # Payload configuration
├── docs/                   # Documentation
│   └── architecture/       # Architecture documentation & ADRs
├── public/                 # Static assets
└── package.json
```

## Architecture

This project follows Domain-Driven Design (DDD) principles. For detailed architecture documentation, see:

- [Architecture Overview](./docs/architecture/README.md)
- [Architecture Decision Records](./docs/architecture/adr/)

## Environment Variables

Required environment variables:

- `PAYLOAD_SECRET` - Secret key for Payload (min 32 chars)
- `POSTGRES_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_SERVER_URL` - Public URL of your application

## Development

### Core Commands

```bash
# Development server
bun dev                    # Standard Next.js dev server
bun dev:turbo             # With Turbopack for faster builds

# Build & production
bun run build             # Build for production
bun run build:vercel      # Build with import map generation for Vercel
bun start                 # Start production server

# Code quality
bun run lint              # Run ESLint
bun run format            # Format code with Prettier
bun run format:check      # Check formatting
bun run typecheck         # TypeScript type checking

# Testing
bun test                  # Run unit tests with Vitest
bun test:watch           # Run tests in watch mode
bun test:coverage        # Generate coverage report
bun test:e2e             # Run Playwright E2E tests
bun test:e2e:ui          # Run Playwright tests with UI

# Payload CMS
bun payload generate:types      # Generate TypeScript types after schema changes
bun payload generate:importmap  # Generate import map after adding custom components
bun payload migrate            # Run database migrations

# Database
bun run seed              # Seed database with sample data
```
