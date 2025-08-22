# Production Deployment Fix Instructions

## Issues Identified

1. **Database Schema Issue**: Missing `voiceovers__locales` table (Payload CMS uses double underscore for localized tables)
2. **Import Map Issue**: S3ClientUploadHandler causing UploadHandlersProvider error when S3 is not configured

## Fix Summary

I've created several scripts to fix these issues:

1. **fix-production-issues.js** - Comprehensive fix for both database and import map issues
2. **hotfix-production.sql** - Direct SQL to fix database schema
3. **fix-importmap-quick.sh** - Quick shell script to fix import map
4. **Updated generate-importmap.js** - Now conditionally includes S3 based on configuration

## Option 1: Redeploy with Fixed Code (Recommended)

The code has been updated with all fixes:

1. **Dockerfile** - Updated to include the new fix script
2. **docker-entrypoint.sh** - Updated to run the production fix script
3. **generate-importmap.js** - Fixed to conditionally include S3

Simply redeploy the application and the fixes will be applied automatically during startup.

## Option 2: Manual Fix in Container

If you need to fix the running container immediately:

### Step 1: Fix Database Schema

Run this in the container:

```bash
# Option A: Use the fix script
node /app/scripts/fix-production-issues.js

# Option B: Run SQL directly
psql $DATABASE_URL < /app/scripts/hotfix-production.sql
```

### Step 2: Fix Import Map

Run this in the container:

```bash
# Quick fix
sh /app/scripts/fix-importmap-quick.sh

# Then restart the application
```

## Option 3: Direct Database Fix

If you have direct database access, run this SQL:

```sql
-- Create the correct table with double underscore
CREATE TABLE IF NOT EXISTS voiceovers__locales (
  id SERIAL PRIMARY KEY,
  name text,
  description text,
  _locale text NOT NULL,
  _parent_id integer REFERENCES voiceovers(id) ON DELETE CASCADE,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_voiceovers__locales_parent ON voiceovers__locales(_parent_id);
CREATE INDEX IF NOT EXISTS idx_voiceovers__locales_locale ON voiceovers__locales(_locale);
CREATE INDEX IF NOT EXISTS idx_voiceovers__locales_parent_locale ON voiceovers__locales(_parent_id, _locale);

-- Also ensure these tables exist
CREATE TABLE IF NOT EXISTS voiceovers_additional_photos (
  id SERIAL PRIMARY KEY,
  _order integer NOT NULL,
  _parent_id integer REFERENCES voiceovers(id) ON DELETE CASCADE,
  photo_id integer REFERENCES media(id) ON DELETE SET NULL,
  caption text,
  _uuid text,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS voiceovers_style_tags (
  id SERIAL PRIMARY KEY,
  _order integer NOT NULL,
  _parent_id integer REFERENCES voiceovers(id) ON DELETE CASCADE,
  tag text,
  custom_tag text,
  _uuid text,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Variables

Make sure these are properly set in Coolify:

```env
DATABASE_URL=postgresql://user:password@host:5432/database
S3_ACCESS_KEY=dummy  # Use 'dummy' if not using S3
S3_SECRET_KEY=dummy  # Use 'dummy' if not using S3
```

## Verification

After applying fixes:

1. Check homepage: https://14voices.fromjasp.com/
2. Check admin panel: https://14voices.fromjasp.com/admin
3. Run health check: https://14voices.fromjasp.com/api/health

## Key Insights

1. **Payload CMS Localization**: Uses double underscore (`__`) for localized table names, not single underscore
2. **Import Map Generation**: Must conditionally include plugins based on environment configuration
3. **S3 Storage**: When using dummy values, the S3 plugin should not be included in the import map

## Support

If issues persist after applying these fixes:

1. Check container logs for any new errors
2. Verify database tables exist with correct names
3. Ensure import map doesn't include S3 references when using dummy values

The root cause was a mismatch between Payload CMS expectations (double underscore for localized tables) and missing conditional logic for S3 in the import map generation.
