# Emergency Deployment Fix for 14voices

## The Problem

After 3 weeks of deployment issues since moving from Vercel to self-hosted infrastructure, the main problems are:

1. **Missing tsconfig.json in Docker container** - Payload CLI can't find TypeScript config
2. **Complex migration system failing** - Payload migrations timing out repeatedly
3. **Health checks failing** - Container never becomes healthy
4. **Circular dependencies** - Build needs database, database needs migrations, migrations need build

## The Solution

I've created a stripped-down deployment approach that:

1. **Fixes the missing files** - Copies all necessary config files to container
2. **Bypasses migrations temporarily** - Gets the app running first
3. **Uses simplified health checks** - Ensures container starts properly
4. **Breaks the circular dependency** - Separates build from runtime migrations

## Quick Fix Steps

### Option 1: Use the Fixed Main Dockerfile (Recommended)

The main `Dockerfile` has been updated to include:

- `tsconfig.json`
- `tsconfig.build.json`
- `postcss.config.mjs`
- `components.json`

Simply redeploy with the updated Dockerfile.

### Option 2: Use Emergency Dockerfile (If Option 1 Fails)

1. Use `Dockerfile.emergency` instead:

   ```bash
   # In Coolify, change build settings to use:
   # Dockerfile path: Dockerfile.emergency
   ```

2. This dockerfile:
   - Skips problematic Payload type generation
   - Uses emergency entrypoint without migrations
   - Gets the app running immediately

### Option 3: Manual Migration After Deployment

Once the app is running with either option:

1. SSH into your container
2. Run migrations manually:
   ```bash
   cd /app
   bun run payload migrate
   ```

## Files Created

1. **Updated Dockerfile** - Fixed missing config files issue
2. **Dockerfile.emergency** - Stripped-down version for immediate deployment
3. **docker-entrypoint-emergency.sh** - Bypasses migrations for quick startup
4. **fix-docker-build-minimal.sh** - Helper script for manual fixes

## Root Cause Analysis

The deployment has been failing because:

1. **Payload v3 Beta Issues** - The CMS is still in beta with breaking changes
2. **Missing Config Files** - Docker build was missing critical TypeScript configs
3. **Overly Complex Migration System** - Too many migration scripts causing confusion
4. **Build/Runtime Confusion** - Trying to run migrations during build with fake database

## Long-term Solution

After getting the app running:

1. **Simplify migration system** - Use single migration script
2. **Separate build and runtime** - Don't run migrations during build
3. **Update Payload to stable version** - When v3 exits beta
4. **Consider managed database** - To avoid self-hosted complexity

## Verification Steps

After deployment:

1. Check health endpoint:

   ```bash
   curl https://14voices.fromjasp.com/api/health?quick=true
   ```

2. Check admin panel:

   ```
   https://14voices.fromjasp.com/admin
   ```

3. Check main site:
   ```
   https://14voices.fromjasp.com
   ```

## If Still Failing

The nuclear option:

1. Deploy a static holding page
2. Run database migrations locally
3. Export/import database to production
4. Deploy application without migrations

Remember: The goal is to get SOMETHING running, then fix it incrementally.
