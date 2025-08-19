#!/bin/bash

# Script to manually run Payload migrations in Coolify container
# This fixes missing tables and columns

echo "=== 14voices Database Migration Fix ==="
echo ""
echo "This script will help you run migrations in your Coolify container."
echo ""

# Find the container ID
echo "Finding container ID..."
CONTAINER_ID=$(docker ps | grep fcw844w8ko4g4sssk84sg4wk | awk '{print $1}')

if [ -z "$CONTAINER_ID" ]; then
    echo "Error: Could not find the 14voices container."
    echo "Please make sure the application is running in Coolify."
    exit 1
fi

echo "Found container: $CONTAINER_ID"
echo ""

# Option 1: Try Payload migrate command directly
echo "=== Option 1: Running Payload migrate command ==="
docker exec -it $CONTAINER_ID sh -c "cd /app && npx payload migrate"

if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully!"
    exit 0
fi

echo ""
echo "=== Option 2: Running migrations with Node.js ==="
docker exec -it $CONTAINER_ID sh -c "cd /app && node -e \"
const { migrate } = require('@payloadcms/db-postgres');
const { buildConfig } = require('payload');

async function runMigrations() {
  try {
    console.log('Loading Payload config...');
    const config = await buildConfig({
      secret: process.env.PAYLOAD_SECRET,
      db: {
        client: 'pg',
        url: process.env.DATABASE_URL,
      },
    });
    
    console.log('Running migrations...');
    await migrate({ payload: { config } });
    console.log('✅ Migrations completed!');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

runMigrations();
\""

if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully!"
    exit 0
fi

echo ""
echo "=== Option 3: Force recreate all tables ==="
echo "WARNING: This will drop and recreate all tables. Use only as last resort!"
echo "Press Ctrl+C to cancel or Enter to continue..."
read

docker exec -it $CONTAINER_ID sh -c "cd /app && node -e \"
const dotenv = require('dotenv');
dotenv.config();

const { execSync } = require('child_process');

// Run with --drop-db flag to recreate everything
try {
  execSync('npx payload migrate --drop-db', { stdio: 'inherit' });
  console.log('✅ Database recreated successfully!');
} catch (error) {
  console.error('Failed to recreate database:', error);
}
\""

echo ""
echo "=== Migration process complete ==="
echo ""
echo "Now you should:"
echo "1. Check if the application is working at https://14voices.fromjasp.com"
echo "2. If you see any import map errors, run this in the container:"
echo "   docker exec -it $CONTAINER_ID sh -c 'cd /app && npx payload generate:importmap'"
echo "3. Restart the container in Coolify if needed"