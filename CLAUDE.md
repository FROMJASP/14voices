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

## Live Preview Implementation

The Payload CMS live preview is implemented with the following key components:

1. **Payload Configuration** (`payload.config.ts`):
   - Added `livePreview` configuration with the site URL
   - Added CORS configuration to allow WebSocket connections
   - Added CSRF configuration for security

2. **Page Collection** (`collections/Pages.ts`):
   - Configured `livePreview.url` to generate proper preview URLs
   - For home page, uses root URL `/` instead of `/home`

3. **Page Route** (`app/(app)/(with-global-layout)/[[...slug]]/page.tsx`):
   - Uses optional catch-all route `[[...slug]]` to handle both home and other pages
   - Detects live preview mode via `x-payload-live-preview` header
   - Fetches draft content when in preview mode

4. **PageRenderer Component** (`components/common/widgets/PageRenderer.tsx`):
   - Uses `useLivePreview` hook from `@payloadcms/live-preview-react`
   - Implements message listener for save events to refresh the page
   - For homepage, uses memoized transformation and key prop for proper updates

5. **Rich Text Fields**:
   - Hero title and description use rich text fields (`titleRichText`, `descriptionRichText`)
   - `transformHeroDataForHomepage` extracts plain text from Lexical rich text format
   - Legacy fields (`title`, `description`) are maintained for backward compatibility
