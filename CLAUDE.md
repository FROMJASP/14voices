# CLAUDE.md

## Recent Updates (January 2025)

### Successful MinIO Storage Integration

Transitioned from complex self-hosting to a hybrid approach. Key lessons learned:

1. **Admin Panel Webpack Errors**: Test data referencing non-existent files causes webpack module errors. Always clean database when switching storage.

2. **Import Map**: Payload CMS requires S3ClientUploadHandler in importMap when using S3 storage.

3. **MinIO Config**: Use S3 API URL (not console), API keys (not admin credentials), bucket must exist.

4. **Cache Issues**: Clear `.next` and `node_modules/.cache` when facing persistent webpack errors.

## Tech Stack

- **Framework**: Next.js 15.4.5 with App Router
- **Hosting**: Vercel
- **Database**: Neon (PostgreSQL)
- **CMS**: Payload CMS 3.53.0
- **Storage**: MinIO (S3-compatible, self-hosted)
- **Styling**: Tailwind CSS v4
- **Animations**: Motion (Framer Motion)
- **Package Manager**: Bun (required)
- **Email**: Resend API
- **Error Tracking**: Sentry

## Development Commands

```bash
# Install dependencies
bun install

# Development
bun dev

# Build for production
bun run build

# Start production server
bun start

# Payload CMS
bun payload generate:types  # Generate TypeScript types
bun payload migrate         # Run database migrations

# Testing & Linting
bun test                   # Run tests
bun run lint              # Run ESLint
bun run format            # Format with Prettier
bun run typecheck         # TypeScript checking
```

## Environment Variables

See `.env.example` for required environment variables.

## Project Structure

```
src/
├── app/                # Next.js App Router
├── collections/        # Payload CMS collections
├── components/         # React components
├── domains/           # Domain logic (DDD)
├── config/            # Configuration
├── lib/               # Utilities
├── hooks/             # React hooks
└── types/             # TypeScript types
```

## Deployment

1. Push to main branch
2. Vercel automatically builds and deploys
3. Database migrations run automatically via Payload

## Key Patterns

- Use Server Components by default
- Domain-Driven Design for business logic
- Type safety with generated Payload types
- Validate inputs with Zod schemas
