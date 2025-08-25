# Coolify Deployment Guide for 14voices

This guide provides comprehensive instructions for deploying 14voices on Coolify with proper environment variable configuration.

## Prerequisites

1. A running Coolify instance
2. A PostgreSQL database (can be created in Coolify)
3. (Optional) MinIO or S3-compatible storage for media files
4. (Optional) Redis for caching

## Environment Variables Configuration

### Required Variables

Configure these in your Coolify application settings under "Environment Variables":

```bash
# Database (CRITICAL - must be exact)
DATABASE_URL=postgresql://username:password@database-host:5432/database-name

# Payload CMS Secret (minimum 32 characters)
PAYLOAD_SECRET=your-very-long-secret-key-minimum-32-characters

# Application URL (Coolify will auto-populate this)
NEXT_PUBLIC_SERVER_URL=https://your-app.coolify-domain.com

# Email Service
RESEND_API_KEY=re_xxxxxxxxxxxx

# Security
CSRF_SECRET=different-secret-from-payload-secret-min-32-chars
```

### Optional Variables

```bash
# Admin User (for automatic creation on first deploy)
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=strong-password-min-16-characters

# S3/MinIO Storage (if using file uploads)
S3_ENDPOINT=https://minio.yourdomain.com
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
S3_BUCKET=fourteenvoices-media
S3_REGION=us-east-1

# Redis (for caching - optional)
REDIS_URL=redis://redis-host:6379

# Stripe (if using payments)
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
```

## Database Setup

### Option 1: Using Coolify's PostgreSQL Service

1. In Coolify, create a new PostgreSQL service
2. Note the connection details provided
3. Use these in your DATABASE_URL:
   ```
   postgresql://postgres:generated-password@postgres-service-name:5432/postgres
   ```

### Option 2: External Database

Use any PostgreSQL 14+ database. The application will automatically:

- Run all necessary migrations on first deployment
- Create required tables and indexes
- Set up the schema correctly

## Deployment Steps

### 1. Create New Application in Coolify

1. Go to your Coolify dashboard
2. Click "New Application"
3. Choose "Docker Compose" or "Dockerfile" deployment
4. Connect your Git repository

### 2. Configure Build Settings

Set these build configurations:

- **Build Pack**: Dockerfile
- **Dockerfile Location**: `./Dockerfile` (in repository root)
- **Port**: 3000

### 3. Set Environment Variables

⚠️ **CRITICAL**: Enter environment variables exactly as shown above. Common issues:

- **DO NOT** include quotes around values
- **DO NOT** add `DATABASE_URL=` prefix to the DATABASE_URL value
- **DO** ensure DATABASE_URL starts with `postgresql://`
- **DO** use strong secrets (32+ characters) for PAYLOAD_SECRET and CSRF_SECRET

### 4. Configure Domain

1. Set your domain in Coolify
2. Enable HTTPS (Let's Encrypt)
3. The `NEXT_PUBLIC_SERVER_URL` will be automatically set by Coolify

### 5. Deploy

1. Click "Deploy"
2. Monitor the deployment logs
3. The application will:
   - Build the Next.js application
   - Run database migrations automatically
   - Create admin user if ADMIN_EMAIL/PASSWORD provided
   - Start the application

## Monitoring Deployment

### Expected Log Output

A successful deployment will show:

```
===================================
14voices Docker Container Starting
===================================
Detected Coolify deployment
Running Coolify initialization...
[INFO] Validating environment variables...
[SUCCESS] Environment validation passed
[INFO] Waiting for database connection...
[SUCCESS] Database connection established
[INFO] Running Payload migrations...
[SUCCESS] Payload migrations completed
[INFO] Generating import map...
[SUCCESS] Import map generated
[SUCCESS] Coolify initialization completed successfully!
===================================
Starting Next.js application...
NEXT_PUBLIC_SERVER_URL: https://your-app.coolify-domain.com
===================================
```

### Common Issues and Solutions

#### 1. Database Connection Errors

**Symptom**: `Database connection failed after 30 attempts`

**Solutions**:

- Verify DATABASE_URL format is exactly: `postgresql://user:pass@host:5432/dbname`
- Check if database service is running
- Ensure no special characters in password need URL encoding
- Verify network connectivity between app and database containers

#### 2. Server Components Render Error

**Symptom**: Blank page with "Application error" or digest error

**Solution**: The application now has comprehensive error handling. If you still see errors:

- Check deployment logs for specific errors
- Ensure all required environment variables are set
- Try redeploying after database is fully initialized

#### 3. Wrong URL in Production

**Symptom**: App tries to connect to localhost:3000

**Solutions**:

- Ensure NEXT_PUBLIC_SERVER_URL is set in Coolify
- The app will auto-detect Coolify's assigned URL
- Check `/runtime-config.json` is being generated

#### 4. Admin Login Issues

**Symptom**: Can't log in with provided admin credentials

**Solutions**:

- Admin is only created on first deployment
- Check logs for "Admin user created" message
- Password must match what you set in ADMIN_PASSWORD exactly
- Use the email from ADMIN_EMAIL to log in

## Post-Deployment

### 1. Verify Installation

1. Visit your application URL
2. Check that the homepage loads
3. Navigate to `/admin` and log in
4. Verify all pages load correctly

### 2. Configure Payload CMS

1. Log into admin panel at `/admin`
2. Set up your content:
   - Homepage settings
   - Voiceover profiles
   - Service pages
   - Contact information

### 3. Set Up Storage (if using file uploads)

If using MinIO/S3:

1. Ensure S3 environment variables are set
2. Create the bucket specified in S3_BUCKET
3. Test file uploads in the admin panel

## Troubleshooting

### Enable Debug Mode

Add these environment variables for more detailed logs:

```bash
DEBUG=payload:*
NODE_ENV=development  # Only for debugging, switch back to production
```

### Manual Database Migration

If automatic migrations fail, SSH into your container:

```bash
# Run migrations manually
node scripts/coolify-init.js

# Or use Payload CLI directly
npx payload migrate
```

### Reset Admin Password

If you need to reset the admin password:

```bash
# SSH into container
node scripts/reset-admin-access.js
```

## Security Checklist

- [ ] Strong PAYLOAD_SECRET (32+ characters)
- [ ] Different CSRF_SECRET from PAYLOAD_SECRET
- [ ] Strong admin password
- [ ] HTTPS enabled in Coolify
- [ ] Database credentials are secure
- [ ] No sensitive data in logs

## Support

For issues specific to:

- **Coolify**: Check Coolify documentation and community
- **14voices**: Check the repository issues
- **Payload CMS**: Refer to Payload v3 documentation

Remember: The application is designed to be self-healing and will retry failed operations. Most issues resolve themselves after the initial deployment completes.
