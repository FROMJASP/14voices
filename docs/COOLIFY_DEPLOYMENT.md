# Coolify Deployment Guide for 14voices

## Critical Configuration

### 1. Build Arguments (REQUIRED)

In Coolify, you MUST set build arguments to ensure the client-side code gets the correct production URL:

1. Go to your application settings in Coolify
2. Find the "Build Arguments" section
3. Add:
   ```
   NEXT_PUBLIC_SERVER_URL=https://14voices.fromjasp.com
   ```

Without this, your client-side code will try to connect to `localhost:3000` instead of your production domain!

### 2. Environment Variables

Set all these environment variables in Coolify:

```env
# Database (use Coolify's internal network name)
DATABASE_URL=postgresql://fourteenvoices:password@your-db-container:5432/postgres

# Application
NEXT_PUBLIC_SERVER_URL=https://14voices.fromjasp.com
NODE_ENV=production
HOSTNAME=0.0.0.0
PORT=3000

# Security
PAYLOAD_SECRET=<generate-32-char-secret>
CSRF_SECRET=<generate-different-64-char-secret>

# Email
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx

# Admin (for initial setup)
ADMIN_EMAIL=admin@14voices.com
ADMIN_PASSWORD=<strong-password>

# Storage (MinIO)
S3_ENDPOINT=http://minio-storage:9000
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
S3_BUCKET=fourteenvoices-media
S3_REGION=us-east-1

# Optional
SENTRY_DSN=https://xxx@sentry.io/xxx
```

### 3. Health Check Configuration

Configure the health check in Coolify:

- **Health Check Path**: `/api/health`
- **Health Check Method**: `GET`
- **Start Period**: 60 seconds (important for database migrations)

### 4. Database Setup

1. Create a PostgreSQL database in Coolify
2. Note the internal network name (e.g., `fwws0kskowgo48cgo84kowwo`)
3. Use this in your DATABASE_URL

### 5. Storage Setup (MinIO)

1. Deploy MinIO as a separate service in Coolify
2. Create a bucket named `fourteenvoices-media`
3. Generate access keys
4. Use the internal network name for S3_ENDPOINT

## Deployment Process

### First Deployment

1. Set all environment variables
2. **IMPORTANT**: Set build arguments (NEXT_PUBLIC_SERVER_URL)
3. Deploy the application
4. Wait for health checks to pass (can take 2-3 minutes)
5. Access `/admin` to create your first user

### Subsequent Deployments

The application will:

1. Run database migrations automatically
2. Sync schema with collection definitions
3. Create admin user if none exists (using ADMIN_EMAIL/ADMIN_PASSWORD)
4. Add sample voiceovers if database is empty

## Troubleshooting

### Client-side API calls failing to localhost

**Symptom**: Browser console shows `localhost:3000/api/...` errors

**Solution**:

1. Ensure `NEXT_PUBLIC_SERVER_URL` is set as a BUILD ARGUMENT (not just environment variable)
2. Redeploy the application
3. Clear browser cache

### "Failed to fetch" on admin creation

**Symptom**: Can't create first admin user

**Solution**:

1. The quick-production-fix.js script should create an admin automatically
2. Use the ADMIN_EMAIL and ADMIN_PASSWORD from your environment variables
3. If still failing, check database logs

### Empty homepage

**Symptom**: Homepage loads but shows no voiceovers

**Solution**:

1. The quick-production-fix.js adds sample voiceovers automatically
2. Check Coolify logs to ensure the script ran successfully
3. Access `/admin` to add more voiceovers

### Database connection errors

**Symptom**: "Database not ready" in logs

**Solution**:

1. Ensure PostgreSQL service is running
2. Check DATABASE_URL uses the correct internal hostname
3. Verify password doesn't contain special characters that need escaping

## Important Notes

1. **Build Arguments vs Environment Variables**:
   - Build arguments are used during Docker build
   - Environment variables are used at runtime
   - `NEXT_PUBLIC_*` variables MUST be set as build arguments

2. **First Admin User**:
   - Created automatically using ADMIN_EMAIL/ADMIN_PASSWORD
   - Change the password immediately after first login

3. **Database Migrations**:
   - Run automatically on every deployment
   - Safe to run multiple times (idempotent)

4. **Logs**:
   - Check Coolify deployment logs for migration status
   - Check application logs for runtime errors

## Quick Commands

### Manual Database Fix (if needed)

SSH into your container and run:

```bash
node scripts/quick-production-fix.js
```

### Check Database Schema

```bash
node scripts/check-database-schema.js
```

### Force Schema Sync

```bash
node scripts/force-schema-sync.js
```
