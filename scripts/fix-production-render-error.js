#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
 

/**
 * Fix Production Server Components Render Error
 * Addresses "An error occurred in the Server Components render" issue
 */

const { Pool } = require('pg');
const path = require('path');

// Load environment variables if available
if (process.env.NODE_ENV !== 'production') {
  try {
    require.resolve('dotenv');
    require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
  } catch {
    // dotenv not available, continue without it
  }
}

async function fixProductionRenderError() {
  console.log('🔧 Fixing production render error...');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // 1. Ensure voiceovers table has all required columns
    console.log('\n📊 Checking voiceovers table structure...');
    const voiceoverColumns = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'voiceovers'
      ORDER BY ordinal_position;
    `);

    console.log('Voiceovers columns:', voiceoverColumns.rows.length);

    // Check for critical columns that might be missing
    const requiredColumns = ['id', 'name', 'slug', 'status', 'created_at', 'updated_at'];
    const existingColumns = voiceoverColumns.rows.map((row) => row.column_name);
    const missingColumns = requiredColumns.filter((col) => !existingColumns.includes(col));

    if (missingColumns.length > 0) {
      console.log('⚠️  Missing columns:', missingColumns);
      // Add missing columns
      for (const col of missingColumns) {
        let query = '';
        switch (col) {
          case 'slug':
            query = `ALTER TABLE voiceovers ADD COLUMN IF NOT EXISTS slug VARCHAR(255)`;
            break;
          case 'status':
            query = `ALTER TABLE voiceovers ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'draft'`;
            break;
          case 'created_at':
          case 'updated_at':
            query = `ALTER TABLE voiceovers ADD COLUMN IF NOT EXISTS ${col} TIMESTAMP DEFAULT CURRENT_TIMESTAMP`;
            break;
        }
        if (query) {
          await pool.query(query);
          console.log(`✅ Added column: ${col}`);
        }
      }
    }

    // 2. Check if voiceovers table has any data
    const voiceoverCount = await pool.query('SELECT COUNT(*) FROM voiceovers');
    console.log(`\n📈 Voiceovers count: ${voiceoverCount.rows[0].count}`);

    if (voiceoverCount.rows[0].count === '0') {
      console.log('\n⚠️  No voiceovers found. This might cause the homepage to show no content.');
      console.log('Consider running the seed script to add sample voiceovers.');
    }

    // 3. Check for availability column/JSONB structure
    const availabilityColumn = existingColumns.includes('availability');
    if (!availabilityColumn) {
      console.log('\n⚠️  Missing availability column. Adding it...');
      await pool.query(`
        ALTER TABLE voiceovers 
        ADD COLUMN IF NOT EXISTS availability JSONB DEFAULT '{"isAvailable": true}'::jsonb
      `);
      console.log('✅ Added availability column');
    }

    // 4. Fix any NULL slugs (which could cause render errors)
    const nullSlugs = await pool.query('SELECT id, name FROM voiceovers WHERE slug IS NULL');
    if (nullSlugs.rows.length > 0) {
      console.log(`\n🔧 Fixing ${nullSlugs.rows.length} voiceovers with NULL slugs...`);
      for (const voiceover of nullSlugs.rows) {
        const slug = voiceover.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
        await pool.query('UPDATE voiceovers SET slug = $1 WHERE id = $2', [slug, voiceover.id]);
        console.log(`✅ Fixed slug for: ${voiceover.name} -> ${slug}`);
      }
    }

    // 5. Ensure users table exists and has proper structure for admin creation
    console.log('\n👤 Checking users table...');
    const usersTableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);

    if (!usersTableExists.rows[0].exists) {
      console.log('⚠️  Users table does not exist! This is critical.');
      console.log('Run Payload migrations to create the users table.');
    } else {
      const userCount = await pool.query('SELECT COUNT(*) FROM users');
      console.log(`Users count: ${userCount.rows[0].count}`);

      if (userCount.rows[0].count === '0') {
        console.log('\n⚠️  No users found. The admin panel will redirect to create-first-user.');
        console.log('This is expected behavior for a fresh installation.');
      }
    }

    // 6. Check Payload system tables
    console.log('\n🔍 Checking Payload system tables...');
    const payloadTables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE 'payload_%'
      ORDER BY table_name;
    `);

    console.log(`Found ${payloadTables.rows.length} Payload system tables`);

    // 7. Ensure homepage_settings global exists
    const homepageSettingsExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'homepage_settings'
      );
    `);

    if (!homepageSettingsExists.rows[0].exists) {
      console.log('\n⚠️  homepage_settings table missing. Creating...');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS homepage_settings (
          id SERIAL PRIMARY KEY,
          hero JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Insert default settings
      await pool.query(
        `
        INSERT INTO homepage_settings (hero) 
        VALUES ($1)
        ON CONFLICT (id) DO NOTHING
      `,
        [
          JSON.stringify({
            title: 'Vind de stem die jouw merk laat spreken.',
            description: 'Een goed verhaal verdient een goede stem.',
            primaryButton: { text: 'Ontdek stemmen', url: '#voiceovers' },
            secondaryButton: { text: 'Hoe wij werken', url: '/hoe-het-werkt' },
          }),
        ]
      );

      console.log('✅ Created homepage_settings with defaults');
    }

    console.log('\n✅ Production render error fix completed!');
    console.log('\n📝 Summary:');
    console.log('- Voiceovers table checked and fixed');
    console.log('- User table status checked');
    console.log('- Homepage settings ensured');
    console.log('\n🚀 Next steps:');
    console.log('1. If voiceovers count is 0, run: bun run seed:voiceovers');
    console.log('2. If users count is 0, the admin panel will help create the first user');
    console.log('3. Restart the application to apply changes');
  } catch (error) {
    console.error('❌ Error fixing production render:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  fixProductionRenderError()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { fixProductionRenderError };
