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

# First, ensure tsx is available
if ! command -v tsx &> /dev/null; then
  echo "📦 Installing tsx for TypeScript support..."
  npm install -g tsx
fi

# Run migrations using tsx to handle TypeScript
if npx tsx ./scripts/run-migrations.js; then
  echo "✅ Database migration completed successfully"
  
  # Run seeding if needed
  if [ -n "$ADMIN_EMAIL" ] && [ -n "$ADMIN_PASSWORD" ]; then
    echo "🌱 Checking if seeding is needed..."
    npx tsx -e "
      const { seed } = require('./src/seed/index.ts');
      seed().catch(err => {
        console.error('Seeding error:', err);
        process.exit(1);
      });
    " || echo "⚠️  Seeding skipped or already completed"
  fi
else
  echo "❌ Database migration failed!"
  exit 1
fi

# Start the application
echo "Starting Next.js application..."
exec "$@"