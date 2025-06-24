# 14voices

A modern web application built with Next.js 15, Payload CMS 3.0, and PostgreSQL.

## Tech Stack

- **Framework**: Next.js 15.3.4 (App Router)
- **CMS**: Payload CMS 3.0 (beta)
- **Database**: PostgreSQL (via @payloadcms/db-postgres)
- **Styling**: Tailwind CSS v4
- **Authentication**: Built-in Payload auth
- **Media Storage**: Local filesystem (Sharp for image processing)
- **Animation**: Motion (Framer Motion v12)
- **Email**: Resend API
- **TypeScript**: v5 with strict mode

## Features

- ✅ Full-stack TypeScript
- ✅ Server Components & Actions
- ✅ Built-in authentication system
- ✅ Media management
- ✅ Type-safe database queries
- ✅ Responsive design ready
- ✅ SEO optimized

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (local or cloud)
- bun (recommended) or npm

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

## Project Structure

```
14voices/
├── src/
│   ├── app/
│   │   ├── (app)/          # Public-facing routes
│   │   ├── (payload)/      # Payload admin panel
│   │   └── api/            # API routes
│   ├── collections/        # Payload collections
│   └── payload.config.ts   # Payload configuration
├── public/                 # Static assets
└── package.json
```

## Environment Variables

Required environment variables:

- `PAYLOAD_SECRET` - Secret key for Payload (min 32 chars)
- `POSTGRES_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_SERVER_URL` - Public URL of your application

## Development

```bash
# Run development server
bun dev

# Build for production
bun run build

# Start production server
bun start

# Run linting
bun run lint
```

## Deployment

This project is optimized for deployment on Vercel:

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## License

MIT