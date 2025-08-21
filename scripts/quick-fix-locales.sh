#!/bin/bash
# Quick fix for missing locales tables in PostgreSQL

echo "🚀 Quick fix for Payload CMS locales tables..."

# Run the fix script
cd /app && node scripts/fix-database-complete.js

# If that fails, try running Payload migrations
if [ $? -ne 0 ]; then
  echo "⚠️  Fix script failed, trying Payload migrations..."
  cd /app && bun payload migrate
fi

echo "✅ Done!"