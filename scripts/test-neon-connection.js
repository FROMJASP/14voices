#!/usr/bin/env node

import pg from 'pg';

const { Pool } = pg;

async function testConnection() {
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    console.error('   Please set it in your .env file or environment');
    process.exit(1);
  }

  console.log('🔍 Testing Neon database connection...');
  console.log(`   Database URL: ${process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@')}`);

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Neon requires SSL
    },
  });

  try {
    // Test basic connectivity
    const result = await pool.query('SELECT 1 as test');
    console.log('✅ Successfully connected to Neon database!');
    console.log(`   Query result: ${JSON.stringify(result.rows[0])}`);

    // Get database version
    const versionResult = await pool.query('SELECT version()');
    console.log(`   PostgreSQL version: ${versionResult.rows[0].version.split(',')[0]}`);

    // Get current database name
    const dbNameResult = await pool.query('SELECT current_database()');
    console.log(`   Current database: ${dbNameResult.rows[0].current_database}`);

    // List tables
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
      LIMIT 10
    `);

    if (tablesResult.rows.length > 0) {
      console.log(`   Found ${tablesResult.rowCount} tables (showing first 10):`);
      tablesResult.rows.forEach((row) => {
        console.log(`     - ${row.table_name}`);
      });
    } else {
      console.log('   No tables found in public schema');
    }
  } catch (error) {
    console.error('❌ Failed to connect to Neon database:');
    console.error(`   Error: ${error.message}`);

    if (error.code === 'ENOTFOUND') {
      console.error('   Could not resolve database host. Check your DATABASE_URL.');
    } else if (error.code === '28P01') {
      console.error('   Authentication failed. Check your database credentials.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('   Connection refused. Database might be down or URL is incorrect.');
    }

    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the test
testConnection().catch(console.error);
