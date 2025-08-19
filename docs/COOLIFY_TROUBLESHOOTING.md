# Coolify Deployment Troubleshooting

## "No Available Server" Error Despite Successful Deployment

If your deployment shows as successful and healthy in Coolify but you see "no available server" when visiting your domain, this is usually a proxy/networking issue rather than an application problem.

### Quick Checklist

1. **Verify Container is Running**
   - In Coolify, go to your application
   - Check that the container status shows as "Running"
   - Look for the container ID (e.g., `fcw844w8ko4c0kkso08c84sg4wk-175356148967`)

2. **Check Application Logs**
   - Click on "Logs" in your Coolify application
   - Look for "Starting Next.js application..." message
   - Verify no errors during startup
   - Check if the app is listening on port 3000

3. **Verify Domain Configuration**
   - In Coolify application settings, check:
     - Domain is set correctly (e.g., `https://14voices.fromjasp.com`)
     - Port is set to 3000
     - "Generate SSL Certificate" is enabled
     - "Force HTTPS" is enabled if using SSL

4. **Check Proxy Settings**
   - Ensure "Proxy" is enabled in your application settings
   - If using custom proxy settings, verify they're correct
   - Default proxy settings should work for most Next.js apps

5. **Test Direct Container Access**
   - In Coolify terminal for your server, run:
   ```bash
   # Replace with your actual container ID
   docker exec -it <container-id> wget -O- http://localhost:3000/api/health
   ```

   - This tests if the app is responding inside the container

### Common Fixes

#### 1. Restart Coolify Proxy

Sometimes the Coolify proxy needs to be restarted to pick up new applications:

```bash
# SSH into your Coolify server
docker restart coolify-proxy
```

#### 2. Check Proxy Configuration

Verify the proxy is correctly configured for your application:

```bash
# List all proxy configurations
docker exec coolify-proxy cat /etc/caddy/Caddyfile | grep -A 5 "14voices"
```

#### 3. Force Redeploy

Sometimes a fresh deployment helps:

1. In Coolify, go to your application
2. Click "Force Redeploy"
3. Wait for deployment to complete

#### 4. Check DNS Resolution

Ensure your domain points to the correct server:

```bash
# From your local machine
nslookup 14voices.fromjasp.com
ping 14voices.fromjasp.com
```

#### 5. Verify Port Mapping

In your Coolify application settings:

- Ports should be set to "3000:3000" or just "3000"
- Ensure no other service is using port 3000

### Advanced Debugging

#### Check Container Network

```bash
# SSH into Coolify server
# Find your container
docker ps | grep 14voices

# Inspect container network settings
docker inspect <container-id> | grep -A 20 "NetworkSettings"
```

#### Test Container Health Check

```bash
# Check if health check is passing
docker inspect <container-id> | grep -A 10 "Health"
```

#### View Proxy Logs

```bash
# Check Coolify proxy logs for errors
docker logs coolify-proxy --tail 100 | grep -i error
```

### Environment Variable Issues

If the app starts but can't connect to the database:

1. **Verify DATABASE_URL Format**
   - Should NOT include "DATABASE_URL=" prefix
   - Format: `postgresql://user:pass@host:5432/dbname`

2. **Check All Required Variables**

   ```
   DATABASE_URL
   PAYLOAD_SECRET
   NEXT_PUBLIC_SERVER_URL
   CSRF_SECRET
   ```

3. **Test Database Connection**
   ```bash
   # From application container
   docker exec -it <container-id> node -e "
   const { Pool } = require('pg');
   const pool = new Pool({ connectionString: process.env.DATABASE_URL });
   pool.query('SELECT 1').then(() => console.log('DB OK')).catch(console.error);
   "
   ```

### If Nothing Works

1. **Check Coolify Version**
   - Ensure you're running a recent version of Coolify
   - Update if necessary

2. **Review Application Settings**
   - Take a screenshot of all your application settings
   - Verify each setting matches the expected values

3. **Check Server Resources**
   - Ensure the server has enough memory/CPU
   - Check disk space: `df -h`

4. **Contact Support**
   - Coolify Discord/GitHub for Coolify-specific issues
   - Application logs and error messages will help diagnose

### Known Working Configuration

For reference, here's a known working configuration:

**Application Settings:**

- Build Pack: Dockerfile
- Port: 3000
- Domain: https://yourdomain.com
- Generate SSL: Yes
- Force HTTPS: Yes
- Proxy: Enabled

**Environment Variables:**

- All variables set without quotes
- No "VAR=" prefix in the values
- Secrets properly generated

**Health Check:**

- Path: /api/health
- Interval: 30s
- Timeout: 10s
- Retries: 3
