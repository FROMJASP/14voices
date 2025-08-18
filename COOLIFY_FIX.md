# Coolify Deployment Fix Guide

## Problem Summary

1. **Health Check Issue**: Coolify is ignoring the `coolify.json` health check configuration and using curl instead of wget
2. **Domain Routing Issue**: Coolify generated a wildcard sslip.io domain and the custom domain (14voices.fromjasp.com) isn't working properly

## Solution 1: Health Check Fix

### Option A: Disable Health Checks (Immediate Fix)

1. In Coolify UI, go to your application settings
2. Find the "Health Check" section
3. **Disable health checks entirely** by toggling the health check option off
4. Save and redeploy

### Option B: Install Both curl and wget in Docker

Update the Dockerfile to include both curl AND wget:

```dockerfile
# In Stage 3: Runner (line 59)
RUN apk add --no-cache tini nodejs=~20 wget curl
```

### Option C: Force Coolify to Use Custom Health Check

1. In Coolify UI, go to your application settings
2. Look for "Custom Docker Options" or "Docker Compose Override"
3. Add this configuration:

```yaml
healthcheck:
  disable: false
  test: ['CMD', 'wget', '-q', '-O', '-', 'http://localhost:3000/api/health']
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

## Solution 2: Domain Routing Fix

### Step 1: Remove the Wildcard Domain

1. In Coolify UI, go to your application settings
2. Find the "Domains" section
3. **Delete** the sslip.io domain (fcw844w8ko4g4sssk84sg4wk.138.201.91.107.sslip.io)
4. Clear any cached domain configurations

### Step 2: Properly Configure Custom Domain

1. In the "Domains" field, enter ONLY: `14voices.fromjasp.com`
2. Do NOT include http:// or https://
3. Do NOT click "Generate Domains" - this creates the wildcard domain

### Step 3: Fix Traefik Labels

In the "Custom Docker Options" or "Labels" section, add these exact labels:

```
traefik.enable=true
traefik.http.routers.14voices.rule=Host(`14voices.fromjasp.com`)
traefik.http.routers.14voices.entrypoints=https
traefik.http.routers.14voices.tls=true
traefik.http.routers.14voices.tls.certresolver=letsencrypt
traefik.http.services.14voices.loadbalancer.server.port=3000
```

### Step 4: Force HTTP to HTTPS Redirect

Add these additional labels:

```
traefik.http.routers.14voices-http.rule=Host(`14voices.fromjasp.com`)
traefik.http.routers.14voices-http.entrypoints=http
traefik.http.routers.14voices-http.middlewares=redirect-to-https
traefik.http.middlewares.redirect-to-https.redirectscheme.scheme=https
```

## Complete Working Configuration

### 1. Update Dockerfile (add curl for safety):

```dockerfile
# Line 59 - Install both wget and curl
RUN apk add --no-cache tini nodejs=~20 wget curl
```

### 2. Coolify Application Settings:

**Domains Field:**

```
14voices.fromjasp.com
```

**Custom Labels/Docker Options:**

```
traefik.enable=true
traefik.http.routers.14voices.rule=Host(`14voices.fromjasp.com`)
traefik.http.routers.14voices.entrypoints=https
traefik.http.routers.14voices.tls=true
traefik.http.routers.14voices.tls.certresolver=letsencrypt
traefik.http.services.14voices.loadbalancer.server.port=3000
traefik.http.routers.14voices-http.rule=Host(`14voices.fromjasp.com`)
traefik.http.routers.14voices-http.entrypoints=http
traefik.http.routers.14voices-http.middlewares=redirect-to-https
traefik.http.middlewares.redirect-to-https.redirectscheme.scheme=https
```

**Health Check:** Either disable it or use:

```yaml
test: ['CMD', 'wget', '-q', '-O', '-', 'http://localhost:3000/api/health']
interval: 30s
timeout: 10s
retries: 3
start_period: 60s
```

### 3. DNS Configuration:

Ensure your DNS points to your Coolify server:

```
14voices.fromjasp.com -> A Record -> 138.201.91.107
```

## Deployment Steps:

1. Update the Dockerfile to include curl
2. Commit and push changes
3. In Coolify:
   - Delete the sslip.io domain
   - Set domain to `14voices.fromjasp.com` only
   - Add all the Traefik labels
   - Either disable health checks or configure custom health check
   - Save all settings
4. Trigger a new deployment
5. Monitor logs for any Traefik errors

## Verification:

After deployment:

1. Check Traefik logs for proper route registration
2. Test https://14voices.fromjasp.com
3. Verify SSL certificate is issued
4. Check application logs for any errors

## If Issues Persist:

1. **Check Traefik Configuration**:

   ```bash
   docker exec -it coolify-proxy cat /etc/traefik/traefik.yml
   ```

2. **Verify Route Registration**:

   ```bash
   docker exec -it coolify-proxy traefik version
   ```

3. **Force Route Refresh**:
   - Stop the application in Coolify
   - Clear all domain settings
   - Save
   - Re-add domain and labels
   - Start application

4. **Alternative Health Check Disable**:
   If health checks still cause issues, add this to your Dockerfile:
   ```dockerfile
   HEALTHCHECK NONE
   ```
