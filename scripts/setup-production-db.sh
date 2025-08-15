#!/bin/bash

# Database Setup Script for Production
# This script runs database migrations and optionally seeds initial data

echo "🚀 Setting up production database..."
echo ""

# Run database migrations
echo "📊 Running database migrations..."
bun payload migrate

if [ $? -eq 0 ]; then
    echo "✅ Database migrations completed successfully!"
else
    echo "❌ Database migrations failed!"
    exit 1
fi

echo ""
echo "🔍 Checking migration status..."
bun payload migrate:status

echo ""
echo "Would you like to seed initial data? (y/n)"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo ""
    echo "🌱 Seeding database with initial data..."
    bun run seed
    
    if [ $? -eq 0 ]; then
        echo "✅ Database seeding completed successfully!"
    else
        echo "❌ Database seeding failed!"
        exit 1
    fi
else
    echo "⏭️  Skipping database seeding"
fi

echo ""
echo "🎉 Database setup complete!"
echo ""
echo "Next steps:"
echo "1. Visit your site to verify it's working"
echo "2. Login to admin panel at /admin"
echo "3. Configure site settings and content"