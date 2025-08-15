#!/bin/sh

# Docker entrypoint script that runs migrations before starting the app

echo "🚀 Starting 14voices application..."

# Check if this is the first run by looking for a marker file
if [ ! -f "/app/.migrations-completed" ]; then
    echo "📊 First run detected - triggering database initialization..."
    
    # Start the application in the background
    bun run server.js &
    APP_PID=$!
    
    # Wait for the app to be ready
    echo "⏳ Waiting for application to start..."
    sleep 10
    
    # Trigger migrations via the API endpoint
    echo "🔄 Triggering database migrations..."
    curl -X POST http://localhost:3000/api/admin/migrate \
         -H "Authorization: Bearer ${PAYLOAD_SECRET}" \
         -H "Content-Type: application/json"
    
    # Create marker file
    touch /app/.migrations-completed
    
    # Stop the background process
    kill $APP_PID
    
    echo "✅ Database initialization completed!"
fi

# Start the application normally
echo "🎯 Starting application..."
exec bun run server.js