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

# Check if migrations have already run by looking for the users table
if node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query(\"SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')\")
  .then((result) => { 
    if (result.rows[0].exists) {
      console.log('Database already migrated'); 
      process.exit(0);
    } else {
      process.exit(1);
    }
  })
  .catch(() => { process.exit(1); });
"; then
  echo "Database already migrated, skipping..."
else
  echo "Running Payload migrations..."
  if /app/node_modules/.bin/payload migrate; then
    echo "Migrations completed successfully"
    
    # Run seed data to initialize site settings
    echo "Initializing site settings..."
    if bun run seed; then
      echo "Site settings initialized successfully"
    else
      echo "Warning: Failed to initialize site settings, but continuing..."
    fi
  else
    echo "ERROR: Migrations failed!"
    # Try with bun as fallback
    if bun run payload migrate; then
      echo "Migrations completed successfully with bun"
      
      # Run seed data to initialize site settings
      echo "Initializing site settings..."
      if bun run seed; then
        echo "Site settings initialized successfully"
      else
        echo "Warning: Failed to initialize site settings, but continuing..."
      fi
    else
      echo "ERROR: Migrations failed with both methods!"
      exit 1
    fi
  fi
fi

# Start the application
echo "Starting Next.js application..."
exec "$@"