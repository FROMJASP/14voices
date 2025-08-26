# Coolify Deployment Guide - Production Ready

This guide provides a bulletproof deployment solution for Coolify that eliminates all recurring issues by using ONLY Payload's built-in migration system.

## Architecture Overview

### Single Migration System
- **ONLY Payload migrations** - No dual migration confusion
- **Automatic schema sync** - Collections define the schema
- **Zero manual SQL** - Payload handles everything
- **Production tested** - Handles all edge cases

### Key Components

1. **payload-migration-runner.js** - Production-grade migration runner
2. **docker-entrypoint-v2.sh** - Simplified, robust entrypoint
3. **Dockerfile.production** - Optimized multi-stage build
4. **Build-time isolation** - Fake database during build

## Deployment Steps

### 1. Initial Setup

```bash
# Copy the production Dockerfile
cp Dockerfile.production Dockerfile

# Use the new entrypoint
cp scripts/docker-entrypoint-v2.sh scripts/docker-entrypoint.sh
chmod +x scripts/docker-entrypoint.sh

# Ensure migration runner is executable
chmod +x scripts/payload-migration-runner.js
```

### 2. Environment Variables

Required for Coolify deployment:

```env
# Database (Coolify provides this)
DATABASE_URL=postgresql://user:pass@db:5432/database

# Application
NEXT_PUBLIC_SERVER_URL=https://your-domain.com
PAYLOAD_SECRET=<generate-32-char-secret>
CSRF_SECRET=<generate-different-32-char-secret>

# Email
RESEND_API_KEY=re_your_api_key

# Storage (MinIO/S3)
S3_ENDPOINT=http://minio:9000
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
S3_BUCKET=14voices
S3_REGION=us-east-1

# Admin user (optional, for initial setup)
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=<strong-password>
```

### 3. Coolify Configuration

In your Coolify application settings:

**Build Configuration:**
```yaml
Build Pack: Dockerfile
Dockerfile Location: ./Dockerfile
```

**Health Check:**
```yaml
Path: /api/health
Port: 3000
Interval: 30s
Timeout: 10s
Retries: 3
Start Period: 60s
```

**Resources:**
```yaml
Memory: 512MB minimum (1GB recommended)
CPU: 0.5 minimum (1.0 recommended)
```

## How It Works

### 1. Build Phase
- Uses fake database URL to prevent connection attempts
- Generates static assets and Next.js build
- Creates import map for Payload admin
- Zero database dependency during build

### 2. Runtime Phase
- Waits for database with exponential backoff
- Runs Payload migrations automatically
- Handles all schema synchronization
- Starts application when ready

### 3. Migration System

The migration runner:
- Detects build vs runtime environment
- Validates database connectivity
- Runs Payload's built-in migrations
- Retries on failure (3 attempts)
- Provides detailed logging
- Verifies migration success

## Common Issues Solved

### 1. Database Schema Mismatches
**Solution**: Payload migrations run on every deployment, ensuring schema matches collections.

### 2. Build Failures
**Solution**: Build uses fake database URL, eliminating connection issues during build.

### 3. Migration Conflicts
**Solution**: Single migration system (Payload only) prevents dual-system conflicts.

### 4. Import Map Errors
**Solution**: Import map generated during build with fallback during runtime.

### 5. User Table Issues
**Solution**: Payload creates and manages all tables including users.

## Creating Custom Migrations

When you need migrations beyond automatic schema sync:

```bash
# Generate a new migration
node scripts/generate-payload-migration.js add-custom-field

# Edit the generated file in src/migrations/
# Run locally to test
bun payload migrate
```

## Monitoring Deployments

### Check Migration Status
Look for these log messages:

```
✓ Database connection successful
🚀 Starting Payload migration runner...
✓ Migrations completed successfully
✨ Database schema is synchronized with Payload collections
```

### Health Endpoint
Monitor application health:

```bash
curl https://your-domain.com/api/health
```

### Debug Failed Deployments

1. Check Coolify logs for migration errors
2. Verify DATABASE_URL is correct
3. Ensure PAYLOAD_SECRET is set
4. Check for TypeScript compilation errors

## Best Practices

### 1. Environment Variables
- Never commit secrets to git
- Use strong, unique values for PAYLOAD_SECRET and CSRF_SECRET
- Rotate secrets periodically

### 2. Database
- Let Coolify manage PostgreSQL
- Don't modify schema manually
- Use Payload migrations for changes

### 3. Storage
- Configure MinIO/S3 before first deployment
- Ensure bucket exists
- Set proper CORS rules if needed

### 4. Monitoring
- Set up health checks in Coolify
- Monitor logs during deployment
- Use Sentry for error tracking

## Rollback Strategy

If deployment fails:

1. **Coolify Auto-Rollback**: Coolify automatically rolls back on health check failure
2. **Manual Rollback**: Use Coolify's deployment history
3. **Database State**: Payload migrations are forward-only, plan accordingly

## Testing Locally

Before deploying to Coolify:

```bash
# Build the Docker image
docker build -f Dockerfile.production -t 14voices-test .

# Run with test database
docker run -e DATABASE_URL=postgresql://test:test@localhost:5432/test \
          -e PAYLOAD_SECRET=test-secret-32-chars-minimum-req \
          -e NEXT_PUBLIC_SERVER_URL=http://localhost:3000 \
          -p 3000:3000 \
          14voices-test
```

## Troubleshooting

### Migration Failures
- Check DATABASE_URL is accessible
- Verify PAYLOAD_SECRET is set
- Look for TypeScript errors in migrations
- Check disk space for database

### Build Failures
- Ensure all imports are correct
- Check for missing dependencies
- Verify TypeScript compiles locally
- Run `bun run build` before pushing

### Runtime Errors
- Check all required env vars are set
- Verify S3/MinIO credentials
- Check database connection limits
- Monitor memory usage

## Support

For issues specific to this deployment solution:
1. Check Coolify logs first
2. Verify all environment variables
3. Test locally with Docker
4. Check the migration runner output

This solution has been tested in production and handles all edge cases for reliable Coolify deployments.