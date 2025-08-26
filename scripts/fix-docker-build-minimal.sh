#!/bin/bash

# Minimal fix for Docker build issues
# This script creates a simplified deployment approach

echo "Creating minimal fix for Docker deployment..."

# Create a simple startup script that bypasses complex migrations
cat > /tmp/simple-start.sh << 'EOF'
#!/bin/sh

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting 14voices application..."

# Check if we're in build environment
if echo "$DATABASE_URL" | grep -q "fake:fake@fake"; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Build environment detected, skipping startup"
  exit 0
fi

# Wait for database
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Waiting for database..."
max_retries=30
retry_count=0

while [ $retry_count -lt $max_retries ]; do
  if PGPASSWORD="${DATABASE_PASSWORD}" psql -h "${DATABASE_HOST}" -U "${DATABASE_USER}" -d "${DATABASE_NAME}" -c "SELECT 1" > /dev/null 2>&1; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Database is ready!"
    break
  fi
  
  retry_count=$((retry_count + 1))
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Waiting for database... ($retry_count/$max_retries)"
  sleep 2
done

if [ $retry_count -eq $max_retries ]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: Database connection timeout"
  exit 1
fi

# Start the application directly without migrations
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting Next.js application..."
exec bun run start
EOF

chmod +x /tmp/simple-start.sh

echo "Minimal fix created at /tmp/simple-start.sh"
echo ""
echo "To use this fix:"
echo "1. Replace the ENTRYPOINT in your Dockerfile with:"
echo "   ENTRYPOINT [\"/tmp/simple-start.sh\"]"
echo "2. Remove the CMD line"
echo "3. Rebuild and redeploy"
echo ""
echo "This bypasses migrations temporarily to get the app running."
echo "You can run migrations manually after deployment is stable."