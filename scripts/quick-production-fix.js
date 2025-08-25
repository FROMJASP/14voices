#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Quick Production Fix Script
 * A comprehensive script to fix common production issues
 */

const { Pool } = require('pg');
const crypto = require('crypto');

async function quickFix() {
  console.log('🚀 Quick Production Fix Starting...\n');

  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL || DATABASE_URL.includes('fake:fake@fake')) {
    console.log('⏭️  Skipping - no valid database URL');
    return;
  }

  const pool = new Pool({ connectionString: DATABASE_URL });

  try {
    await pool.query('SELECT 1');
    console.log('✅ Database connection established\n');

    // 1. Fix locales tables
    console.log('🔧 Part 1: Fixing locale tables...');
    const singleCheck = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'voiceovers_locales'
      );
    `);

    const doubleCheck = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'voiceovers__locales'
      );
    `);

    const hasSingle = singleCheck.rows[0].exists;
    const hasDouble = doubleCheck.rows[0].exists;

    console.log(`voiceovers_locales exists: ${hasSingle}`);
    console.log(`voiceovers__locales exists: ${hasDouble}`);

    // If we have double but not single, create a view
    if (hasDouble && !hasSingle) {
      console.log('\n📝 Creating voiceovers_locales view...');
      await pool.query(`DROP VIEW IF EXISTS voiceovers_locales CASCADE;`);
      await pool.query(`
        CREATE VIEW voiceovers_locales AS 
        SELECT * FROM voiceovers__locales;
      `);
      console.log('✅ Created voiceovers_locales view');
    }

    // 2. Create admin user if none exists
    console.log('\n👤 Part 2: Checking for admin users...');
    const adminCheck = await pool.query(`
      SELECT COUNT(*) FROM users WHERE role = 'admin'
    `);

    if (adminCheck.rows[0].count === '0') {
      console.log('📝 Creating default admin user...');

      const email = process.env.ADMIN_EMAIL || 'admin@14voices.com';
      const password = process.env.ADMIN_PASSWORD || 'ChangeMeImmediately123!';

      // Use bcrypt-compatible hash
      const bcrypt = require('bcryptjs');
      const hash = await bcrypt.hash(password, 10);

      await pool.query(
        `
        INSERT INTO users (
          email, 
          "emailVerified", 
          "password", 
          "salt",
          role, 
          "createdAt", 
          "updatedAt"
        ) VALUES (
          $1, 
          true, 
          $2, 
          $3,
          'admin', 
          NOW(), 
          NOW()
        ) ON CONFLICT (email) DO UPDATE SET
          "password" = $2,
          "salt" = $3,
          "updatedAt" = NOW()
      `,
        [email, hash, '']
      );

      console.log(`✅ Admin user created: ${email}`);
      console.log(`   Password: ${password.substring(0, 3)}...`);
      console.log('   ⚠️  Change this password immediately after first login!');
    } else {
      console.log('✅ Admin user already exists');
    }

    // 3. Ensure voiceovers table has required columns
    console.log('\n🔧 Part 3: Checking voiceovers table...');

    const columnsToAdd = [
      { name: 'slug', type: 'VARCHAR(255)', default: null },
      { name: 'status', type: 'VARCHAR(50)', default: "'active'" },
      { name: 'availability', type: 'JSONB', default: '\'{"isAvailable": true}\'' },
    ];

    for (const col of columnsToAdd) {
      try {
        const query = col.default
          ? `ALTER TABLE voiceovers ADD COLUMN IF NOT EXISTS "${col.name}" ${col.type} DEFAULT ${col.default}`
          : `ALTER TABLE voiceovers ADD COLUMN IF NOT EXISTS "${col.name}" ${col.type}`;

        await pool.query(query);
        console.log(`✅ Ensured column: ${col.name}`);
      } catch (e) {
        console.log(`⚠️  Column ${col.name} might already exist`);
      }
    }

    // Fix NULL slugs
    await pool.query(`
      UPDATE voiceovers 
      SET slug = LOWER(REPLACE(name, ' ', '-'))
      WHERE slug IS NULL AND name IS NOT NULL
    `);

    // 4. Add sample voiceovers if none exist
    console.log('\n📊 Part 4: Checking voiceover data...');
    const voCount = await pool.query('SELECT COUNT(*) FROM voiceovers');

    if (voCount.rows[0].count === '0') {
      console.log('🎤 Adding sample voiceovers...');

      const sampleVoiceovers = [
        {
          name: 'Emma de Vries',
          slug: 'emma-de-vries',
          description: 'Warme, vriendelijke stem voor commercials',
          status: 'active',
        },
        {
          name: 'Thomas Bakker',
          slug: 'thomas-bakker',
          description: 'Diepe, autoritaire stem voor documentaires',
          status: 'active',
        },
        {
          name: 'Sophie Jansen',
          slug: 'sophie-jansen',
          description: 'Energieke stem voor animaties en games',
          status: 'active',
        },
      ];

      for (const vo of sampleVoiceovers) {
        await pool.query(
          `
          INSERT INTO voiceovers (
            name, slug, description, status, 
            availability, "createdAt", "updatedAt"
          ) VALUES (
            $1, $2, $3, $4, 
            '{"isAvailable": true}'::jsonb, NOW(), NOW()
          )
        `,
          [vo.name, vo.slug, vo.description, vo.status]
        );
      }

      console.log('✅ Added sample voiceovers');
    } else {
      console.log(`✅ Found ${voCount.rows[0].count} voiceovers`);
    }

    // 5. Ensure homepage_settings global exists
    console.log('\n🏠 Part 5: Checking homepage settings...');
    const homepageCheck = await pool.query(`
      SELECT COUNT(*) FROM globals 
      WHERE "globalType" = 'homepage-settings'
    `);

    if (homepageCheck.rows[0].count === '0') {
      console.log('📝 Creating default homepage settings...');

      const defaultSettings = {
        hero: {
          title: 'Vind de stem die jouw merk laat spreken.',
          description: 'Een goed verhaal verdient een goede stem.',
          primaryButton: { text: 'Ontdek stemmen', url: '#voiceovers' },
          secondaryButton: { text: 'Hoe wij werken', url: '/hoe-het-werkt' },
          heroImage: '/header-image.png',
          stats: [
            { number: '14', label: 'Stemacteurs' },
            { number: '<48u', label: 'Snelle levering' },
            { number: '9.1/10', label: 'Klantbeoordeling' },
          ],
        },
      };

      await pool.query(
        `
        INSERT INTO globals (
          "globalType", 
          "hero",
          "createdAt", 
          "updatedAt"
        ) VALUES (
          'homepage-settings',
          $1::jsonb,
          NOW(), 
          NOW()
        ) ON CONFLICT ("globalType") DO NOTHING
      `,
        [JSON.stringify(defaultSettings.hero)]
      );

      console.log('✅ Created homepage settings');
    } else {
      console.log('✅ Homepage settings already exist');
    }

    console.log('\n🎉 Quick fix completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    // Don't throw - allow app to continue
  } finally {
    await pool.end();
  }
}

quickFix()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fix failed:', error);
    process.exit(1);
  });
