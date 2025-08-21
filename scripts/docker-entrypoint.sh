#!/bin/sh
set -e

echo "Starting application initialization..."

# Debug: Print DATABASE_URL (masked)
echo "DATABASE_URL is set: ${DATABASE_URL:+yes}"
if [ -n "$DATABASE_URL" ]; then
  echo "DATABASE_URL length: $(echo -n "$DATABASE_URL" | wc -c)"
  echo "DATABASE_URL format check: $(echo $DATABASE_URL | sed 's/:\/\/[^@]*@/:\/\/***:***@/g')"
  # Check if DATABASE_URL starts with "DATABASE_URL="
  if echo "$DATABASE_URL" | grep -q "^DATABASE_URL="; then
    echo "ERROR: DATABASE_URL contains 'DATABASE_URL=' prefix!"
    echo "This suggests the environment variable is not being set correctly in Coolify."
    echo "Please check your Coolify environment variable configuration."
    # Try to extract the actual URL
    export DATABASE_URL=$(echo "$DATABASE_URL" | sed 's/^DATABASE_URL=//')
    echo "Attempting to fix by removing prefix..."
    echo "New DATABASE_URL format: $(echo $DATABASE_URL | sed 's/:\/\/[^@]*@/:\/\/***:***@/g')"
  fi
else
  echo "WARNING: DATABASE_URL is not set!"
fi

# Wait for database to be ready
echo "Waiting for database to be ready..."
MAX_RETRIES=30
RETRY_COUNT=0

until node -e "
const { Pool } = require('pg');
try {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.log('DATABASE_URL is not set!');
    process.exit(1);
  }
  console.log('DATABASE_URL length:', dbUrl.length);
  console.log('First 50 chars:', dbUrl.substring(0, 50) + '...');
  
  // Parse the URL to get hostname
  const url = new URL(dbUrl);
  console.log('Attempting to connect to host:', url.hostname);
  
  const pool = new Pool({ connectionString: dbUrl });
  pool.query('SELECT 1')
    .then(() => { console.log('Database is ready'); process.exit(0); })
    .catch((err) => { console.log('Database not ready:', err.message); process.exit(1); });
} catch (e) {
  console.log('Error parsing DATABASE_URL:', e.message);
  console.log('DATABASE_URL value:', process.env.DATABASE_URL);
  process.exit(1);
}
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

# Run our comprehensive migration script first
echo "🔧 Creating database tables..."
if node /app/scripts/payload-migrate.js; then
  echo "✅ Database tables created successfully"
else
  echo "⚠️  Failed to create database tables, but continuing..."
fi

# Run Payload migrations
echo "📦 Running Payload migrations..."
if npx payload migrate; then
  echo "✅ Payload migrations completed successfully"
else
  echo "⚠️  Payload migrations failed, but continuing..."
fi

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

# Start the application
echo "Starting Next.js application..."
exec "$@"