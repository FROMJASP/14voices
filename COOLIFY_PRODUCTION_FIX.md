# Coolify Production Deployment Fix

## Quick Fix for Current Issues

The 14voices deployment on Coolify is experiencing 4 main issues:

1. **Homepage shows "Server Components render error" (digest: 1729001402)**
2. **Database shows 0 voiceovers despite scripts running**
3. **Admin creation redirects to /admin/create-first-user but fails**
4. **Client-side API calls connecting to localhost:3000 instead of production domain**

## 🚀 One-Command Fix

SSH into your Coolify server and run:

```bash
# Find your 14voices container
docker ps | grep 14voices

# Access the container (replace <container_id> with actual ID)
docker exec -it <container_id> bash

# Run the comprehensive fix script
cd /app
node scripts/fix-coolify-production-issues.js
```

This script will:

- ✅ Fix all database schema issues
- ✅ Create sample voiceovers (Emma, Thomas, Sophie, Mark, Lisa)
- ✅ Create admin user (default: admin@14voices.com)
- ✅ Fix Payload v3 compatibility issues
- ✅ Create homepage settings
- ✅ Verify all fixes worked

## 🔧 What the Code Fixes Do

### 1. NEXT_PUBLIC_SERVER_URL Fix (Dockerfile)

**Problem**: Coolify sets environment variables, but the Dockerfile expected build arguments.

**Solution**: Updated Dockerfile to handle both build args and environment variables:

- Added debugging during build to show which URL is being used
- Made the build process more robust for different deployment platforms

### 2. API URL Resolution Fix (src/lib/api.ts + client-config.ts)

**Problem**: Client-side code still defaulted to localhost:3000.

**Solution**: Enhanced client config to:

- Prioritize properly set environment URLs
- Fallback to window.location.origin on client-side
- Handle edge cases with fake/localhost URLs

### 3. Homepage Error Handling (src/app/.../page.tsx)

**Problem**: Server Components render error when database queries fail.

**Solution**: Added comprehensive error boundaries:

- Separate try-catch for hero settings vs voiceovers
- Fallback data for all scenarios
- Last resort minimal UI if everything fails
- Never throws errors that would break the page

### 4. Database Schema & Data (fix-coolify-production-issues.js)

**Problem**: Missing tables, columns, and data after deployment.

**Solution**: Comprehensive database fix script:

- Creates/fixes users table with Payload v3 columns
- Creates/fixes voiceovers table with required columns
- Seeds sample voiceovers if table is empty
- Creates admin user if none exists
- Sets up homepage settings
- Handles Payload locale table compatibility

## 🔍 Verification Steps

After running the fix script:

1. **Check Homepage**: https://14voices.fromjasp.com
   - Should load without errors
   - Should show voiceovers section

2. **Check Admin Panel**: https://14voices.fromjasp.com/admin
   - Should show login form (not create-first-user)
   - Should allow login with created admin credentials

3. **Check Browser Console**:
   - No localhost:3000 API calls
   - No CORS or fetch errors

## 🛠️ Manual Verification Commands

Inside the container:

```bash
# Check database connection
psql $DATABASE_URL -c "SELECT 1;"

# Check voiceovers count
psql $DATABASE_URL -c "SELECT COUNT(*) FROM voiceovers;"

# Check admin users
psql $DATABASE_URL -c "SELECT email, role FROM users WHERE role = 'admin';"

# Check environment variables
echo "NEXT_PUBLIC_SERVER_URL: $NEXT_PUBLIC_SERVER_URL"
echo "DATABASE_URL: ${DATABASE_URL:0:20}..."
```

## 🔄 If Issues Persist

1. **Restart the container**: `docker restart <container_id>`
2. **Check logs**: `docker logs <container_id> --tail 100`
3. **Re-run the fix script** - it's safe to run multiple times
4. **Check Coolify environment variables** - ensure NEXT_PUBLIC_SERVER_URL is set correctly

## 📝 Environment Variables Checklist

Ensure these are set in Coolify:

```env
# Required
NEXT_PUBLIC_SERVER_URL=https://14voices.fromjasp.com
DATABASE_URL=postgresql://...
PAYLOAD_SECRET=your-32-char-secret

# Optional but recommended
ADMIN_EMAIL=your@email.com
ADMIN_PASSWORD=YourStrongPassword123!
```

## 🎯 Expected Results

After applying all fixes:

- ✅ Homepage loads instantly with voiceovers displayed
- ✅ Admin login works without "Failed to fetch" errors
- ✅ All API calls use https://14voices.fromjasp.com
- ✅ Database contains sample voiceovers and admin user
- ✅ No more Server Components render errors

The fixes are designed to be:

- **Idempotent**: Safe to run multiple times
- **Comprehensive**: Address all known issues
- **Robust**: Handle edge cases and failures gracefully
- **Production-ready**: Include proper error handling and logging
