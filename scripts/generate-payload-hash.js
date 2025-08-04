const crypto = require('crypto');

const password = 'Admin123!@#';

// Generate salt
crypto.randomBytes(32, (err, saltBuffer) => {
  if (err) throw err;
  
  const salt = saltBuffer.toString('hex');
  
  // Generate hash using PBKDF2 with Payload's exact parameters
  crypto.pbkdf2(password, salt, 25000, 512, 'sha256', (err, hashBuffer) => {
    if (err) throw err;
    
    const hash = hashBuffer.toString('hex');
    
    console.log('Password:', password);
    console.log('Salt:', salt);
    console.log('Hash:', hash);
    console.log('\nSQL to update admin users:');
    console.log(`
UPDATE users 
SET 
  hash = '${hash}',
  salt = '${salt}',
  "lockUntil" = NULL,
  "loginAttempts" = 0,
  _verified = true,
  _verificationToken = NULL
WHERE email IN ('admin@14voices.nl', 'admin@14voices.com');
    `);
  });
});