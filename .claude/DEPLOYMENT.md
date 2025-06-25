# DEPLOYMENT.md - 14voices Deployment Procedures

## Database Migrations

### Quick Migration Process for New Collections

When adding new collections or modifying existing ones:

1. **Develop locally** with your local database
2. **Test thoroughly** to ensure the schema is correct
3. **Deploy code** to production (push to main)
4. **Run migration** on production database using Neon SQL Editor

### Step-by-Step for New Collections

1. **Create collection locally**:
   ```bash
   # Create your collection file in src/collections/
   # Add it to payload.config.ts
   # Test locally with npm run dev
   ```

2. **Generate migration SQL**:
   ```bash
   # After confirming it works locally, check the database schema
   # You can use Payload's generated types or inspect your local DB
   ```

3. **Deploy and migrate**:
   - Push code to main branch
   - Wait for Vercel deployment to complete
   - Go to Neon Console > SQL Editor
   - Run the migration SQL

### Known Issues & Solutions

**Issue**: `payload migrate` command fails with ERR_MODULE_NOT_FOUND
**Solution**: Run migrations manually via Neon SQL Editor

**Issue**: Migrations can't run during Vercel build
**Solution**: Run migrations after deployment, not during build

### Migration Template

For new collections, use this template:
```sql
-- Create enums (if needed)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_[collection]_[field]') THEN
        CREATE TYPE "enum_[collection]_[field]" AS ENUM ('value1', 'value2');
    END IF;
END$$;

-- Create main table
CREATE TABLE IF NOT EXISTS "[collection]" (
  "id" serial PRIMARY KEY,
  -- your fields here
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

-- Create relation tables (if needed)
CREATE TABLE IF NOT EXISTS "[collection]_[relation]" (
  "id" serial PRIMARY KEY,
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  -- relation fields
);

-- Add constraints
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '[constraint_name]') THEN
        ALTER TABLE "[table]" ADD CONSTRAINT "[constraint_name]" 
        FOREIGN KEY ("[field]") REFERENCES "[ref_table]"("id") ON DELETE CASCADE;
    END IF;
END$$;

-- Create indexes
CREATE INDEX IF NOT EXISTS "[index_name]" ON "[table]" ("[field]");
```

### Current Migration Status
- Users collection: ✅ Migrated
- Media collection: ✅ Migrated (supports images + audio)
- Voiceovers collection: ✅ Migrated

## Build Configuration

### Why Migrations Removed from Build
- `payload migrate` requires database connection during build
- Vercel build environment may not have DB access
- ESM module resolution issues with tsx in build environment

### Recommended Approach
1. Run migrations separately from deployment
2. Use GitHub Actions for automated migrations (see below)
3. Or run manually after each deployment

### Future: GitHub Actions for Auto-Migration
```yaml
name: Run Migrations
on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npx payload migrate
        env:
          DATABASE_URL: ${{ secrets.PRODUCTION_DATABASE_URL }}
```

## Environment Variables

### Required for Production
- `DATABASE_URL` or `POSTGRES_URL`: PostgreSQL connection string
- `PAYLOAD_SECRET`: Secret for Payload admin
- `NEXT_PUBLIC_SERVER_URL`: Public URL of the site
- `RESEND_API_KEY`: Email service API key
- `BLOB_READ_WRITE_TOKEN`: Vercel Blob storage token (optional)

### Vercel Configuration
1. Go to Project Settings > Environment Variables
2. Add all required variables
3. Ensure they're available for Production environment

---
*Last updated: 2025-06-25*