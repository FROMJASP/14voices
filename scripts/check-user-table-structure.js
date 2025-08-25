#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
 

/**
 * Script to check the actual structure of the users table in the database
 */

const { Pool } = require('pg');

async function checkUserTableStructure() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Checking users table structure...\n');

    // Get all columns in the users table
    const columnsResult = await pool.query(`
      SELECT 
        column_name, 
        data_type, 
        is_nullable, 
        column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);

    if (columnsResult.rows.length === 0) {
      console.log('❌ Users table does not exist!');
      return;
    }

    console.log('📊 Users table columns:');
    console.log('------------------------');
    columnsResult.rows.forEach((col) => {
      console.log(
        `- ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`
      );
    });

    // Check for specific columns
    console.log('\n🔍 Checking for specific columns:');
    const checkColumns = [
      'role',
      'roles',
      'hash',
      'password',
      '_verified',
      'verified',
      'emailVerified',
    ];

    for (const colName of checkColumns) {
      const exists = columnsResult.rows.some((col) => col.column_name === colName);
      console.log(`- ${colName}: ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
    }

    // Get a sample user to see the actual data structure
    const sampleUser = await pool.query('SELECT * FROM users LIMIT 1');
    if (sampleUser.rows.length > 0) {
      console.log('\n📋 Sample user structure:');
      console.log(JSON.stringify(sampleUser.rows[0], null, 2));
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  checkUserTableStructure();
}

module.exports = { checkUserTableStructure };
