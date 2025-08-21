# Deployment Troubleshooting Guide

## Overview

This guide covers troubleshooting the simplified deployment process for 14voices. The application now uses a single migration script and standard self-hosted components.

## Common Issues & Solutions

### Database Connection Issues

**❌ Problem**: `ECONNREFUSED` when connecting to database

**✅ Solution**:

```bash
# Check DATABASE_URL format
echo $DATABASE_URL

# Should be: postgresql://user:password@host:5432/database
# For Coolify: postgresql://postgres:password@postgres-service:5432/fourteenvoices

# Test connection manually
docker exec app-container psql $DATABASE_URL -c "SELECT 1;"
```

### Migration Failures

**❌ Problem**: Tables not created or migration script fails

**✅ Solution**:

```bash
# Check migration status
docker exec app-container bun payload migrate:status

# Run migration manually
docker exec app-container node scripts/payload-migrate.js

# Check specific tables exist
docker exec postgres-container psql -U postgres -d fourteenvoices -c "\dt"
```

### Storage Upload Issues

**❌ Problem**: File uploads fail or return errors

**✅ Solution**:

```bash
# Check MinIO service is running
curl http://minio-service:9000/minio/health/live

# Verify environment variables
echo $S3_ENDPOINT    # Should not have trailing slash
echo $S3_BUCKET      # Should match created bucket
echo $S3_ACCESS_KEY  # Should not be 'dummy'

# Test bucket access via MinIO console
# Access at: http://your-server:9001
```

### 404 Errors After Deployment

**❌ Problem**: Homepage shows 404 or pages not found

**✅ Solution**:

```bash
# Database is likely empty - run seeding
docker exec app-container bun run seed

# Check if pages exist
docker exec postgres-container psql -U postgres -d fourteenvoices -c "SELECT slug FROM pages;"

# Ensure at least one page with slug 'home' exists
```

### Admin Panel Access Issues

**❌ Problem**: Cannot access /admin or login fails

**✅ Solution**:

```bash
# Check if users table exists and has data
docker exec postgres-container psql -U postgres -d fourteenvoices -c "SELECT email FROM users;"

# Create admin user manually if needed
docker exec app-container node -e "
  const payload = require('./dist/payload.config.js');
  // Script to create admin user
"

# Or re-run seeding with admin credentials
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=strongpassword docker exec app-container bun run seed
```

### Build Failures in Docker

**❌ Problem**: Docker build fails with TypeScript or dependency errors

**✅ Solution**:

```bash
# The Dockerfile uses fake DATABASE_URL during build - this is required
# Never remove: DATABASE_URL=postgresql://fake:fake@fake:5432/fake

# Test build locally
docker build -t test-14voices .

# Check for dependency issues
bun run validate:deps
bun run validate:build
```

### Performance Issues

**❌ Problem**: Slow page loads or timeouts

**✅ Solution**:

```bash
# Enable Redis caching (optional)
# Deploy Redis service in Coolify
# Add environment variable: REDIS_URL=redis://redis-service:6379

# Check cache status
curl https://yourdomain.com/api/health/cache

# Monitor performance
curl https://yourdomain.com/api/health/performance
```

### SSL Certificate Issues

**❌ Problem**: HTTPS not working or certificate warnings

**✅ Solution**:

```bash
# Coolify handles SSL automatically
# Check domain configuration in Coolify dashboard
# Ensure DNS points to correct server IP
# Wait for certificate provisioning (can take a few minutes)

# Verify SSL status
curl -I https://yourdomain.com
```

## Health Check Endpoints

Use these endpoints to diagnose issues:

- `/api/health` - Overall application health
- `/api/health/cache` - Cache system status
- `/api/health/email-system` - Email service status
- `/api/health/performance` - Performance metrics

Example health check:

```bash
curl https://yourdomain.com/api/health
# Returns: {"status": "healthy", "timestamp": "...", "services": {...}}
```

## Log Analysis

### Application Logs

```bash
# View live logs in Coolify dashboard
# Or via command line:
docker logs app-container -f

# Look for these success indicators:
# ✅ Database connection successful
# ✅ Migration completed successfully
# ✅ Seed data completed successfully
# 🎯 Starting application...
```

### Database Logs

```bash
# Check PostgreSQL logs
docker logs postgres-container -f

# Look for connection attempts and errors
# Successful connections should show: "LOG: connection authorized"
```

### Storage Logs

```bash
# Check MinIO logs
docker logs minio-container -f

# Look for API requests and bucket operations
```

## Prevention

### Pre-Deployment Checklist

- [ ] Run `bun run validate:full` locally
- [ ] Test production build: `bun run build`
- [ ] Verify environment variables are set
- [ ] Ensure PostgreSQL service is running
- [ ] Ensure MinIO service is running
- [ ] Check DNS configuration
- [ ] Verify strong passwords for all services

### Post-Deployment Verification

- [ ] Homepage loads without errors
- [ ] Admin panel accessible at /admin
- [ ] File uploads work
- [ ] Email system functional
- [ ] SSL certificate valid
- [ ] Health endpoints return healthy status

## Emergency Recovery

### Complete Reset (Last Resort)

If deployment is completely broken:

```bash
# 1. Stop application
# In Coolify: Stop the application service

# 2. Reset database (WARNING: Destroys all data)
docker exec postgres-container psql -U postgres -c "DROP DATABASE fourteenvoices;"
docker exec postgres-container psql -U postgres -c "CREATE DATABASE fourteenvoices;"

# 3. Clear MinIO bucket
# Access MinIO console and empty bucket

# 4. Redeploy application
# In Coolify: Click "Deploy"
# Watch logs for automatic migration and seeding

# 5. Verify setup
curl https://yourdomain.com/api/health
```

## Getting Help

1. **Check Logs**: Always start with application and service logs
2. **Health Endpoints**: Use built-in health checks to identify issues
3. **Test Components**: Test database, storage, and email independently
4. **Coolify Community**: Check Coolify Discord for platform-specific issues
5. **Documentation**: Refer to the main [Deployment Guide](./DEPLOYMENT_GUIDE.md)

## Known Working Configuration

For reference, here's a known working environment variable setup:

```env
# Database
DATABASE_URL=postgresql://postgres:secure-password@postgres-14voices:5432/fourteenvoices

# Payload CMS
PAYLOAD_SECRET=32-char-secret-generated-with-openssl
NEXT_PUBLIC_SERVER_URL=https://14voices.com

# Storage
S3_ENDPOINT=http://minio-14voices:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=secure-minio-password
S3_BUCKET=fourteenvoices-media
S3_REGION=us-east-1
S3_PUBLIC_URL=https://minio.14voices.com

# Email
RESEND_API_KEY=re_actual-resend-api-key

# Security
CSRF_SECRET=different-64-char-secret

# Admin (for initial setup)
ADMIN_EMAIL=admin@14voices.com
ADMIN_PASSWORD=secure-admin-password

# Production
NODE_ENV=production
```
