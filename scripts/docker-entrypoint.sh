#!/bin/sh
set -e

echo "Starting application initialization..."

# Wait for database to be ready
echo "Waiting for database to be ready..."
MAX_RETRIES=30
RETRY_COUNT=0

until node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT 1')
  .then(() => { console.log('Database is ready'); process.exit(0); })
  .catch((err) => { console.log('Database not ready:', err.message); process.exit(1); });
" || [ $RETRY_COUNT -eq $MAX_RETRIES ]; do
  RETRY_COUNT=$((RETRY_COUNT+1))
  echo "Waiting for database... (attempt $RETRY_COUNT/$MAX_RETRIES)"
  sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
  echo "Database connection failed after $MAX_RETRIES attempts"
  exit 1
fi

# Run migrations
echo "Running database migrations..."
cd /app
export PATH="/app/node_modules/.bin:$PATH"

# Use our custom migration script that handles TypeScript configs properly
if node ./scripts/migrate-database.mjs; then
  echo "✅ Database migration and seeding completed successfully"
else
  echo "❌ Database migration failed!"
  exit 1
fi

# Start the application
echo "Starting Next.js application..."
exec "$@"