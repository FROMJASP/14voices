#!/bin/sh
set -e

echo "🚀 Starting 14voices application..."

# Skip migration in build environment
if echo "$DATABASE_URL" | grep -q "fake:fake@fake"; then
  echo "⏭️  Skipping migrations for build environment"
else
  echo "📦 Running Payload migrations..."
  
  # Create migrations directory if it doesn't exist
  mkdir -p src/migrations
  
  # Run Payload migrations
  # This will create all tables based on your collections
  npx payload migrate || {
    echo "⚠️  Payload migrations failed, but continuing..."
  }
  
  echo "✅ Migrations completed"
fi

# Start the application
echo "🌟 Starting Next.js server..."
exec "$@"