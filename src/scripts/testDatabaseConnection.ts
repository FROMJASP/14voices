/**
 * Test database connection
 */

import { Client } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const testConnection = async () => {
  console.log('\n🔍 Testing PostgreSQL Connection\n');

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found in environment variables');
    return;
  }

  // Parse the connection URL
  const urlMatch = databaseUrl.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);

  if (!urlMatch) {
    console.error('❌ Invalid DATABASE_URL format');
    return;
  }

  const [, user, password, host, port, database] = urlMatch;

  console.log('Connection Details:');
  console.log(`- Host: ${host}`);
  console.log(`- Port: ${port}`);
  console.log(`- Database: ${database}`);
  console.log(`- User: ${user}`);
  console.log(`- Password: ${password.substring(0, 10)}...`);

  const client = new Client({
    connectionString: databaseUrl,
    ssl: false, // Try without SSL first
    connectionTimeoutMillis: 5000,
  });

  try {
    console.log('\n🔄 Attempting connection...');
    await client.connect();
    console.log('✅ Connection successful!');

    // Test query
    const result = await client.query('SELECT version()');
    console.log('\nPostgreSQL Version:', result.rows[0].version);

    // List databases
    const dbResult = await client.query(
      'SELECT datname FROM pg_database WHERE datistemplate = false'
    );
    console.log('\nAvailable databases:');
    dbResult.rows.forEach((row) => {
      console.log(`- ${row.datname}`);
    });

    await client.end();
    console.log('\n✅ Connection test complete!');
  } catch (error: any) {
    console.error('\n❌ Connection failed:', error.message);

    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 Troubleshooting:');
      console.log('1. The host is not accessible from your local machine');
      console.log('2. You may need to:');
      console.log('   - Use SSH tunnel: ssh -L 5432:localhost:5432 your-vps-server');
      console.log('   - Deploy your app to Coolify and use internal URL');
      console.log('   - Configure Coolify to expose PostgreSQL publicly');
    }
  }
};

// Run the test
testConnection().catch(console.error);
