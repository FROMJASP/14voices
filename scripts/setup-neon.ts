#!/usr/bin/env bun
import { createNeonClient } from '../src/lib/neon/client';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

async function setupNeon() {
  console.log('🚀 Setting up Neon database connection...\n');

  // Check for required environment variables
  const requiredVars = ['DATABASE_URL'];
  const missing = requiredVars.filter((v) => !process.env[v]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach((v) => console.error(`   - ${v}`));
    console.log('\n📝 Please create a .env.local file with the following variables:');
    console.log(
      '   DATABASE_URL=postgresql://<username>:<password>@<hostname>/<database>?sslmode=require'
    );
    console.log('\n💡 Get these values from your Neon dashboard at https://console.neon.tech');
    process.exit(1);
  }

  try {
    // Test connection
    console.log('🔌 Testing database connection...');
    const sql = createNeonClient();

    // Check basic connectivity
    const [result] = await sql`SELECT 1 as connected`;
    if (result.connected === 1) {
      console.log('✅ Basic connection successful!\n');
    }

    // Get database info
    console.log('📊 Database Information:');
    const [version] = await sql`SELECT version()`;
    console.log(`   Version: ${version.version.split(',')[0]}`);

    const [dbInfo] = await sql`
      SELECT 
        current_database() as database,
        current_user as user,
        inet_server_addr() as server_address,
        inet_server_port() as server_port
    `;
    console.log(`   Database: ${dbInfo.database}`);
    console.log(`   User: ${dbInfo.user}`);

    // Check for existing tables
    const tables = await sql`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `;

    console.log(`\n📁 Existing tables (${tables.length}):`);
    if (tables.length > 0) {
      tables.forEach((t) => console.log(`   - ${t.tablename}`));
    } else {
      console.log('   No tables found. Database is empty.');
    }

    // Check if this is a Payload CMS database
    const payloadTables = tables.filter(
      (t) => t.tablename.includes('payload') || t.tablename === 'users' || t.tablename === 'media'
    );

    if (payloadTables.length > 0) {
      console.log('\n🎯 Detected Payload CMS tables:');
      payloadTables.forEach((t) => console.log(`   - ${t.tablename}`));
    }

    console.log('\n✨ Neon database setup complete!');
    console.log('\n📌 Next steps:');
    console.log('   1. Run migrations: bun payload migrate');
    console.log('   2. Start development: bun dev');
    console.log('   3. Test connection: curl http://localhost:3000/api/neon/health');
  } catch (error) {
    console.error('\n❌ Database connection failed:');
    console.error(error);

    console.log('\n💡 Troubleshooting tips:');
    console.log('   1. Check your DATABASE_URL is correct');
    console.log('   2. Ensure your Neon project is active');
    console.log('   3. Verify your IP is allowed in Neon settings');
    console.log('   4. Check network connectivity');

    process.exit(1);
  }
}

// Run the setup
setupNeon().catch(console.error);
