# CLAUDE.md - 14voices Development Guide

## Quick Reference

### ⚠️ CRITICAL: Before Deployment

1. **ALWAYS run** `bun run payload:generate:importmap` before pushing
2. **COMMIT** the generated `src/app/(payload)/admin/importMap.js` file
3. **NEVER** change `.env.local` without permission

### Tech Stack

**Next.js 15.5.3** | **Payload CMS 3.55.1** | **Neon DB** | **MinIO S3** | **Tailwind v4** | **Motion** | **Bun** | **Zustand**

### Essential Commands

```bash
bun dev                              # Start development
bun run build                        # Build for production
bun payload generate:types           # Generate TypeScript types
bun run payload:generate:importmap   # Generate importMap.js (REQUIRED!)
bun run typecheck                    # TypeScript checking
bun run lint                         # ESLint
```

### Project Structure

```
src/
├── access/        # Access control functions
├── app/           # Next.js App Router
├── collections/   # Payload CMS collections
├── components/    # React components
├── config/        # Configuration files
├── contexts/      # React contexts
├── domains/       # Domain logic (DDD)
├── fields/        # Lexical editor configs
├── globals/       # Payload global configs
├── hooks/         # Custom hooks
├── i18n/          # Internationalization
├── lib/           # Utilities & helpers
├── middleware/    # Express middleware
├── migrations/    # Database migrations
├── providers/     # React providers
├── scripts/       # Utility scripts
├── seed/          # Database seeders
├── store/         # Legacy store files
├── stores/        # Zustand stores
├── test/          # Test utilities
├── translations/  # Language files
├── types/         # TypeScript types
└── utilities/     # Helper functions
```

## Common Issues & Solutions

### 1. Admin Panel Build Errors

**Problem**: Build fails with admin panel errors  
**Solution**:

```bash
rm -rf .next
bun run payload:generate:importmap
git add src/app/(payload)/admin/importMap.js
git commit -m "Update importMap"
```

### 2. Dark Mode Implementation

**Problem**: Components show light mode in dark mode  
**Solution**:

- ✅ Use theme utilities: `bg-background text-foreground`
- ❌ Never hardcode: `style={{ backgroundColor: 'var(--gray-50)' }}`
- ✅ Add to layout wrappers: `<div className="bg-background text-foreground">`

### 3. Hiding Collections from Sidebar

**Problem**: Collection shows 404 when accessed via tabs  
**Solution**: Hide via CSS, not `hidden: true`

```typescript
// In NavIconsCSS.tsx:
css += `
  nav a[href="/admin/collections/categories"] {
    display: none !important;
  }
`;
```

### 4. Live Preview Not Updating

**Problem**: Homepage preview doesn't refresh  
**Solution**:

```typescript
// Use memoized data + key prop:
const heroData = useMemo(() => transformHeroDataForHomepage(page), [page.hero]);
return <Hero key={`hero-${page.id}-${page.updatedAt}`} {...heroData} />;
```

## Adding New Page Blocks

### 1. Create Block Component

```typescript
// src/components/blocks/YourBlock.tsx
'use client';
export function YourBlock(props: YourBlockType) {
  // Handle iframe context for live preview
  const isInIframe = typeof window !== 'undefined' && window.parent !== window;
  return <div>...</div>;
}
```

### 2. Define Block Schema

```typescript
// src/collections/Pages/blocks/index.ts
export const YourBlock: Block = {
  slug: 'your-block',
  imageURL: '/admin/block-previews/your-block.svg',
  fields: [
    // Add defaultValue for better UX
    { name: 'title', type: 'text', defaultValue: 'Example Title' },
  ],
};
```

### 3. Add to PageRenderer

```typescript
// src/components/common/widgets/PageRenderer.tsx
case 'your-block':
  return <YourBlock key={`block-${index}`} {...block} />;
```

## Environment Variables

See `.env.example` for required variables. Key ones:

- `DATABASE_URL` - Neon PostgreSQL
- `PAYLOAD_SECRET` - CMS secret
- `CSRF_SECRET` - Security token
- `S3_*` - MinIO configuration

## Security

### Content Security Policy (CSP)

Nonce-based CSP for enhanced security:

- **Middleware**: Generates unique nonce per request
- **Scripts**: All inline scripts must include the nonce
- **Configuration**: CSP headers set in middleware with `strict-dynamic`
- **Usage**: Access nonce via `useNonce()` hook or pass as prop

## Notes

- **Payload importMap**: Auto-generated but MUST be committed
- **Clear cache**: `rm -rf .next` if admin panel issues
- **Blog page**: Should start with empty layout (`layout: []`)
- **Component imports**: Use exact casing (Badge.tsx not badge.tsx)
