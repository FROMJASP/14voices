# 14voices Deployment Guide

## Overview

This guide covers deploying 14voices in a simplified, self-hosted environment using standard tools:

- **Database**: PostgreSQL (any provider or self-hosted)
- **Storage**: MinIO (S3-compatible, self-hosted)
- **Deployment**: Docker with Coolify or similar platform
- **Package Manager**: Bun (local development) / npm (production)

## Quick Start

### Prerequisites

- Ubuntu server (16GB RAM recommended)
- Docker and Docker Compose
- Domain name pointed to your server
- SSL certificates (handled automatically by Coolify)

### 1. Infrastructure Setup

#### PostgreSQL Database

**Option A: Coolify Service**

```bash
# In Coolify dashboard:
# New Resource → Services → PostgreSQL
Service Name: postgres-14voices
Database: fourteenvoices
Username: postgres
Password: [generate-strong-password]
```

**Option B: Managed PostgreSQL**

```bash
# Any PostgreSQL provider works:
# - DigitalOcean Managed Database
# - AWS RDS
# - Hetzner Database
# - Self-hosted PostgreSQL
```

#### MinIO Storage

**Setup MinIO via Coolify**:

```bash
# In Coolify dashboard:
# New Resource → Services → MinIO
Service Name: minio-14voices
Root User: minioadmin
Root Password: [generate-strong-password]
```

**Create Storage Bucket**:

1. Access MinIO console at `http://your-server:9001`
2. Login with credentials
3. Create bucket: `fourteenvoices-media`
4. Set bucket policy to "Public" for read access

### 2. Application Deployment

#### Deploy with Coolify

1. **Create Application**
   - New Resource → Application
   - Connect Git repository
   - Choose Docker deployment

2. **Environment Variables**

   ```env
   # Database
   DATABASE_URL=postgresql://postgres:password@postgres-14voices:5432/fourteenvoices

   # Payload CMS
   PAYLOAD_SECRET=<generate-with-openssl-rand-hex-32>
   NEXT_PUBLIC_SERVER_URL=https://14voices.com

   # Storage (MinIO)
   S3_ENDPOINT=http://minio-14voices:9000
   S3_ACCESS_KEY=minioadmin
   S3_SECRET_KEY=your-minio-password
   S3_BUCKET=fourteenvoices-media
   S3_REGION=us-east-1
   S3_PUBLIC_URL=https://minio.14voices.com

   # Email
   RESEND_API_KEY=re_xxxxxxxxxxxx

   # Security
   CSRF_SECRET=<generate-different-64-char-secret>

   # Admin Setup (optional)
   ADMIN_EMAIL=admin@14voices.com
   ADMIN_PASSWORD=<generate-strong-password>

   # Production
   NODE_ENV=production
   ```

3. **Domain Configuration**
   - Primary: `14voices.com`
   - MinIO: `minio.14voices.com` (for public file access)

4. **Deploy**
   - Click "Deploy"
   - Monitor logs for migration progress

### 3. Automatic Setup Process

The Docker container automatically handles setup on first deployment:

```
🚀 Starting 14voices application...
Waiting for database to be ready...
✅ Database connection successful
🔄 Starting database migration...
📦 Attempting migration via Payload initialization...
✅ Migration completed successfully
🌱 Running seed data...
✅ Seed data completed successfully
🎉 Database initialization completed!
🎯 Starting application...
```

## Environment Variables Reference

### Required Variables

| Variable         | Description                    | Example                               |
| ---------------- | ------------------------------ | ------------------------------------- |
| `DATABASE_URL`   | PostgreSQL connection string   | `postgresql://user:pass@host:5432/db` |
| `PAYLOAD_SECRET` | Payload CMS secret (32+ chars) | Generate with `openssl rand -hex 32`  |
| `RESEND_API_KEY` | Email service API key          | `re_xxxxxxxxxxxx`                     |
| `S3_ENDPOINT`    | MinIO/S3 endpoint              | `http://minio-service:9000`           |
| `S3_ACCESS_KEY`  | Storage access key             | `minioadmin`                          |
| `S3_SECRET_KEY`  | Storage secret key             | Your secure password                  |
| `S3_BUCKET`      | Storage bucket name            | `fourteenvoices-media`                |

### Optional Variables

| Variable         | Description            | Default                      |
| ---------------- | ---------------------- | ---------------------------- |
| `S3_REGION`      | S3 region              | `us-east-1`                  |
| `S3_PUBLIC_URL`  | Public URL for files   | Uses S3_ENDPOINT             |
| `CSRF_SECRET`    | CSRF protection secret | Falls back to PAYLOAD_SECRET |
| `REDIS_URL`      | Redis for caching      | In-memory fallback           |
| `ADMIN_EMAIL`    | Initial admin email    | Manual setup required        |
| `ADMIN_PASSWORD` | Initial admin password | Manual setup required        |

## Database Migration

### Automatic Migration

The deployment automatically:

1. Waits for database to be ready
2. Runs single migration script (`scripts/payload-migrate.js`)
3. Creates all required tables and relationships
4. Sets up proper indexes
5. Seeds initial data if admin credentials provided

### Manual Migration (if needed)

