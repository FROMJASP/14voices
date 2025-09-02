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

## Payload CMS Admin Table Column Order

To change column order in Payload CMS admin tables:

1. The `defaultColumns` array in collection config only controls which columns are shown, not their order
2. The actual visual order is determined by field definition order in the collection
3. For more control, use DOM manipulation in a `beforeListTable` component (see `PagesList.tsx`)
4. Column reordering happens client-side after the table renders

## Custom Payload CMS Cell Components

When creating custom cell components for Payload admin tables:

1. **Handling Relationship Fields**:
   - Relationship fields (like `avatar`) often return just the ID in list views
   - Use `afterRead` hooks to populate the full object server-side
   - The `cellData` prop contains the field value (might be just an ID)
   - The `rowData` prop contains the entire row data

2. **Resolving Media URLs**:
   - Media fields may need manual URL resolution
   - Use virtual fields with `FieldHook` to resolve URLs server-side
   - Check for both `url` property and construct from `filename` if needed
   - For MinIO/S3: URLs should be constructed using `S3_PUBLIC_URL` environment variable

3. **Example Pattern for Avatar Display**:

   ```typescript
   // In collection hooks:
   afterRead: [
     async ({ doc, req }) => {
       if (doc?.avatar && typeof doc.avatar === 'string') {
         const media = await req.payload.findByID({
           collection: 'media',
           id: doc.avatar,
           depth: 0,
         });
         doc.avatar = media; // Replace ID with full object
       }
       return doc;
     }
   ]

   // Virtual field for resolved URL:
   {
     name: 'avatarURL',
     type: 'text',
     virtual: true,
     hooks: {
       afterRead: [resolveAvatarURL], // Custom hook to resolve URL
     },
   }
   ```

4. **Custom List Views**:
   - Use custom list components to ensure proper query depth
   - Set `depth: 2` for nested relationships
   - Example: `admin.components.views.list: './components/admin/lists/UsersList#UsersList'`

5. **Cell Component Pattern**:
   ```typescript
   // Always check multiple sources for the data
   if (cellData && typeof cellData === 'object' && cellData.url) {
     return { imageUrl: cellData.url };
   }
   if (rowData?.avatarURL && !rowData.avatarURL.includes('data:image/svg')) {
     return { imageUrl: rowData.avatarURL };
   }
   ```

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

### Troubleshooting Live Preview

If live preview stops working:

1. Ensure dev server is restarted after config changes
2. Check browser console for WebSocket connection errors
3. Verify `NEXT_PUBLIC_SERVER_URL` is set correctly in `.env.local`
4. Clear browser cache and reload admin panel
5. Ensure the preview window URL is within the iframe (check for `x-payload-live-preview` header)

## Version/Draft Management

To prevent creating too many versions during editing:

1. **Pages Collection Configuration** (`collections/Pages.ts`):
   - Autosave interval set to 5 minutes (300000ms)
   - Maximum 20 versions per document
   - Custom SaveDraftControls component for manual save control

2. **Global Configuration** (`payload.config.ts`):
   - Admin autosave interval set to 2 seconds (debounced)
   - Prevents saving on every keystroke

3. **Custom Save Controls** (`components/admin/SaveDraftControls.tsx`):
   - Visual indicator for unsaved changes
   - Toggle for auto-save on/off
   - Manual save button
   - Last saved timestamp
