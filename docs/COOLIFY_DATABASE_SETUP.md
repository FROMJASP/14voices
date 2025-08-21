# Coolify Database Setup for 14voices (Simplified)

## ⚠️ CRITICAL: Database Hostname Issue

**The most common deployment error is using the wrong database hostname!**

In Coolify, the database hostname is NOT the service name you gave it. Coolify generates a unique hostname.

1. Go to your PostgreSQL database in Coolify
2. Look for **"Internal Connection URL"**
3. The hostname will be a random string (NOT `fourteenvoices-db`)
4. Copy the entire Internal Connection URL and use it as your DATABASE_URL

## Simplified Migration Process

The application now uses a **single migration script** that handles all database setup automatically. No more complex migration procedures!

## Quick Fix for Current Deployment Issue

Based on your Coolify PostgreSQL setup, here's what you need to do:

### 1. Set Environment Variables in Coolify

In your 14voices application settings in Coolify, add these environment variables:

```env
# Database Connection
# Use the Internal Connection URL from your Coolify PostgreSQL database
# Format: postgresql://username:password@hostname:5432/database
DATABASE_URL=<copy-internal-url-from-coolify-database-settings>

# Required Payload/Next.js Settings
PAYLOAD_SECRET=your-secret-key-here
NEXT_PUBLIC_SERVER_URL=https://14voices.fromjasp.com
CSRF_SECRET=different-secret-from-payload-secret

# Email
RESEND_API_KEY=re_your_actual_resend_key

# Storage (if using MinIO in Coolify)
S3_ENDPOINT=http://minio-14voices:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=your-minio-password
S3_BUCKET=fourteenvoices-media
S3_REGION=us-east-1

# Admin Credentials (for initial setup)
ADMIN_EMAIL=admin@14voices.com
ADMIN_PASSWORD=your-secure-admin-password
```

### 2. Database Connection Details

From your Coolify screenshot, I can see:

- **Database Name**: `fourteenvoices-db`
- **Username**: `fourteenvoices`
- **Password**: (hidden in screenshot - use the password you set)
- **Initial Database**: `postgres`
- **Internal Network Name**: `fourteenvoices-db` (this is what your app uses to connect)

### 3. Deploy the Fixed Application

With the changes I've made to the codebase:

1. **Commit and push the changes**:

   ```bash
   git add .
   git commit -m "fix: resolve Payload migration TypeScript config issue for Coolify deployment"
   git push origin main
   ```

2. **In Coolify**: Click "Redeploy" to trigger a new deployment

### 4. What the Fix Does

The deployment was failing because Payload couldn't find TypeScript configuration files during migration. I've fixed this by:

1. **Copying required config files** to the Docker production image
2. **Creating a custom migration script** that handles TypeScript properly
3. **Updating the entrypoint** to use the new migration approach
4. **Adding automatic database setup** that creates all necessary tables

### 5. Verifying the Deployment

Once deployed, the application will:

1. Wait for the database to be ready
2. Run Payload migrations automatically
3. Create all necessary database tables
4. Seed initial admin user (if database is empty)
5. Start the application

### 6. Troubleshooting

If you still see issues:

1. **Check Coolify logs** for the application
2. **Verify environment variables** are set correctly
3. **Fix "getaddrinfo EAI_AGAIN" error**:
   - This error means the database hostname cannot be resolved
   - In Coolify, go to your PostgreSQL database settings
   - Look for "Internal Connection URL" - it shows the exact hostname
   - The hostname is NOT just `fourteenvoices-db`, it includes a unique suffix
   - Example: `fourteenvoices-db-abc123` (where abc123 is a random ID)
   - Update your DATABASE_URL with the correct hostname from Coolify

4. **Check database connectivity** from the application container:
   ```bash
   # In Coolify terminal for the app
   # Replace <actual-hostname> with the hostname from Coolify's Internal Connection URL
   pg_isready -h <actual-hostname> -p 5432 -U fourteenvoices
   ```

### 7. Migration from Cloud Providers (Optional)

If you have existing data from Neon, Vercel, or other providers:

1. **Export from existing database**:

   ```bash
   pg_dump YOUR_NEON_DATABASE_URL > neon_backup.sql
   ```

2. **Import to Coolify PostgreSQL**:
   ```bash
   # Connect to Coolify server
   docker exec -i fourteenvoices-db psql -U fourteenvoices -d postgres < neon_backup.sql
   ```

## Summary

The main issue was that Payload migrations couldn't find TypeScript configuration in the production Docker environment. This has been fixed by:

- Including necessary config files in the Docker image
- Creating a robust migration script that handles TypeScript
- Ensuring automatic database setup on first deployment

Your application should now deploy successfully with the Coolify PostgreSQL database!
