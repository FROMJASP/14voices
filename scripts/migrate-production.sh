#!/bin/bash

# Production Migration Script
# This script runs migrations in a production environment where payload CLI might not be available

echo "🚀 Running production database migrations..."

# Check if we're in the app directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in the application directory"
    echo "Please run this script from /app directory"
    exit 1
fi

# Method 1: Try using npx (if npm is available)
if command -v npx &> /dev/null; then
    echo "📦 Using npx to run migrations..."
    npx payload migrate
    exit $?
fi

# Method 2: Try using node directly
if [ -f "node_modules/payload/dist/bin/index.js" ]; then
    echo "📦 Using node to run migrations..."
    node node_modules/payload/dist/bin/index.js migrate
    exit $?
fi

# Method 3: If we're in standalone mode, we might need to use the API
echo "⚠️  Payload CLI not found in standalone build"
echo ""
echo "Alternative: Run migrations through the API"
echo "1. Visit: https://14voices.com/admin"
echo "2. The first visit should trigger auto-migration"
echo ""
echo "Or rebuild the container with migrations included in the build process"

exit 1