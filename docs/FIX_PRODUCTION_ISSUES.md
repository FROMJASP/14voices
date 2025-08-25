# Fix Production Issues Guide

## Current Issues Addressed

### 1. Server Components Render Error

- **Error**: "An error occurred in the Server Components render" (digest: 1729001402)
- **Cause**: Missing database columns or empty voiceovers table
- **Solution**: Run `fix-production-render-error.js` script

### 2. Admin User Creation Failure

- **Error**: "Failed to fetch" when creating first admin user
- **Cause**: Missing Payload v3 auth columns in users table
- **Solution**: Run `fix-admin-creation.js` script

## Deployment Steps

### Option 1: Automatic Fix (via Docker entrypoint)

The fixes are now integrated into `fix-production-comprehensive.js` which runs automatically during deployment.

### Option 2: Manual Fix (SSH into container)

1. **SSH into your Coolify server**

2. **Access the Docker container**:

   ```bash
   # Find the container ID
   docker ps | grep 14voices

   # Access the container
   docker exec -it <container_id> bash
   ```

3. **Run the comprehensive fix**:

   ```bash
   cd /app
   node scripts/fix-production-comprehensive.js
   ```

4. **If you need to run individual fixes**:

   ```bash
   # Fix Server Components render error
   node scripts/fix-production-render-error.js

   # Fix admin user creation
   node scripts/fix-admin-creation.js
   ```

5. **Seed voiceovers if needed** (if count is 0):

   ```bash
   bun run seed:voiceovers
   ```

6. **Restart the container**:
   ```bash
   exit  # Exit from container
   docker restart <container_id>
   ```

## Environment Variables to Check

Ensure these are set correctly in Coolify:

```env
# Required
DATABASE_URL=postgresql://user:password@host:5432/database
NEXT_PUBLIC_SERVER_URL=https://14voices.fromjasp.com
PAYLOAD_SECRET=<your-secret>

# Email
RESEND_API_KEY=re_xxxxxxxxxxxx

# Storage (if using MinIO/S3)
S3_ENDPOINT=http://minio:9000
S3_ACCESS_KEY=<your-key>
S3_SECRET_KEY=<your-secret>
S3_BUCKET=fourteenvoices-media
S3_REGION=us-east-1
```

## Verification Steps

1. **Check homepage**: https://14voices.fromjasp.com should load without errors
2. **Check admin**: https://14voices.fromjasp.com/admin should show login or create-first-user
3. **Create admin user**: Should work without "Failed to fetch" error

## What the Fixes Do

### fix-production-render-error.js

- Adds missing columns to voiceovers table (slug, status, availability)
- Fixes NULL slugs that cause render errors
- Ensures homepage_settings global exists
- Verifies Payload system tables

### fix-admin-creation.js

- Adds Payload v3 auth columns (\_verified, loginattempts, etc.)
- Creates necessary indexes
- Ensures payload_preferences table exists
- Verifies all required user columns

## If Issues Persist

1. **Check Logs**:

   ```bash
   docker logs <container_id> --tail 100
   ```

2. **Check Database Connection**:
   - Verify DATABASE_URL is correct
   - Ensure database is accessible from container
   - Check for firewall/network issues

3. **Check Browser Console**:
   - Look for CORS errors
   - Check for CSP violations
   - Verify API calls to correct URL

4. **Force Schema Sync**:
   ```bash
   cd /app
   node scripts/force-schema-sync.js
   ```

## Summary

The production issues were caused by:

1. Missing database columns after Payload v3 upgrade
2. Empty voiceovers table causing homepage render errors
3. Missing auth columns preventing admin user creation

The fix scripts handle all these issues automatically and are now integrated into the deployment process.
