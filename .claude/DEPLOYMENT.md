# DEPLOYMENT.md - 14voices Deployment Procedures

## Database Migrations

### When to Run Migrations
Run migrations whenever:
- Adding new collections (like Voiceovers)
- Modifying collection fields
- Changing field types or constraints
- Adding/removing indexes or enums

### Production Migration Steps

#### Option 1: Local Migration to Production DB
```bash
# Set production database URL temporarily
export DATABASE_URL="your-production-database-url"

# Generate migration
npx payload migrate:create describe_your_changes

# Review generated migration in src/migrations/

# Run migration on production
npx payload migrate

# Unset the env var
unset DATABASE_URL
```

#### Option 2: Direct Migration via Payload Admin
1. Deploy code first (without migrations in build)
2. Access /admin on production
3. Payload will prompt for migrations
4. Review and apply through UI

#### Option 3: Vercel Postgres Console
1. Go to Vercel Dashboard > Storage > Your Database
2. Click "Query" tab
3. Run the migration SQL directly

### Current Migration Status
- Users collection: ✅ Migrated
- Media collection: ✅ Migrated (supports images + audio)
- Voiceovers collection: ⚠️ Needs migration on production

### Pending Production Migration
Run this SQL on production database:
```sql
-- Create enum for voiceover style tags
CREATE TYPE "enum_voiceovers_style_tags_tag" AS ENUM (
  'autoriteit',
  'jeugdig-fris',
  'kwaliteit',
  'stoer',
  'warm-donker',
  'zakelijk',
  'custom'
);

-- Create enum for voiceover status
CREATE TYPE "enum_voiceovers_status" AS ENUM (
  'active',
  'draft',
  'more-voices',
  'archived'
);

-- Create voiceovers table
CREATE TABLE IF NOT EXISTS "voiceovers" (
  "id" serial PRIMARY KEY,
  "name" varchar NOT NULL,
  "description" varchar,
  "image_id" integer,
  "status" "enum_voiceovers_status" DEFAULT 'draft' NOT NULL,
  "availability_is_available" boolean DEFAULT true,
  "availability_unavailable_from" timestamp(3) with time zone,
  "availability_unavailable_until" timestamp(3) with time zone,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

-- Create style tags relation table
CREATE TABLE IF NOT EXISTS "voiceovers_style_tags" (
  "id" serial PRIMARY KEY,
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "tag" "enum_voiceovers_style_tags_tag" NOT NULL,
  "custom_tag" varchar
);

-- Create demos relation table
CREATE TABLE IF NOT EXISTS "voiceovers_demos" (
  "id" serial PRIMARY KEY,
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "demo_file_id" integer NOT NULL,
  "title" varchar
);

-- Add foreign key constraints
ALTER TABLE "voiceovers" ADD CONSTRAINT "voiceovers_image_id_media_id_fk" 
  FOREIGN KEY ("image_id") REFERENCES "media"("id") ON DELETE SET NULL;

ALTER TABLE "voiceovers_style_tags" ADD CONSTRAINT "voiceovers_style_tags_parent_id_fk" 
  FOREIGN KEY ("_parent_id") REFERENCES "voiceovers"("id") ON DELETE CASCADE;

ALTER TABLE "voiceovers_demos" ADD CONSTRAINT "voiceovers_demos_parent_id_fk" 
  FOREIGN KEY ("_parent_id") REFERENCES "voiceovers"("id") ON DELETE CASCADE;

ALTER TABLE "voiceovers_demos" ADD CONSTRAINT "voiceovers_demos_demo_file_id_media_id_fk" 
  FOREIGN KEY ("demo_file_id") REFERENCES "media"("id") ON DELETE SET NULL;

-- Create indexes
CREATE INDEX "voiceovers_image_idx" ON "voiceovers" ("image_id");
CREATE INDEX "voiceovers_status_idx" ON "voiceovers" ("status");
CREATE INDEX "voiceovers_created_at_idx" ON "voiceovers" ("created_at");
CREATE INDEX "voiceovers_style_tags_order_idx" ON "voiceovers_style_tags" ("_order");
CREATE INDEX "voiceovers_style_tags_parent_id_idx" ON "voiceovers_style_tags" ("_parent_id");
CREATE INDEX "voiceovers_demos_order_idx" ON "voiceovers_demos" ("_order");
CREATE INDEX "voiceovers_demos_parent_id_idx" ON "voiceovers_demos" ("_parent_id");
CREATE INDEX "voiceovers_demos_demo_file_idx" ON "voiceovers_demos" ("demo_file_id");
```

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