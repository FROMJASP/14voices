#!/bin/sh
#
# Complete Production Database Fix Script
# 
# This script runs all necessary fixes for the production database:
# 1. Fixes missing tables (voiceovers_locales issue)
# 2. Optimizes database performance
# 3. Verifies all tables exist
# 4. Can be run safely multiple times (idempotent)
#
# Usage: Run this inside the Docker container
#   docker exec -it <container-name> /app/scripts/fix-production-all-in-one.sh

set -e

echo "🚀 Starting complete production database fix..."
echo "================================================"

# Check if we're in the right directory
if [ ! -f "/app/package.json" ]; then
    echo "❌ ERROR: This script must be run from inside the Docker container"
    echo "   Run: docker exec -it <container-name> /app/scripts/fix-production-all-in-one.sh"
    exit 1
fi

# Check database connection
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable not set"
    exit 1
fi

echo "\n📊 Step 1: Running comprehensive database fix..."
echo "------------------------------------------------"
node /app/scripts/fix-production-database-complete.js

if [ $? -ne 0 ]; then
    echo "❌ Database fix failed!"
    exit 1
fi

echo "\n🚀 Step 2: Optimizing database performance..."
echo "--------------------------------------------"
node /app/scripts/optimize-database-performance.js

if [ $? -ne 0 ]; then
    echo "⚠️  Performance optimization had issues, but continuing..."
fi

echo "\n🔍 Step 3: Checking for Neon dependencies..."
echo "-------------------------------------------"
node /app/scripts/remove-neon-dependencies.js

echo "\n🔧 Step 4: Fixing import map S3 issues..."
echo "----------------------------------------"
node /app/scripts/fix-import-map-s3.js || echo "⚠️  Import map fix had issues, but continuing..."

echo "\n🔄 Step 5: Running Payload migrations..."
echo "---------------------------------------"
cd /app && npx payload migrate || echo "⚠️  Payload migrations had issues, but continuing..."

echo "\n✅ Step 6: Final verification..."
echo "-------------------------------"

# Quick database check using psql
echo "Checking critical tables..."
psql "$DATABASE_URL" -c "
SELECT 
    table_name,
    CASE 
        WHEN table_name IN (
            'voiceovers',
            'voiceovers__locales',
            'voiceovers_additional_photos',
            'voiceovers_style_tags',
            'media',
            'users',
            'payload_migrations',
            'payload_preferences'
        ) THEN '✅ CRITICAL'
        ELSE '📄 Standard'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
ORDER BY 
    CASE WHEN table_name LIKE 'voiceovers%' THEN 1 ELSE 2 END,
    table_name;
" || echo "⚠️  Could not run psql verification"

echo "\n================================================"
echo "✨ Production database fix completed!"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Restart the application: docker restart <container-name>"
echo "2. Check the logs: docker logs -f <container-name>"
echo "3. Verify the site is working at your domain"
echo ""
echo "If you still see errors:"
echo "- Check that all environment variables are set correctly"
echo "- Ensure MinIO/S3 storage is configured if using file uploads"
echo "- Review the application logs for any remaining issues"
echo ""