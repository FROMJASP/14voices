# Database Migration Guide (Simplified)

## Overview

The 14voices application now uses a **single, comprehensive migration script** that handles all database setup automatically. No more confusion about which script to run or missing tables.

## Quick Fix for 404 Errors

If your app is running but showing 404 errors, the database is likely empty. Here's the simple fix:

### Method 1: Automatic Migration (Recommended)

The application should handle this automatically on first deployment. If it didn't work:

```bash
# Access your application container via Coolify terminal or SSH
docker exec -it [container-name] sh

# Run the single migration script
node scripts/payload-migrate.js

# Optional: Seed sample data and admin user
bun run seed
```

### Method 2: Using Payload CLI

```bash
# Access container
docker exec -it [container-name] sh

# Run Payload migrations
bun payload migrate

# Check migration status
bun payload migrate:status

# Optional: Seed data
bun run seed
```

## What the Migration Does

The single migration script (`scripts/payload-migrate.js`):

✅ **Creates all required tables**:

- Core Payload tables (users, media, etc.)
- Voiceover tables with proper relationships
- Email marketing tables
- Form and security tables
- Relationship tables (voiceovers_style_tags, etc.)

✅ **Sets up proper structure**:

- Correct column names (snake_case)
- All required indexes
- Foreign key relationships
- Default values

✅ **Handles edge cases**:

- Safe to run multiple times (idempotent)
- Skips existing tables/columns
- Works in Docker environments
- Proper error handling

## Environment Variables Required

```env
# Database connection (required)
DATABASE_URL=postgresql://user:password@host:5432/database

# Admin seeding (optional)
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure-password
```

## Verification Steps

After running migration:

1. **Check homepage**: `https://yourdomain.com` should load
2. **Access admin**: `https://yourdomain.com/admin`
3. **Login**: Use ADMIN_EMAIL/ADMIN_PASSWORD if seeded
4. **Test uploads**: Try uploading a file in admin
5. **Check health**: `https://yourdomain.com/api/health`

## Troubleshooting

### Migration Fails

```bash
# Check database connection
docker exec container psql $DATABASE_URL -c "SELECT 1;"

# Check for permission issues
docker exec postgres-container psql -U postgres -d fourteenvoices -c "SELECT current_user, session_user;"

# Check existing tables
docker exec postgres-container psql -U postgres -d fourteenvoices -c "\dt"
```

### Still Getting 404s

```bash
# Check if pages exist
docker exec postgres-container psql -U postgres -d fourteenvoices -c "SELECT slug FROM pages LIMIT 5;"

# If no pages, run seeding
docker exec app-container bun run seed

# Check logs for errors
docker logs app-container
```

### Admin Panel Issues

```bash
# Check if users exist
docker exec postgres-container psql -U postgres -d fourteenvoices -c "SELECT email FROM users;"

# Create admin user manually if needed
docker exec app-container bun run seed
```

## Benefits of Simplified Approach

### ❌ Old Way (Complex)

- 22+ migration scripts
- Confusion about execution order
- Missing relationship tables
- Inconsistent approaches
- Hard to debug issues

### ✅ New Way (Simple)

- **Single migration script**
- **Automatic on deployment**
- **All tables created correctly**
- **Idempotent (safe to re-run)**
- **Easy to debug**

## Manual Database Reset (Last Resort)

If you need to completely reset the database:

```bash
# WARNING: This destroys all data!

# Drop and recreate database
docker exec postgres-container psql -U postgres -c "DROP DATABASE fourteenvoices;"
docker exec postgres-container psql -U postgres -c "CREATE DATABASE fourteenvoices;"

# Redeploy application (triggers automatic migration)
# Or run migration manually:
docker exec app-container node scripts/payload-migrate.js
docker exec app-container bun run seed
```

## Migration Script Location

The migration script is located at:

- **File**: `scripts/payload-migrate.js`
- **Purpose**: Single, comprehensive database setup
- **Safe**: Can be run multiple times
- **Complete**: Creates all required tables and relationships

## Next Steps After Successful Migration

1. **Configure SSL**: Ensure HTTPS is working
2. **Test functionality**: Upload files, send emails, create content
3. **Set up backups**: Database and storage backups
4. **Monitor health**: Use `/api/health` endpoints
5. **Add content**: Create your production content via admin panel

For ongoing deployment issues, see the [Deployment Troubleshooting Guide](./DEPLOYMENT_TROUBLESHOOTING.md).
