#!/bin/bash

# Direct PostgreSQL admin reset for Payload CMS
DATABASE_URL="postgres://neondb_owner:npg_qZ2OGKbv1tMC@ep-spring-sun-a2r5782c-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"

echo "🚀 Starting Payload CMS admin reset..."

# Check existing users
echo -e "\n👥 Current users:"
psql "$DATABASE_URL" -c "SELECT id, email, role, name FROM users ORDER BY id;"

# Generate password hash using Node.js with Payload's method
echo -e "\n🔐 Generating password hash..."
cat > /tmp/hash-password.js << 'EOF'
const bcrypt = require('bcryptjs');
const password = 'Admin123!@#';
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);
console.log(JSON.stringify({ salt, hash }));
EOF

HASH_DATA=$(node /tmp/hash-password.js)
SALT=$(echo $HASH_DATA | node -e "console.log(JSON.parse(require('fs').readFileSync(0, 'utf8')).salt)")
HASH=$(echo $HASH_DATA | node -e "console.log(JSON.parse(require('fs').readFileSync(0, 'utf8')).hash)")

# Update or insert admin user
echo -e "\n🔄 Resetting admin user..."
psql "$DATABASE_URL" << EOF
-- First try to update existing admin
UPDATE users 
SET hash = '$HASH', 
    salt = '$SALT',
    role = 'admin',
    updated_at = NOW(),
    login_attempts = 0,
    lock_until = NULL
WHERE email = 'admin@14voices.nl';

-- If no rows were updated, insert new admin
INSERT INTO users (
    email, 
    hash, 
    salt, 
    name, 
    role, 
    created_at, 
    updated_at,
    email_preferences_marketing,
    email_preferences_transactional,
    email_preferences_updates,
    status
)
SELECT 
    'admin@14voices.nl', 
    '$HASH', 
    '$SALT', 
    'Admin User', 
    'admin', 
    NOW(), 
    NOW(),
    true,
    true,
    true,
    'active'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@14voices.nl');

-- Show the result
SELECT id, email, role, name FROM users WHERE email = 'admin@14voices.nl';
EOF

# Clean up
rm -f /tmp/hash-password.js

echo -e "\n✅ Admin reset complete!"
echo "   Email: admin@14voices.nl"
echo "   Password: Admin123!@#"
echo -e "\n⚠️  IMPORTANT: Change this password after logging in!"
echo -e "\n🔗 Login at: http://localhost:3000/admin"