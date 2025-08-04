#!/bin/bash

# Direct PostgreSQL admin reset using psql
DATABASE_URL="postgres://neondb_owner:npg_qZ2OGKbv1tMC@ep-spring-sun-a2r5782c-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"

echo "🚀 Starting admin reset using psql..."

# First, check tables
echo -e "\n📋 Checking tables..."
psql "$DATABASE_URL" -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name;"

# Check existing users
echo -e "\n👥 Checking existing users..."
psql "$DATABASE_URL" -c "SELECT id, email, role FROM users ORDER BY id;"

# Generate bcrypt hash using Node.js
echo -e "\n🔐 Generating password hash..."
HASH=$(node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('Admin123!@#', 10));")

# Update or insert admin user
echo -e "\n🔄 Resetting admin user..."
psql "$DATABASE_URL" << EOF
-- First try to update existing admin
UPDATE users 
SET password = '$HASH', 
    role = 'admin',
    "updatedAt" = NOW()
WHERE email = 'admin@14voices.nl';

-- If no rows were updated, insert new admin
INSERT INTO users (email, password, "firstName", "lastName", role, "createdAt", "updatedAt")
SELECT 'admin@14voices.nl', '$HASH', 'Admin', 'User', 'admin', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@14voices.nl');
EOF

echo -e "\n✅ Admin reset complete!"
echo "   Email: admin@14voices.nl"
echo "   Password: Admin123!@#"
echo -e "\n⚠️  IMPORTANT: Change this password after logging in!"