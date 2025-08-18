# Coolify Database Setup for 14voices

## Quick Fix for Current Deployment Issue

Based on your Coolify PostgreSQL setup, here's what you need to do:

### 1. Set Environment Variables in Coolify

In your 14voices application settings in Coolify, add these environment variables:

```env
# Database Connection
DATABASE_URL=postgresql://fourteenvoices:YOUR_PASSWORD@fourteenvoices-db:5432/postgres

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
3. **Check database connectivity** from the application container:
   ```bash
   # In Coolify terminal for the app
   pg_isready -h fourteenvoices-db -p 5432 -U fourteenvoices
   ```

### 7. Database Migration from Neon (Optional)

If you have existing data in Neon that you want to migrate:

1. **Export from Neon**:

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
