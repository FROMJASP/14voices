# Self-Hosted Deployment Guide with Coolify

This guide covers deploying 14voices on your Hetzner server using Coolify with MinIO for storage.

## Prerequisites

- ✅ Hetzner server with Ubuntu 22.04 (16GB RAM)
- ✅ Coolify installed and configured
- ✅ Domain pointed to your server
- ✅ SSL certificates (handled by Coolify)

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Next.js App   │────▶│   PostgreSQL    │     │     MinIO       │
│  (14voices.com) │     │   (Database)    │     │  (S3 Storage)   │
│                 │────▶│                 │────▶│                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                                               │
        └───────────────────────────────────────────────┘
                    All managed by Coolify
```

## Step 1: Deploy MinIO with Coolify

1. **Add MinIO as a Service in Coolify**
   - Go to your Coolify dashboard
   - Click "New Resource" → "Services"
   - Search for "MinIO" and select it
   - Configure:
     ```
     Service Name: minio-14voices
     Root User: minioadmin
     Root Password: [generate-strong-password]
     ```
   - Deploy the service

2. **Create Storage Bucket**
   - Access MinIO console at `http://your-server:9001`
   - Login with your credentials
   - Create bucket: `fourteenvoices-media`
   - Set bucket policy to "Public" for read access

3. **Note the Internal URL**
   - Coolify will provide internal URL like: `http://minio-14voices:9000`
   - This is what your app will use internally

## Step 2: Deploy PostgreSQL with Coolify

1. **Add PostgreSQL as a Service**
   - Click "New Resource" → "Services"
   - Select "PostgreSQL"
   - Configure:
     ```
     Service Name: postgres-14voices
     Database: fourteenvoices
     Username: postgres
     Password: [generate-strong-password]
     ```
   - Deploy the service

2. **Note Connection Details**
   - Internal URL: `postgresql://postgres:password@postgres-14voices:5432/fourteenvoices`

## Step 3: Deploy the Application

1. **Create New Application in Coolify**
   - Click "New Resource" → "Application"
   - Choose "Docker" deployment
   - Connect your Git repository

2. **Configure Build Settings**

   ```
   Build Pack: Dockerfile
   Dockerfile Location: ./Dockerfile
   ```

3. **Set Environment Variables**

   ```env
   # Database
   DATABASE_URL=postgresql://postgres:password@postgres-14voices:5432/fourteenvoices

   # Storage (MinIO)
   S3_ENDPOINT=http://minio-14voices:9000
   S3_ACCESS_KEY=minioadmin
   S3_SECRET_KEY=[your-minio-password]
   S3_BUCKET=fourteenvoices-media
   S3_REGION=us-east-1
   S3_PUBLIC_URL=https://minio.14voices.com

   # Application
   NEXT_PUBLIC_SERVER_URL=https://14voices.com
   NODE_ENV=production

   # Payload CMS
   PAYLOAD_SECRET=[generate-64-char-secret]

   # Security
   CSRF_SECRET=[generate-different-64-char-secret]

   # Email (Resend)
   RESEND_API_KEY=re_xxxxxxxxxxxx

   # Admin seed (optional, for first deploy)
   ADMIN_EMAIL=admin@14voices.com
   ADMIN_PASSWORD=[generate-strong-password]
   ```

4. **Configure Domains**
   - Primary domain: `14voices.com`
   - MinIO domain: `minio.14voices.com` (for public file access)

5. **Deploy**
   - Click "Deploy"
   - Coolify will build and deploy your application

## Step 4: Post-Deployment Setup

1. **Run Database Migrations**

   ```bash
   # SSH into your server
   ssh root@your-server

   # Access the container
   docker exec -it [container-name] sh

   # Run migrations
   bun payload migrate
   ```

2. **Seed Initial Data (Optional)**

   ```bash
   # In the container
   bun run seed
   ```

3. **Configure MinIO Public Access**
   - Set up reverse proxy for MinIO through Coolify
   - Configure domain: `minio.14voices.com`
   - This allows public access to uploaded files

## Environment Variables Reference

### Required Variables

