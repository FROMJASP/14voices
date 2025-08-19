#!/bin/sh
set -e

echo "Starting application initialization..."

# Function to clean environment variables that might have incorrect format
clean_env_var() {
  local var_name=$1
  local var_value=$(eval echo \$$var_name)
  
  if [ -n "$var_value" ]; then
    # Check if the value starts with "VAR_NAME="
    if echo "$var_value" | grep -q "^${var_name}="; then
      echo "WARNING: $var_name contains '${var_name}=' prefix! Fixing..."
      export $var_name=$(echo "$var_value" | sed "s/^${var_name}=//")
    fi
  fi
}

# Clean all potentially affected environment variables
clean_env_var "DATABASE_URL"
clean_env_var "PAYLOAD_SECRET"
clean_env_var "NEXT_PUBLIC_SERVER_URL"
clean_env_var "RESEND_API_KEY"
clean_env_var "S3_ENDPOINT"
clean_env_var "S3_ACCESS_KEY_ID"
clean_env_var "S3_SECRET_ACCESS_KEY"

# Debug: Print DATABASE_URL (masked)
echo "DATABASE_URL is set: ${DATABASE_URL:+yes}"
if [ -n "$DATABASE_URL" ]; then
  echo "DATABASE_URL length: $(echo -n "$DATABASE_URL" | wc -c)"
  echo "DATABASE_URL format check: $(echo $DATABASE_URL | sed 's/:\/\/[^@]*@/:\/\/***:***@/g')"
else
  echo "ERROR: DATABASE_URL is not set!"
  exit 1
fi

# Wait for database to be ready
echo "Waiting for database to be ready..."
MAX_RETRIES=30
RETRY_COUNT=0

# Use psql to check database connectivity
DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:\/]*\).*/\1/p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

if [ -z "$DB_PORT" ]; then
  DB_PORT=5432
fi

echo "Database host: $DB_HOST"
echo "Database port: $DB_PORT"
echo "Database name: $DB_NAME"

while ! pg_isready -h $DB_HOST -p $DB_PORT -d $DB_NAME; do
  RETRY_COUNT=$((RETRY_COUNT+1))
  if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "Database connection failed after $MAX_RETRIES attempts"
    exit 1
  fi
  echo "Waiting for database... (attempt $RETRY_COUNT/$MAX_RETRIES)"
  sleep 2
done

echo "Database is ready!"

# Skip migrations if SKIP_MIGRATIONS is set
if [ -n "$SKIP_MIGRATIONS" ]; then
  echo "SKIP_MIGRATIONS is set, skipping database migrations..."
else
  echo "Running database migrations..."
  
  # Try different migration approaches
  echo "Attempting migration approach 1: Using run-migrations.js..."
  if node /app/scripts/run-migrations.js; then
    echo "✅ Database migration completed successfully"
  else
    echo "⚠️  Migration approach 1 failed, trying approach 2..."
    
    # Try using the migrate:prod script if it exists
    if npm run migrate:prod 2>/dev/null; then
      echo "✅ Database migration completed successfully (approach 2)"
    else
      echo "⚠️  All migration approaches failed"
      echo "⚠️  Application will start without migrations"
      echo "⚠️  You may need to run migrations manually"
    fi
  fi
fi

# Start the application
echo "Starting Next.js application..."
exec "$@"