```bash
# SSH into server
ssh root@your-server

# Access container
docker exec -it [container-name] sh

# Run migration manually
node scripts/payload-migrate.js

# Or use Payload CLI
bun payload migrate

# Check migration status
bun payload migrate:status

# Optional: Seed sample data
bun run seed
```

### Migration Creates

- All Payload CMS core tables
- User management tables
- Media and file upload tables
- Voiceover and content tables
- Email marketing tables
- Relationship tables (voiceovers_style_tags, etc.)
- Proper indexes and constraints

## Storage Configuration

### MinIO Setup

MinIO provides S3-compatible storage for:

- User uploaded media files
- Script documents
- Generated invoices
- Admin uploads

**Internal vs Public Access**:

- **Internal**: `S3_ENDPOINT=http://minio-service:9000` (app to MinIO)
- **Public**: `S3_PUBLIC_URL=https://minio.14voices.com` (users accessing files)

### File Security

The application includes comprehensive file security:

- Virus scanning for uploads
- File type validation
- Size limits enforcement
- Secure filename generation
- Access control via Payload CMS

## Performance Optimization

### Redis Caching (Optional)

Add Redis for improved performance:

```bash
# Deploy Redis via Coolify
# Set environment variable:
REDIS_URL=redis://redis-service:6379
```

**Benefits**:

- Distributed rate limiting
- Page caching
- Session storage
- API response caching

### CDN Integration (Optional)

```bash
# Use Cloudflare or similar CDN
# Point S3_PUBLIC_URL to CDN endpoint:
S3_PUBLIC_URL=https://cdn.14voices.com
```

## Security Configuration

### Built-in Security Features

- Rate limiting (Redis-backed or in-memory)
- Content Security Policy (CSP)
- CSRF protection
- File upload security
- SQL injection protection
- XSS protection

### Required Security Setup

1. **Strong Passwords**: All service passwords must be strong
2. **SSL Certificates**: Coolify handles automatic SSL
3. **Environment Variables**: Secure all secrets
4. **Regular Backups**: Database and file storage
5. **Updates**: Keep dependencies updated

## Monitoring & Maintenance

### Health Checks

The application provides health endpoints:

- `/api/health` - Overall application health
- `/api/health/cache` - Cache system status
- `/api/health/email-system` - Email system status
- `/api/health/performance` - Performance metrics

### Logging

Monitor application logs via Coolify:

1. Go to application dashboard
2. Click "Logs" tab
3. Filter by service if needed

### Backups

**Database Backups**:

```bash
# Manual backup
docker exec postgres-service pg_dump -U postgres fourteenvoices > backup.sql

# Automated backups via Coolify
# Configure in database service settings
```

**Storage Backups**:

```bash
# Use MinIO client for backups
mc mirror minio-service/fourteenvoices-media backup-location/
```

## Troubleshooting

### Common Issues

**❌ Database Connection Errors**

```bash
# Check DATABASE_URL format
# Verify PostgreSQL service is running
# Test connection: docker exec container psql $DATABASE_URL
```

**❌ Storage Upload Errors**

```bash
# Verify MinIO is running
# Check S3_ENDPOINT doesn't have trailing slash
# Ensure bucket exists and has correct permissions
```

**❌ Migration Failures**

```bash
# Check database permissions
# Run migration manually: node scripts/payload-migrate.js
# Verify no table conflicts exist
```

**❌ 404 Errors After Deployment**

```bash
# Database is likely empty
# Run: bun payload migrate
# Optional: bun run seed
```

### Build Issues

**Fake Database URL During Build**:
The Dockerfile uses `DATABASE_URL=postgresql://fake:fake@fake:5432/fake` during build to prevent connection attempts. Never remove this - it's critical for Docker builds.

**TypeScript Compilation**:

```bash
# Test locally before deploying
bun run typecheck
bun run build
```

### Performance Issues

1. **Enable Redis**: Add `REDIS_URL` for caching
2. **Database Optimization**: Monitor slow queries
3. **CDN**: Use CDN for static assets
4. **Scaling**: Coolify supports horizontal scaling

## Production Checklist

- [ ] Strong passwords for all services
- [ ] SSL certificates enabled
- [ ] Environment variables secured
- [ ] Database backups configured
- [ ] Storage backups configured
- [ ] Monitoring alerts set up
- [ ] Health checks working
- [ ] Admin user created
- [ ] Email delivery working
- [ ] File uploads working
- [ ] Performance monitoring enabled

## Migration from Cloud Providers

### From Vercel + Neon

1. **Export Data**: `pg_dump your-neon-connection-string > backup.sql`
2. **Deploy Infrastructure**: PostgreSQL + MinIO
3. **Import Data**: `psql $DATABASE_URL < backup.sql`
4. **Update Environment**: Switch to new service URLs
5. **Deploy Application**: Use this deployment guide

### Benefits of Self-Hosted

1. **Cost Control**: Predictable hosting costs
2. **Data Control**: Full control over your data
3. **Performance**: Dedicated resources
4. **Customization**: Full access to configure services
5. **No Vendor Lock-in**: Standard tools and protocols

## Support

For deployment issues:

- **Application Logs**: Check Coolify application logs
- **Database Issues**: Check PostgreSQL service logs
- **Storage Issues**: Check MinIO console and logs
- **Network Issues**: Verify internal service names
- **Domain Issues**: Check DNS and SSL configuration
