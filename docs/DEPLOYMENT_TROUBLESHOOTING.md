# Deployment Troubleshooting Guide

## Overview

This guide covers the comprehensive fixes implemented to resolve deployment issues on Coolify and other self-hosted environments.

## Fixed Issues

### 1. Database Column Naming (snake_case vs camelCase)
- **Problem**: Payload CMS expects snake_case columns but some were in camelCase
- **Solution**: Created `fix-column-naming.js` to rename columns and add missing auth columns
- **Files**: 
  - `/scripts/fix-column-naming.js`
  - `/scripts/fix-column-naming.sql`

### 2. Missing Authentication Columns
- **Problem**: Missing `reset_password_token` and `reset_password_expiration` columns
- **Solution**: Comprehensive migration script that adds all required columns
- **Files**:
  - `/scripts/comprehensive-migration.js`
  - `/scripts/docker-entrypoint-fixed.sh`

### 3. Server Components Render Error (digest: 1756515888)
- **Problem**: Homepage trying to access Payload before initialization
- **Solution**: Created safe-payload wrapper with retry logic
- **Files**:
  - `/src/lib/safe-payload.ts`
  - `/src/lib/homepage-settings.ts`

### 4. Upload Handler Provider Error (digest: 1078076732)
- **Problem**: S3 handlers included when S3 not configured
- **Solution**: Conditional S3 handler inclusion in import map
- **Files**:
  - `/scripts/generate-importmap.js`

### 5. Payload Initialization Failures
- **Problem**: Next.js starts before database is ready
- **Solution**: Retry logic with 5 attempts and 30-second delays
- **Files**:
  - `/src/lib/safe-payload.ts`
  - `/scripts/docker-entrypoint-fixed.sh`

## Monitoring and Recovery

### Health Check Endpoint

Monitor application health:
```bash
# Check health status
curl http://your-app-url/api/health

# Reset Payload instance if needed
curl http://your-app-url/api/health?reset=true
```

### Manual Payload Reset

Use the reset script:
```bash
# From inside container
node scripts/reset-payload.js status
node scripts/reset-payload.js reset

# From outside container
docker exec <container-id> node scripts/reset-payload.js reset
```

### Database Migration Commands

Run migrations manually if needed:
```bash
# Comprehensive migration (recommended)
node scripts/comprehensive-migration.js

# Column naming fix only
node scripts/fix-column-naming.js

# Direct SQL migration
psql $DATABASE_URL < scripts/fix-column-naming.sql
```

## Deployment Checklist

1. **Environment Variables**
   - Ensure all required env vars are set
   - S3 variables can be omitted if not using S3 storage
   - Database URL must be valid (not the build-time fake URL)

2. **Database Readiness**
   - Wait for database to be fully ready before starting app
   - The entrypoint script includes readiness checks
   - Migrations run automatically on startup

3. **Monitoring**
   - Watch container logs during startup
   - Check `/api/health` endpoint after deployment
   - Monitor for "Homepage: Found X voiceovers" in logs

4. **Recovery Steps**
   If deployment fails:
   - Check logs for specific error messages
   - Use health endpoint to check Payload status
   - Reset Payload instance if initialization failed
   - Run migrations manually if needed

## Common Error Messages and Solutions

### "column users.resetPasswordToken does not exist"
Run: `node scripts/fix-column-naming.js`

### "useUploadHandlers must be used within UploadHandlersProvider"
This should be fixed by conditional S3 inclusion. Check S3 env vars.

### "Failed to initialize Payload"
- Check database connectivity
- Wait for retry attempts (up to 5)
- Use reset script if needed

### "Homepage: Found 0 voiceovers"
- Payload not initialized properly
- Check health endpoint
- Reset and retry

## Performance Optimizations

The deployment includes several performance improvements:

1. **Aggressive Caching**
   - Homepage settings: 30-minute cache
   - Voiceover queries: 30-minute cache
   - Search results: 10-minute cache

2. **Retry Logic**
   - Payload initialization: 5 retries with 30s delays
   - Prevents crashes during database startup

3. **Query Optimization**
   - Selective field loading
   - Batch queries for related data
   - Performance metrics tracking

## Docker-Specific Considerations

1. **Build-Time Database**
   - Uses fake database URL during build
   - Real database connected at runtime
   - Pages marked as `force-dynamic`

2. **Health Checks**
   - Coolify should use `/api/health` endpoint
   - Configure with appropriate timeout (60s recommended)
   - Allow time for database initialization

3. **Volume Mounts**
   - Ensure upload directories are persisted
   - Database data should be on persistent volume