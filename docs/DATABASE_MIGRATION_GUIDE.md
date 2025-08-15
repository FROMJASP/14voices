# Database Migration Guide

## Quick Start - Fix 404 Errors

Your app is running but showing 404 errors because the database is empty. Here's how to fix it:

### Method 1: Using Coolify Terminal (Easiest)

1. **Go to Coolify Dashboard**
   - Navigate to your 14voices application
   - Click on the "Terminal" tab

2. **Run Migrations**

   ```bash
   # Create all database tables
   bun payload migrate

   # Check migration status
   bun payload migrate:status

   # Optional: Seed initial data (creates admin user)
   bun run seed
   ```

### Method 2: SSH into Server

1. **SSH into your server**

   ```bash
   ssh root@138.201.91.107
   ```

2. **Find your container**

   ```bash
   docker ps | grep 14voices
   ```

3. **Access the container**

   ```bash
   docker exec -it [container-name] sh
   ```

4. **Run the setup script**

   ```bash
   # If the script exists in container
   ./scripts/setup-production-db.sh

   # Or run commands manually
   bun payload migrate
   bun run seed  # Optional
   ```

## What This Does

The migration command will:

- Create all Payload CMS tables (users, media, voiceovers, etc.)
- Set up proper indexes and relationships
- Create the database structure your app expects

The seed command (optional) will:

- Create an initial admin user
- Add sample voiceovers and content
- Set up default site settings

## Verification

After running migrations:

1. **Check the homepage**: https://14voices.com should load without 404
2. **Access admin panel**: https://14voices.com/admin
3. **Login with seeded admin** (if you ran seed):
   - Email: From ADMIN_EMAIL env var
   - Password: From ADMIN_PASSWORD env var

## Troubleshooting

### Migration Fails

If migrations fail, check:

- Database connection string is correct
- Database user has CREATE TABLE permissions
- No existing conflicting tables

### Still Getting 404s

If pages still show 404 after migration:

- Check logs: `docker logs [container-name]`
- Verify tables were created: Run `bun payload migrate:status`
- Ensure at least one page exists with slug 'home'

### Can't Access Admin

If /admin shows 404 or error:

- Ensure migrations completed successfully
- Check that at least one user exists
- Verify PAYLOAD_SECRET env var is set

## Next Steps

After successful migration:

1. **SSL Certificate**: Fix the HTTPS warning
2. **Data Migration**: If you have data from old Neon database
3. **Configure Content**: Add your production content via admin panel
