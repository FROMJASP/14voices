# CLAUDE.md

## Tech Stack

- **Framework**: Next.js 15.4.5 with App Router
- **Hosting**: Vercel
- **Database**: Neon (PostgreSQL)
- **CMS**: Payload CMS 3.53.0
- **Storage**: MinIO (S3-compatible, self-hosted on a VPS running Coolify)
- **Styling**: Tailwind CSS v4
- **Animations**: Motion (Framer Motion)
- **Package Manager**: Bun (required)
- **Email**: Resend API
- **Error Tracking**: Sentry
- **Global State Management**: Zustand

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
bun run payload:generate:importmap  # Generate importMap.js (required for build)

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

1. ALWAYS think about the importMap before pushing code
2. Push to main branch
3. Vercel automatically builds and deploys
4. Database migrations run automatically via Payload

## Important Notes

- **Payload importMap**: The file `src/app/(payload)/admin/importMap.js` is auto-generated but MUST be committed to git
- **Admin panel errors**: Clear cache with `rm -rf .next` and regenerate importMap if needed
- Never change our .env.local without our permission
