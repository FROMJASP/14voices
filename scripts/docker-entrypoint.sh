#!/bin/sh
set -e

echo "==================================="
echo "14voices Docker Container Starting"
echo "==================================="
echo "Time: $(date)"
echo "Node version: $(node --version)"
echo "==================================="

# Wait for database to be ready
echo "Waiting for database..."
MAX_RETRIES=30
RETRY_COUNT=0

until node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT 1')
  .then(() => { console.log('Database ready'); process.exit(0); })
  .catch(() => process.exit(1));
" || [ $RETRY_COUNT -eq $MAX_RETRIES ]; do
  RETRY_COUNT=$((RETRY_COUNT+1))
  echo "Waiting for database... (attempt $RETRY_COUNT/$MAX_RETRIES)"
  sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
  echo "Database connection failed"
  exit 1
fi

# Initialize database with direct script (bypasses Payload migrations)
if [ -f /app/scripts/direct-db-init.js ]; then
  echo "Initializing database..."
  node /app/scripts/direct-db-init.js || echo "Database initialization had issues, continuing..."
fi

# Generate import map (important for Payload admin)
if [ -f /app/scripts/generate-importmap.js ]; then
  echo "Generating import map..."
  node /app/scripts/generate-importmap.js || echo "Import map generation had issues, continuing..."
fi

# Start the application
echo "==================================="
echo "Starting Next.js application..."
echo "SERVER_URL: ${NEXT_PUBLIC_SERVER_URL}"
echo "==================================="
exec "$@"