# Architecture Documentation

## Overview

This document describes the architecture of the 14voices platform, a voice-over marketplace built with Next.js 15, Payload CMS 3, and PostgreSQL.

## Architecture Principles

1. **Domain-Driven Design (DDD)** - Business logic is organized into domains
2. **Clean Architecture** - Clear separation between layers
3. **Type Safety** - Full TypeScript coverage
4. **Performance First** - Optimized for speed and scalability
5. **Security by Design** - Security considerations in every layer

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                    │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Pages     │  │  Components  │  │     Hooks        │  │
│  │  (App Dir)  │  │  (Features)  │  │   (Business)     │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Layer (Next.js)                     │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  API Routes │  │  Middleware  │  │   Validation     │  │
│  │  (Handlers) │  │    (Auth)    │  │   (Schemas)      │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Domain Layer (DDD)                        │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Email     │  │   Booking    │  │    Billing       │  │
│  ├─────────────┤  ├──────────────┤  ├──────────────────┤  │
│  │  Services   │  │   Services   │  │    Services      │  │
│  │ Repository  │  │  Repository  │  │   Repository     │  │
│  │   Types     │  │    Types     │  │     Types        │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Data Layer (Payload CMS)                   │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Collections │  │   Globals    │  │     Media        │  │
│  │   (Data)    │  │  (Settings)  │  │   (Storage)      │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Infrastructure (PostgreSQL, Redis)              │
└─────────────────────────────────────────────────────────────┘
```

## Domain Structure

Each domain follows a consistent structure:

```
src/domains/{domain}/
├── types/          # Domain-specific TypeScript types
├── services/       # Business logic and orchestration
├── repositories/   # Data access layer
└── index.ts        # Public API exports
```

### Core Domains

1. **Email Domain** - Email marketing, templates, campaigns
2. **Booking Domain** - Bookings, scripts, scheduling
3. **Billing Domain** - Invoices, payments, financial reporting
4. **Voiceover Domain** - Voice talent profiles, demos, search

## Key Design Decisions

See the [Architecture Decision Records (ADRs)](./adr) for detailed documentation of significant architectural decisions.

## Technology Stack

- **Framework**: Next.js 15.4.5 (App Router)
- **CMS**: Payload CMS 3.49.1
- **Database**: PostgreSQL (self-hosted or managed)
- **ORM**: Drizzle (via Payload)
- **Styling**: Tailwind CSS v4
- **Email**: Resend API
- **Storage**: MinIO (S3-compatible)
- **Cache**: Redis (optional, with in-memory fallback)
- **Monitoring**: Sentry + OpenTelemetry

## Security Architecture

- JWT-based authentication
- Role-based access control (RBAC)
- Input validation with Zod
- SQL injection prevention via Drizzle ORM
- XSS protection via React
- CSRF protection via SameSite cookies
- Rate limiting on API endpoints
- Security headers via middleware

## Performance Optimizations

- Server Components by default
- Dynamic imports for heavy components
- Image optimization with Next.js Image
- Redis caching for frequently accessed data
- Database query optimization
- Bundle size optimization
- Lazy loading of routes

## Deployment Architecture

- **Hosting**: Self-hosted (Coolify/Docker)
- **Database**: PostgreSQL (any provider)
- **Cache**: Redis (optional, with in-memory fallback)
- **Storage**: MinIO (S3-compatible)
- **Email**: Resend
- **CDN**: Optional (Cloudflare, etc.)

## Development Guidelines

1. Follow Domain-Driven Design principles
2. Keep business logic in domain services
3. Use repositories for data access
4. Validate input at API boundaries
5. Handle errors gracefully
6. Write tests for critical paths
7. Document significant decisions in ADRs
