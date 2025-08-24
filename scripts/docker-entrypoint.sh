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

# First generate the schema migration if needed
echo "📝 Generating schema migration..."
if [ -f /app/scripts/generate-schema-migration.js ]; then
  if node /app/scripts/generate-schema-migration.js production-sync; then
    echo "✅ Schema migration generated"
  else
    echo "⚠️  Schema migration generation had issues, but continuing..."
  fi
fi

# Run Payload's built-in migration system
# This will:
# 1. Run any pending migrations from src/migrations/
# 2. Automatically sync schema with collection definitions
# 3. Create missing columns, tables, and relationships
echo "🚀 Running Payload migrations (this handles all schema sync)..."
if [ -f /app/scripts/run-payload-migrations.js ]; then
  if node /app/scripts/run-payload-migrations.js; then
    echo "✅ Payload migrations completed successfully"
  else
    echo "⚠️  Payload migrations had issues, but continuing..."
  fi
else
  # Fallback to direct npx command if script doesn't exist
  echo "📦 Running Payload migrations directly..."
  if npx payload migrate; then
    echo "✅ Payload migrations completed successfully"
  else
    echo "⚠️  Payload migrations failed, but continuing..."
  fi
fi

# Run any additional fixes if needed
echo "🔧 Running additional database fixes..."

# Fix locale tables if needed (for backward compatibility)
if [ -f /app/scripts/complete-schema-migration.js ]; then
  if node /app/scripts/complete-schema-migration.js; then
    echo "✅ Additional fixes completed"
  else
    echo "⚠️  Additional fixes had issues, but continuing..."
  fi
fi

# Force schema sync to ensure all columns exist
echo "🔨 Force syncing database schema..."
if [ -f /app/scripts/force-schema-sync.js ]; then
  if node /app/scripts/force-schema-sync.js; then
    echo "✅ Schema force sync completed"
  else
    echo "⚠️  Schema force sync had issues, but continuing..."
  fi
fi

# Generate import map with proper S3 configuration check
if [ -f /app/scripts/generate-importmap.js ]; then
  echo "🗺️  Generating import map for production..."
  if node /app/scripts/generate-importmap.js; then
    echo "✅ Import map generated successfully"
  else
    echo "⚠️  Import map generation had issues, but continuing..."
  fi
fi

# Then run other production fixes
if [ -f /app/scripts/fix-production-comprehensive.js ]; then
  if node /app/scripts/fix-production-comprehensive.js; then
    echo "✅ Comprehensive production fixes applied successfully"
  else
    echo "⚠️  Comprehensive production fixes had issues, but continuing..."
  fi
elif [ -f /app/scripts/fix-production-issues.js ]; then
  echo "⚠️  Comprehensive fix script not found, trying standard fix..."
  if node /app/scripts/fix-production-issues.js; then
    echo "✅ Standard production fixes applied successfully"
  else
    echo "⚠️  Standard production fixes had issues, but continuing..."
  fi
else
  echo "⚠️  No production fix scripts found"
fi

# Run seeding if needed (skip for now due to module issues)
if [ -n "$ADMIN_EMAIL" ] && [ -n "$ADMIN_PASSWORD" ]; then
  echo "🌱 Seeding: Skipping automatic seeding (can be done manually later)"
fi

# Start the application
echo "Starting Next.js application..."
exec "$@"