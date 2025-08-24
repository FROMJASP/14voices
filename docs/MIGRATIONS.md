# Database Migrations

This document explains how database migrations work in the 14voices application.

## Overview

The application uses Payload CMS's built-in migration system to keep the database schema in sync with collection definitions. This ensures that:

1. **Schema changes are automatically applied** - When you modify a collection, the database schema is updated on deployment
2. **No manual SQL required** - Payload handles creating tables, columns, indexes, and relationships
3. **Zero downtime deployments** - Migrations run before the new application version starts

## How It Works

### Automatic Schema Sync

During deployment, the following happens:

1. **Migration Generation** - A migration file is generated that captures any schema differences
2. **Payload Migrations** - `npx payload migrate` runs, which:
   - Creates any missing tables
   - Adds new columns to existing tables
   - Creates array/block field tables
   - Sets up relationships and indexes
   - Manages localization tables

3. **Verification** - The migration system verifies all changes were applied successfully

### Migration Scripts

- **`scripts/run-payload-migrations.js`** - Wrapper that runs Payload's migration command with proper error handling
- **`scripts/generate-schema-migration.js`** - Generates migration files for schema changes
- **`src/migrations/`** - Directory containing migration files

### Docker Entrypoint

The `docker-entrypoint.sh` script automatically:

1. Waits for database connectivity
2. Generates any needed migrations
3. Runs Payload migrations
4. Applies any additional fixes

## Adding New Fields

When you add fields to a collection:

1. **Development** - Just reload the app, Payload auto-migrates in dev mode
2. **Production** - Migrations run automatically on deployment

Example: Adding a field to Pages collection

```typescript
// In src/collections/Pages.ts
{
  name: 'featured',
  type: 'checkbox',
  defaultValue: false,
}
```

On deployment, Payload will automatically:

- Add the `featured` column to the `pages` table
- Set the default value for existing rows

## Complex Field Types

### Array Fields

```typescript
{
  name: 'sections',
  type: 'array',
  fields: [/* ... */]
}
```

Creates a separate `pages_sections` table with foreign key relationship.

### Group Fields

```typescript
{
  name: 'hero',
  type: 'group',
  fields: [/* ... */]
}
```

Adds prefixed columns to the main table (e.g., `hero_title`, `hero_subtitle`).

### Relationship Fields

```typescript
{
  name: 'author',
  type: 'relationship',
  relationTo: 'users',
}
```

Adds `author_id` column with foreign key constraint.

## Manual Migrations

For complex migrations, create a file in `src/migrations/`:

```typescript
// src/migrations/2025_01_22_custom_migration.ts
import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres';
import { sql } from 'drizzle-orm';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Your SQL here
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Rollback logic (optional)
}
```

## Troubleshooting

### Missing Columns Error

If you see errors like `column pages.hero_type does not exist`:

1. **Check deployment logs** - Migrations should run automatically
2. **Manual fix** - SSH into container and run:
   ```bash
   npx payload migrate
   ```

### Migration Failures

If migrations fail during deployment:

1. The app will still start (non-blocking)
2. Check logs for specific errors
3. Most issues are transient and resolve on next deployment

### Verifying Schema

To check if schema is in sync:

```bash
# In the container
node scripts/check-database-schema.js
```

## Best Practices

1. **Test locally first** - Run the app locally to verify field changes work
2. **Use defaults** - Always provide default values for new required fields
3. **Avoid breaking changes** - Don't rename or remove fields without migration
4. **Monitor logs** - Check deployment logs to confirm migrations succeeded

## Emergency Fixes

If you need to manually fix the schema:

```bash
# SSH into the container
docker exec -it <container-id> sh

# Run migrations
npx payload migrate

# Or run specific fix scripts
node scripts/fix-production-comprehensive.js
```

Remember: The goal is zero manual intervention. If you find yourself running manual fixes often, please update the migration scripts to handle those cases automatically.