| Variable         | Description                           | Example                               |
| ---------------- | ------------------------------------- | ------------------------------------- |
| `DATABASE_URL`   | PostgreSQL connection string          | `postgresql://user:pass@host:5432/db` |
| `PAYLOAD_SECRET` | Secret for Payload CMS (min 32 chars) | Generate with `openssl rand -hex 32`  |
| `RESEND_API_KEY` | Resend API key for emails             | `re_xxxxxxxxxxxx`                     |
| `S3_ENDPOINT`    | MinIO endpoint URL                    | `http://minio-service:9000`           |
| `S3_ACCESS_KEY`  | MinIO access key                      | `minioadmin`                          |
| `S3_SECRET_KEY`  | MinIO secret key                      | Your secure password                  |
| `S3_BUCKET`      | MinIO bucket name                     | `fourteenvoices-media`                |

### Optional Variables

| Variable        | Description                    | Default                      |
| --------------- | ------------------------------ | ---------------------------- |
| `S3_REGION`     | S3 region (MinIO ignores this) | `us-east-1`                  |
| `S3_PUBLIC_URL` | Public URL for file access     | Uses S3_ENDPOINT             |
| `CSRF_SECRET`   | CSRF protection secret         | Falls back to PAYLOAD_SECRET |
| `REDIS_URL`     | Redis for caching (optional)   | In-memory fallback           |

## Monitoring & Maintenance

### Health Checks

The application provides health check endpoints:

- `/api/health` - Overall application health
- `/api/health/cache` - Cache system status
- `/api/health/email-system` - Email system status

### Logs

View logs in Coolify:

1. Go to your application
2. Click "Logs" tab
3. Filter by container if needed

### Backups

1. **Database Backups**
   - Configure automatic backups in Coolify
   - Or use pg_dump manually:
     ```bash
     docker exec postgres-14voices pg_dump -U postgres fourteenvoices > backup.sql
     ```

2. **MinIO Backups**
   - Use MinIO client (mc) to sync to another location
   - Or configure replication to another MinIO instance

### Updates

1. **Application Updates**
   - Push changes to your Git repository
   - Coolify will automatically rebuild and deploy

2. **Dependency Updates**
   - Update packages locally: `bun update`
   - Test thoroughly
   - Commit and push

## Troubleshooting

### Build Failures with Database Connection Errors

**Problem**: Build fails with `ECONNREFUSED` when trying to connect to database during static page generation.

**Solution**: The application uses a fake database URL during build to prevent connection attempts:

- The Dockerfile sets `DATABASE_URL=postgresql://fake:fake@fake:5432/fake` during build
- Components check for this fake URL and return default values
- Real database connection only happens at runtime

**Prevention**:

- All pages accessing database must have `export const dynamic = 'force-dynamic'`
- Metadata and layout functions must check for fake database URL
- Never remove the fake database URL from Dockerfile

### Application Won't Start

1. Check environment variables are set correctly
2. Verify database connection:
   ```bash
   docker exec [container] bun payload migrate:status
   ```
3. Check logs for specific errors

### Storage Issues

1. Verify MinIO is running:
   ```bash
   curl http://minio-service:9000/minio/health/live
   ```
2. Check bucket exists and has correct permissions
3. Verify S3_ENDPOINT doesn't have trailing slash

### Performance Optimization

1. **Enable Redis** (optional)
   - Deploy Redis service in Coolify
   - Set `REDIS_URL` environment variable
2. **Configure CDN** (optional)
   - Use Cloudflare for static assets
   - Point S3_PUBLIC_URL to CDN endpoint

3. **Scale Horizontally**
   - Coolify supports multiple instances
   - Ensure session sharing via Redis

## Security Checklist

- [ ] Strong passwords for all services
- [ ] SSL enabled on all domains
- [ ] Environment variables properly secured
- [ ] Regular backups configured
- [ ] Monitoring alerts set up
- [ ] Rate limiting enabled (built-in)
- [ ] CORS properly configured

## Support

For issues specific to:

- **Coolify**: Check Coolify documentation
- **Application**: Check application logs
- **MinIO**: Access MinIO console for diagnostics
- **Database**: Use `pg_stat_activity` for connection issues
