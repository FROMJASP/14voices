# Coolify Deployment Fix Guide

## Issues Identified and Solutions

### 1. SSL Certificate Issue (FIXED)

The domain was showing "ERR_CERT_AUTHORITY_INVALID" because the Traefik labels were misconfigured.

**Solution**: Use the correct Traefik labels from `coolify-labels.txt`

### 2. DATABASE_URL Parsing Issue (FIXED)

Coolify was setting environment variables with the format "DATABASE_URL=DATABASE_URL=postgresql://..."

**Solution**: The `docker-entrypoint-fixed.sh` script now cleans all environment variables automatically.

### 3. Migration Script Failures (FIXED)

The migration scripts were failing due to ESM/CJS module conflicts.

**Solution**: Created `run-migrations-simple.js` that handles migrations gracefully.

### 4. Long Build Times

The Docker build takes 5+ minutes due to:

- Installing dependencies twice
- Running heavy build processes
- Copying large node_modules

**Solution**: See optimization steps below.

## Immediate Actions Required in Coolify

### 1. Update Container Labels

In your Coolify application settings, replace ALL container labels with:

```
traefik.enable=true
traefik.http.routers.http-0-fcw844w8ko4g4sssk84sg4wk.entryPoints=http
traefik.http.routers.http-0-fcw844w8ko4g4sssk84sg4wk.rule=Host(`14voices.fromjasp.com`)
traefik.http.routers.http-0-fcw844w8ko4g4sssk84sg4wk.service=http-0-fcw844w8ko4g4sssk84sg4wk
traefik.http.routers.https-0-fcw844w8ko4g4sssk84sg4wk.entryPoints=https
traefik.http.routers.https-0-fcw844w8ko4g4sssk84sg4wk.rule=Host(`14voices.fromjasp.com`)
traefik.http.routers.https-0-fcw844w8ko4g4sssk84sg4wk.service=http-0-fcw844w8ko4g4sssk84sg4wk
traefik.http.routers.https-0-fcw844w8ko4g4sssk84sg4wk.tls=true
traefik.http.routers.https-0-fcw844w8ko4g4sssk84sg4wk.tls.certresolver=letsencrypt
traefik.http.services.http-0-fcw844w8ko4g4sssk84sg4wk.loadbalancer.server.port=3000
traefik.http.middlewares.redirect-to-https.redirectscheme.scheme=https
traefik.http.routers.http-0-fcw844w8ko4g4sssk84sg4wk.middlewares=redirect-to-https
traefik.http.middlewares.gzip.compress=true
traefik.http.routers.https-0-fcw844w8ko4g4sssk84sg4wk.middlewares=gzip
```

### 2. Check Environment Variables

Make sure your environment variables in Coolify are set correctly WITHOUT the "VAR_NAME=" prefix:

❌ WRONG: `DATABASE_URL=DATABASE_URL=postgresql://...`
✅ CORRECT: `DATABASE_URL=postgresql://...`

### 3. Add Migration Skip Flag (Temporary)

Add this environment variable to skip migrations during startup:

```
SKIP_MIGRATIONS=true
```

After the app is running, you can trigger migrations manually via SSH.

### 4. Health Check Configuration

Make sure the health check is configured as:

- Path: `/api/health`
- Method: GET
- Interval: 30s
- Timeout: 10s
- Retries: 3
- Start period: 60s

## SSH Commands to Run After Deployment

Once the container is running, SSH into your server and run:

```bash
# Find your container
docker ps | grep fcw844w8ko4g4sssk84sg4wk

# Run migrations manually
docker exec -it <container_id> npx payload migrate

# Check logs
docker logs -f <container_id>
```

## Optimizing Build Time

To reduce the 5-minute build time:

1. **Use Docker Build Cache**
   - Ensure Coolify is configured to use Docker build cache
   - Don't change package.json unnecessarily

2. **Pre-built Base Image**
   Create a base image with dependencies:

   ```dockerfile
   FROM oven/bun:1.1.38-alpine AS base
   WORKDIR /app
   COPY package.json bun.lockb ./
   RUN bun install --frozen-lockfile
   ```

   Push this to a registry and use it as your base.

3. **Skip Redundant Steps**
   - The current Dockerfile installs sharp twice
   - Consider using a multi-stage build more efficiently

## Recommended Next Steps

1. **Commit the fixes**:

   ```bash
   git add -A
   git commit -m "fix: Coolify deployment issues - SSL, env vars, and migrations"
   git push origin main
   ```

2. **In Coolify**:
   - Update the container labels (copy from coolify-labels.txt)
   - Add SKIP_MIGRATIONS=true to environment variables
   - Trigger a new deployment

3. **After deployment**:
   - SSH into the server
   - Run migrations manually
   - Remove SKIP_MIGRATIONS environment variable
   - Redeploy

## Alternative: Use Pre-built Docker Image

Instead of building on every deployment, consider:

1. Build locally: `docker build -t ghcr.io/fromjasp/14voices:latest .`
2. Push to GitHub Container Registry
3. Configure Coolify to use the pre-built image

This would reduce deployment time from 5 minutes to under 30 seconds.
