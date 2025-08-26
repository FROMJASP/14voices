#!/bin/sh

# Emergency Docker entrypoint - minimal startup without migrations
# This gets the app running first, migrations can be run manually later

set -e

echo -e "\n\033[0;36m============================================================\033[0m"
echo -e "\033[0;36m  14VOICES EMERGENCY STARTUP (NO MIGRATIONS)\033[0m"
echo -e "\033[0;36m============================================================\033[0m\n"

# Parse database URL if provided
if [ -n "$DATABASE_URL" ]; then
    # Extract components from DATABASE_URL
    # Format: postgresql://user:password@host:port/database
    export DATABASE_USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
    export DATABASE_PASSWORD=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
    export DATABASE_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:\/]*\).*/\1/p')
    export DATABASE_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
    export DATABASE_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')
    
    # Default port
    if [ -z "$DATABASE_PORT" ]; then
        export DATABASE_PORT="5432"
    fi
    
    echo -e "\033[0;32m[$(date '+%Y-%m-%d %H:%M:%S')] Database configuration parsed from DATABASE_URL\033[0m"
fi

# Skip everything if we're in build environment
if echo "$DATABASE_URL" | grep -q "fake:fake@fake"; then
    echo -e "\033[0;33m[$(date '+%Y-%m-%d %H:%M:%S')] Build environment detected, exiting\033[0m"
    exit 0
fi

# Wait for database to be ready
echo -e "\n\033[0;36m============================================================\033[0m"
echo -e "\033[0;36m  WAITING FOR DATABASE\033[0m"
echo -e "\033[0;36m============================================================\033[0m\n"

max_retries=30
retry_count=0

while [ $retry_count -lt $max_retries ]; do
    if PGPASSWORD="$DATABASE_PASSWORD" psql -h "$DATABASE_HOST" -p "$DATABASE_PORT" -U "$DATABASE_USER" -d "$DATABASE_NAME" -c "SELECT 1" > /dev/null 2>&1; then
        echo -e "\033[0;32m[$(date '+%Y-%m-%d %H:%M:%S')] Database is ready!\033[0m"
        break
    fi
    
    retry_count=$((retry_count + 1))
    echo "Waiting for database... ($retry_count/$max_retries)"
    sleep 2
done

if [ $retry_count -eq $max_retries ]; then
    echo -e "\033[0;31m[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: Database connection timeout\033[0m"
    exit 1
fi

echo -e "\n\033[0;36m============================================================\033[0m"
echo -e "\033[0;36m  STARTING APPLICATION (NO MIGRATIONS)\033[0m"
echo -e "\033[0;36m============================================================\033[0m\n"

echo -e "\033[0;33m[$(date '+%Y-%m-%d %H:%M:%S')] WARNING: Skipping migrations for emergency startup\033[0m"
echo -e "\033[0;33m[$(date '+%Y-%m-%d %H:%M:%S')] Run migrations manually after deployment is stable\033[0m"

# Start the application
echo -e "\033[0;32m[$(date '+%Y-%m-%d %H:%M:%S')] Starting Next.js application...\033[0m"
exec "$@"