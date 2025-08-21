#!/bin/bash
# Run Payload migration locally with proper database connection

# First, let's add the container hostname to /etc/hosts temporarily
echo "🔧 Setting up database connection..."

# Check if we're on macOS or Linux
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS - try to get the Docker container IP
    echo "Detected macOS. Trying to resolve database host..."
    
    # Option 1: Use localhost with port forwarding
    echo "Using localhost connection. Make sure your database is accessible."
    export DATABASE_URL="postgresql://fourteenvoices:GUOQWnkIl6vaPj8spmyBBzXyKsvf8PbleFR5cgb210hqgio36AQrcjEyy5oaZC2t@localhost:5432/postgres"
else
    # Keep original for Linux/Docker environments
    export DATABASE_URL="postgresql://fourteenvoices:GUOQWnkIl6vaPj8spmyBBzXyKsvf8PbleFR5cgb210hqgio36AQrcjEyy5oaZC2t@fwws0kskowgo48cgo84kowwo:5432/postgres"
fi

# Set MinIO to use localhost as well
export S3_ENDPOINT="http://localhost:9000"

echo "📦 Running Payload migrations..."
echo "Database URL: $DATABASE_URL"

# Run the migration
cd /Users/jasperhartsuijker/Documents/WebDev/14voices
npx payload migrate

echo "✅ Migration completed!"