#!/bin/bash

# Generate password hash using the bcryptjs in node_modules
echo "🔐 Generating password hash..."

# Create a temporary script that uses the project's bcryptjs
cat > /tmp/gen-hash.js << 'EOF'
const bcrypt = require('./node_modules/bcryptjs');
const password = 'Admin123!@#';
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);
console.log(`SALT: ${salt}`);
console.log(`HASH: ${hash}`);
EOF

# Run from the project directory
cd /Users/jasperhartsuijker/Documents/WebDev/14voices
node /tmp/gen-hash.js > /tmp/hash-output.txt

# Extract hash and salt
SALT=$(grep "SALT:" /tmp/hash-output.txt | cut -d' ' -f2)
HASH=$(grep "HASH:" /tmp/hash-output.txt | cut -d' ' -f2)

echo "Generated salt: $SALT"
echo "Generated hash: $HASH"

# Update the database
DATABASE_URL="postgres://neondb_owner:npg_qZ2OGKbv1tMC@ep-spring-sun-a2r5782c-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"

echo -e "\n🔄 Updating admin passwords..."
psql "$DATABASE_URL" << EOF
UPDATE users 
SET hash = '$HASH', 
    salt = '$SALT',
    login_attempts = 0,
    lock_until = NULL,
    updated_at = NOW()
WHERE email IN ('admin@14voices.nl', 'admin@14voices.com');

SELECT id, email, role FROM users WHERE email IN ('admin@14voices.nl', 'admin@14voices.com');
EOF

# Clean up
rm -f /tmp/gen-hash.js /tmp/hash-output.txt

echo -e "\n✅ Password reset complete!"
echo "   Email: admin@14voices.nl or admin@14voices.com"
echo "   Password: Admin123!@#"
echo -e "\n🔗 Login at: http://localhost:3000/admin"