# Database Migration Fix Documentation

## Issue Summary

When migrating from Neon to self-hosted PostgreSQL, the application encountered several errors:

### Primary Issues (Production Blocking):

```
Error: column voiceovers.full_demo_reel_id does not exist
Error: column voiceovers.commercials_demo_id does not exist
Error: column voiceovers.narrative_demo_id does not exist
```

### Secondary Issue (Fixed):

```
column voiceovers__locales.description does not exist
```

## Root Cause

### Missing Upload Columns

The primary issue is that the Voiceovers collection defines upload fields:

- `fullDemoReel` (type: upload, relationTo: media)
- `commercialsDemo` (type: upload, relationTo: media)
- `narrativeDemo` (type: upload, relationTo: media)

Payload CMS automatically converts these to database columns with snake_case names and `_id` suffixes:

- `fullDemoReel` → `full_demo_reel_id`
- `commercialsDemo` → `commercials_demo_id`
- `narrativeDemo` → `narrative_demo_id`

These columns were never created during the initial migration, causing the application to fail when accessing voiceover data.

### Locales Table Naming

Payload CMS uses **double underscores** (`__`) for localized collection tables, not single underscores (`_`). The original migration script created tables with single underscores (e.g., `voiceovers_locales`) when Payload expected double underscores (e.g., `voiceovers__locales`).

## Solution

We've created comprehensive migration scripts to fix these issues:

### 🚀 IMMEDIATE FIX: `scripts/fix-production-database.js`

**Run this script immediately to fix the production deployment:**

This comprehensive script fixes both primary issues:

1. Adds missing voiceover upload columns (`full_demo_reel_id`, `commercials_demo_id`, `narrative_demo_id`)
2. Fixes locales table naming (single to double underscores)
3. Sets up proper foreign keys and indexes
4. Provides detailed verification and status reporting

### Individual Scripts (for reference):

#### 1. `scripts/fix-voiceover-upload-columns.js`

Focuses specifically on adding the missing upload columns to the voiceovers table.

#### 2. `scripts/complete-schema-migration.js`

The main migration script for locales tables that:

- Checks for incorrectly named tables
- Renames `voiceovers_locales` to `voiceovers__locales` if needed
- Creates the table with correct structure if it doesn't exist
- Ensures all required columns exist (including `description`)
- Sets up proper foreign keys and indexes

#### 3. `scripts/fix-voiceovers-locales.js`

A focused script specifically for fixing the voiceovers locales table naming issue.

#### 4. `scripts/check-database-schema.js`

A diagnostic script that checks the database schema for common issues:

- Missing tables
- Incorrect table names
- Missing columns
- Foreign key relationships
- Indexes

#### 5. Updated `scripts/payload-migrate.js`

The main migration script now includes:

- Double underscores for locales tables
- Missing voiceover upload columns
- Proper foreign key constraints

## How to Run Manually

### 🚨 PRODUCTION FIX (Run immediately):

```bash
# Fix all production issues in one command
node scripts/fix-production-database.js
```

### Individual fixes (if needed):

```bash
# Check current schema status
node scripts/check-database-schema.js

# Fix just the upload columns
node scripts/fix-voiceover-upload-columns.js

# Fix just the locales tables
node scripts/fix-voiceovers-locales.js

# Fix all locales tables comprehensively
node scripts/fix-all-locales-tables.js
```

## Docker Deployment

The Docker deployment automatically runs these migrations via the entrypoint script:

1. `payload-migrate.js` - Creates base tables
2. `complete-schema-migration.js` - Fixes any naming issues
3. `npx payload migrate` - Runs Payload's own migrations

## Expected Schema

The correct schema for the voiceovers collection in Payload CMS:

### Table: `voiceovers` (main table)

Must include these upload relationship columns:

- `full_demo_reel_id` (integer, FK to media.id) - For fullDemoReel field
- `commercials_demo_id` (integer, FK to media.id) - For commercialsDemo field
- `narrative_demo_id` (integer, FK to media.id) - For narrativeDemo field

### Table: `voiceovers__locales` (note the double underscore)

- `id` (SERIAL PRIMARY KEY)
- `name` (text)
- `description` (text)
- `_locale` (text NOT NULL)
- `_parent_id` (integer, FK to voiceovers.id)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Related Tables:

- `voiceovers_additional_photos` (array field, uses single underscore)
- `voiceovers_style_tags` (array field, uses single underscore)

## Key Learning

Payload CMS naming conventions:

- **Localized tables**: Use double underscores (`collection__locales`)
- **Array field tables**: Use single underscores (`collection_field_name`)
- **Relationship tables**: Follow standard naming based on field type

## Verification

After migration, verify the schema:

```bash
# Check that upload columns exist in voiceovers table
psql $DATABASE_URL -c "\d voiceovers" | grep "demo.*_id"

# Verify the columns specifically
psql $DATABASE_URL -c "
  SELECT column_name
  FROM information_schema.columns
  WHERE table_name = 'voiceovers'
  AND column_name IN ('full_demo_reel_id', 'commercials_demo_id', 'narrative_demo_id');
"

# Check that locales table exists with correct name
psql $DATABASE_URL -c "SELECT * FROM voiceovers__locales LIMIT 1;"

# Check column structure
psql $DATABASE_URL -c "\d voiceovers__locales"
```

## Prevention

To prevent similar issues in the future:

### Schema Validation

1. **Always run Payload's own migrations first**: `npx payload migrate`
2. **Use the schema checker**: `node scripts/check-database-schema.js`
3. **Test uploads in admin panel**: Verify that upload fields work correctly
4. **Check generated types**: Ensure `bun payload generate:types` runs without errors

### Development Workflow

1. Use Payload's generated migrations as the primary reference
2. Test all migrations on a development database first
3. Always verify upload relationships work in the admin panel
4. Run the comprehensive fix script during deployment

### Database Naming Rules

- **Upload fields**: camelCase field names become `snake_case_id` columns
- **Localized tables**: Always use double underscores (`collection__locales`)
- **Array fields**: Use single underscores (`collection_field_name`)
- **Regular relationships**: Follow Payload's automatic naming
