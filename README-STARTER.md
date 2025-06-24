# Next.js + Payload CMS Starter Template

A production-ready starter template for building modern web applications with Next.js 15, Payload CMS 3.0, and PostgreSQL.

## 🚀 Features

- **Next.js 15** with App Router
- **Payload CMS 3.0** (latest beta)
- **PostgreSQL** database support
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **Authentication** ready to use
- **Media management** built-in
- **SEO optimized** structure
- **Vercel-ready** deployment

## 📋 Prerequisites

- Node.js 18 or higher
- PostgreSQL database (local or cloud service like Neon, Supabase, or Vercel Postgres)
- Git

## 🛠 Quick Start

### Using this template

1. Click "Use this template" on GitHub or clone:
```bash
git clone https://github.com/yourusername/nextjs-payload-starter.git my-app
cd my-app
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Set up environment variables:
```bash
cp .env.starter-template .env.local
```

4. Update `.env.local` with your configuration:
```env
# Generate a secure secret (min 32 characters)
PAYLOAD_SECRET=your-generated-secret-here

# Your PostgreSQL connection string
POSTGRES_URL=postgresql://user:password@host:5432/database?sslmode=require

# Optional: Your app URL
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

5. Generate Payload types:
```bash
pnpm payload generate:types
```

6. Start the development server:
```bash
pnpm dev
```

7. Open [http://localhost:3000/admin](http://localhost:3000/admin) to access Payload admin

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── (app)/              # Public routes
│   │   │   ├── layout.tsx      # Root layout
│   │   │   └── page.tsx        # Homepage
│   │   ├── (payload)/          # Admin panel
│   │   │   ├── admin/          # Admin routes
│   │   │   └── layout.tsx      # Admin layout
│   │   └── api/                # API routes
│   ├── collections/            # Payload collections
│   │   ├── Users.ts           # Users collection
│   │   └── Media.ts           # Media collection
│   └── payload.config.ts       # Payload configuration
├── public/                     # Static files
├── .env.example               # Example environment variables
└── package.json               # Dependencies and scripts
```

## 🔧 Configuration

### Database

This template uses PostgreSQL. You can use any PostgreSQL provider:

- **Local**: Install PostgreSQL locally
- **Neon**: [neon.tech](https://neon.tech)
- **Supabase**: [supabase.com](https://supabase.com)
- **Vercel Postgres**: [vercel.com/storage/postgres](https://vercel.com/storage/postgres)

### Adding Collections

Create new collections in `src/collections/`:

```typescript
// src/collections/Posts.ts
import type { CollectionConfig } from 'payload'

const Posts: CollectionConfig = {
  slug: 'posts',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
    },
  ],
}

export default Posts
```

Then add to `payload.config.ts`:

```typescript
collections: [Users, Media, Posts],
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

This template works with any Node.js hosting platform that supports Next.js.

## 📝 Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm dev:turbo        # Start with Turbopack

# Production
pnpm build            # Build for production
pnpm start            # Start production server

# Payload
pnpm payload          # Payload CLI
pnpm payload generate:types    # Generate TypeScript types
pnpm payload generate:importmap # Generate import map

# Other
pnpm lint             # Run ESLint
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this template for any project.

## 🙏 Acknowledgments

- [Payload CMS](https://payloadcms.com)
- [Next.js](https://nextjs.org)
- [Vercel](https://vercel.com)

---

**Happy coding!** 🎉