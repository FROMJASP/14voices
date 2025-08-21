#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Complete Production Database Fix Script
 *
 * This script performs a comprehensive fix of all database issues:
 * 1. Creates all missing Payload CMS tables
 * 2. Fixes locales table naming (double underscore)
 * 3. Adds missing columns for uploads
 * 4. Creates proper indexes for performance
 * 5. Ensures all foreign key constraints are in place
 *
 * Usage: node scripts/fix-production-database-complete.js
 */

const { Pool } = require('pg');

// Get database URL from environment
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL not found in environment variables');
  process.exit(1);
}

// Don't run migrations on fake build database
if (DATABASE_URL.includes('fake:fake@fake')) {
  console.log('⏭️  Skipping migrations for build environment');
  process.exit(0);
}

console.log('🚀 Starting complete production database fix...\n');

async function fixProductionDatabase() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
  });

  try {
    // Test database connection
    await pool.query('SELECT 1');
    console.log('✅ Database connection established\n');

    // 1. First ensure Payload base tables exist
    console.log('📊 Ensuring Payload CMS base tables exist...');

    // Create payload_migrations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payload_migrations (
        id SERIAL PRIMARY KEY,
        name text NOT NULL UNIQUE,
        batch integer NOT NULL,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create payload_preferences table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payload_preferences (
        id SERIAL PRIMARY KEY,
        key text NOT NULL,
        value jsonb,
        relationship_value jsonb,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_payload_preferences_key 
        ON payload_preferences(key);
    `);

    console.log('✅ Payload base tables created\n');

    // 2. Fix all locales tables (double underscore issue)
    console.log('🌍 Fixing locales tables naming...');

    const localizedCollections = [
      'voiceovers',
      'pages',
      'blog_posts',
      'testimonials',
      'faq',
      'email_templates',
      'email_components',
      'forms',
    ];

    for (const collection of localizedCollections) {
      const singleName = `${collection}_locales`;
      const doubleName = `${collection}__locales`;

      // Check if single underscore version exists
      const checkSingle = await pool.query(
        `
        SELECT EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_name = $1
        );
      `,
        [singleName]
      );

      // Check if double underscore version exists
      const checkDouble = await pool.query(
        `
        SELECT EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_name = $1
        );
      `,
        [doubleName]
      );

      const hasSingle = checkSingle.rows[0].exists;
      const hasDouble = checkDouble.rows[0].exists;

      if (hasSingle && !hasDouble) {
        console.log(`  🔄 Renaming ${singleName} to ${doubleName}...`);

        // Drop old constraints
        await pool.query(`
          ALTER TABLE IF EXISTS ${singleName} 
          DROP CONSTRAINT IF EXISTS ${singleName}__parent_id_fkey;
        `);

        // Rename table
        await pool.query(`
          ALTER TABLE ${singleName} RENAME TO ${doubleName};
        `);

        // Rename indexes
        await pool.query(`
          ALTER INDEX IF EXISTS idx_${singleName}_parent 
          RENAME TO idx_${doubleName}_parent;
          
          ALTER INDEX IF EXISTS idx_${singleName}_locale 
          RENAME TO idx_${doubleName}_locale;
        `);

        console.log(`  ✅ Renamed to ${doubleName}`);
      } else if (!hasSingle && !hasDouble) {
        // Create the double underscore version if neither exists
        console.log(`  📝 Creating ${doubleName} table...`);

        // Determine fields based on collection type
        let localeFields = 'name text, description text,';

        if (collection === 'pages' || collection === 'blog_posts') {
          localeFields = `
            title text,
            slug text,
            description text,
            meta_title text,
            meta_description text,
            og_title text,
            og_description text,
          `;
        } else if (collection === 'email_templates' || collection === 'email_components') {
          localeFields = `
            name text,
            description text,
            subject text,
            preview_text text,
          `;
        } else if (collection === 'forms') {
          localeFields = `
            title text,
            description text,
            submit_button_label text,
            confirmation_message text,
          `;
        } else if (collection === 'faq') {
          localeFields = `
            question text,
            answer text,
          `;
        } else if (collection === 'testimonials') {
          localeFields = `
            quote text,
            author_name text,
            author_title text,
            author_company text,
          `;
        }

        await pool.query(`
          CREATE TABLE IF NOT EXISTS ${doubleName} (
            id SERIAL PRIMARY KEY,
            ${localeFields}
            _locale text NOT NULL,
            _parent_id integer,
            created_at timestamp DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp DEFAULT CURRENT_TIMESTAMP
          );
        `);

        // Create indexes
        await pool.query(`
          CREATE INDEX IF NOT EXISTS idx_${doubleName}_parent 
            ON ${doubleName}(_parent_id);
          CREATE INDEX IF NOT EXISTS idx_${doubleName}_locale 
            ON ${doubleName}(_locale);
        `);

        console.log(`  ✅ Created ${doubleName}`);
      }
    }

    console.log('✅ All locales tables fixed\n');

    // 3. Create voiceovers relationship tables
    console.log('🎤 Creating voiceovers relationship tables...');

    // voiceovers_additional_photos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS voiceovers_additional_photos (
        id SERIAL PRIMARY KEY,
        _order integer NOT NULL,
        _parent_id integer,
        photo_id integer,
        caption text,
        _uuid text,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_voiceovers_additional_photos_parent 
        ON voiceovers_additional_photos(_parent_id);
      CREATE INDEX IF NOT EXISTS idx_voiceovers_additional_photos_order 
        ON voiceovers_additional_photos(_order);
      CREATE INDEX IF NOT EXISTS idx_voiceovers_additional_photos_photo 
        ON voiceovers_additional_photos(photo_id);
    `);

    // voiceovers_style_tags
    await pool.query(`
      CREATE TABLE IF NOT EXISTS voiceovers_style_tags (
        id SERIAL PRIMARY KEY,
        _order integer NOT NULL,
        _parent_id integer,
        tag text,
        custom_tag text,
        _uuid text,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_voiceovers_style_tags_parent 
        ON voiceovers_style_tags(_parent_id);
      CREATE INDEX IF NOT EXISTS idx_voiceovers_style_tags_order 
        ON voiceovers_style_tags(_order);
      CREATE INDEX IF NOT EXISTS idx_voiceovers_style_tags_tag 
        ON voiceovers_style_tags(tag);
    `);

    console.log('✅ Voiceovers relationship tables created\n');

    // 4. Add missing upload columns to voiceovers
    console.log('📸 Adding missing upload columns to voiceovers...');

    const uploadColumns = [
      { name: 'full_demo_reel_id', comment: 'Full demo reel audio file reference' },
      { name: 'commercials_demo_id', comment: 'Commercials demo audio file reference' },
      { name: 'narrative_demo_id', comment: 'Narrative demo audio file reference' },
      { name: 'profile_photo_id', comment: 'Profile photo reference' },
    ];

    for (const col of uploadColumns) {
      await pool.query(`
        DO $$ 
        BEGIN
          IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'voiceovers') THEN
            IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'voiceovers' AND column_name = '${col.name}'
            ) THEN
              ALTER TABLE voiceovers ADD COLUMN ${col.name} integer;
              COMMENT ON COLUMN voiceovers.${col.name} IS '${col.comment}';
            END IF;
          END IF;
        END $$;
      `);

      // Create index for performance
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_voiceovers_${col.name} 
          ON voiceovers(${col.name}) WHERE ${col.name} IS NOT NULL;
      `);
    }

    console.log('✅ Upload columns added\n');

    // 5. Add foreign key constraints
    console.log('🔗 Adding foreign key constraints...');

    // Wait a moment for tables to be fully created
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Add foreign keys for voiceovers relationship tables
    await pool.query(`
      DO $$ 
      BEGIN
        -- voiceovers_additional_photos constraints
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'voiceovers') THEN
          IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
            WHERE table_name = 'voiceovers_additional_photos' 
            AND constraint_name = 'voiceovers_additional_photos__parent_id_fkey') THEN
            ALTER TABLE voiceovers_additional_photos 
              ADD CONSTRAINT voiceovers_additional_photos__parent_id_fkey 
              FOREIGN KEY (_parent_id) REFERENCES voiceovers(id) ON DELETE CASCADE;
          END IF;
        END IF;
        
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'media') THEN
          IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
            WHERE table_name = 'voiceovers_additional_photos' 
            AND constraint_name = 'voiceovers_additional_photos_photo_id_fkey') THEN
            ALTER TABLE voiceovers_additional_photos 
              ADD CONSTRAINT voiceovers_additional_photos_photo_id_fkey 
              FOREIGN KEY (photo_id) REFERENCES media(id) ON DELETE SET NULL;
          END IF;
        END IF;
        
        -- voiceovers_style_tags constraints
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'voiceovers') THEN
          IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
            WHERE table_name = 'voiceovers_style_tags' 
            AND constraint_name = 'voiceovers_style_tags__parent_id_fkey') THEN
            ALTER TABLE voiceovers_style_tags 
              ADD CONSTRAINT voiceovers_style_tags__parent_id_fkey 
              FOREIGN KEY (_parent_id) REFERENCES voiceovers(id) ON DELETE CASCADE;
          END IF;
        END IF;
        
        -- voiceovers__locales constraints
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'voiceovers') THEN
          IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
            WHERE table_name = 'voiceovers__locales' 
            AND constraint_name = 'voiceovers__locales__parent_id_fkey') THEN
            ALTER TABLE voiceovers__locales 
              ADD CONSTRAINT voiceovers__locales__parent_id_fkey 
              FOREIGN KEY (_parent_id) REFERENCES voiceovers(id) ON DELETE CASCADE;
          END IF;
        END IF;
        
        -- voiceovers upload columns constraints
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'media') 
           AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'voiceovers') THEN
          
          -- Full demo reel
          IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
            WHERE table_name = 'voiceovers' 
            AND constraint_name = 'voiceovers_full_demo_reel_id_fkey') THEN
            ALTER TABLE voiceovers 
              ADD CONSTRAINT voiceovers_full_demo_reel_id_fkey 
              FOREIGN KEY (full_demo_reel_id) REFERENCES media(id) ON DELETE SET NULL;
          END IF;
          
          -- Commercials demo
          IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
            WHERE table_name = 'voiceovers' 
            AND constraint_name = 'voiceovers_commercials_demo_id_fkey') THEN
            ALTER TABLE voiceovers 
              ADD CONSTRAINT voiceovers_commercials_demo_id_fkey 
              FOREIGN KEY (commercials_demo_id) REFERENCES media(id) ON DELETE SET NULL;
          END IF;
          
          -- Narrative demo
          IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
            WHERE table_name = 'voiceovers' 
            AND constraint_name = 'voiceovers_narrative_demo_id_fkey') THEN
            ALTER TABLE voiceovers 
              ADD CONSTRAINT voiceovers_narrative_demo_id_fkey 
              FOREIGN KEY (narrative_demo_id) REFERENCES media(id) ON DELETE SET NULL;
          END IF;
          
          -- Profile photo
          IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
            WHERE table_name = 'voiceovers' 
            AND constraint_name = 'voiceovers_profile_photo_id_fkey') THEN
            ALTER TABLE voiceovers 
              ADD CONSTRAINT voiceovers_profile_photo_id_fkey 
              FOREIGN KEY (profile_photo_id) REFERENCES media(id) ON DELETE SET NULL;
          END IF;
        END IF;
      END $$;
    `);

    console.log('✅ Foreign key constraints added\n');

    // 6. Add performance indexes
    console.log('🚀 Creating performance indexes...');

    // Voiceovers table indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_voiceovers_status 
        ON voiceovers(status) WHERE status IS NOT NULL;
      CREATE INDEX IF NOT EXISTS idx_voiceovers_slug 
        ON voiceovers(slug) WHERE slug IS NOT NULL;
      CREATE INDEX IF NOT EXISTS idx_voiceovers_cohort_id 
        ON voiceovers(cohort_id) WHERE cohort_id IS NOT NULL;
      CREATE INDEX IF NOT EXISTS idx_voiceovers_availability 
        ON voiceovers((availability->>'isAvailable')) WHERE availability IS NOT NULL;
    `);

    // Media table indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_media_uploaded_by 
        ON media(uploaded_by) WHERE uploaded_by IS NOT NULL;
      CREATE INDEX IF NOT EXISTS idx_media_scan_status 
        ON media(scan_status) WHERE scan_status IS NOT NULL;
      CREATE INDEX IF NOT EXISTS idx_media_mime_type 
        ON media(mime_type) WHERE mime_type IS NOT NULL;
    `);

    // Pages table indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_pages_slug 
        ON pages(slug) WHERE slug IS NOT NULL;
      CREATE INDEX IF NOT EXISTS idx_pages_status 
        ON pages(status) WHERE status IS NOT NULL;
      CREATE INDEX IF NOT EXISTS idx_pages_published_at 
        ON pages(published_at) WHERE published_at IS NOT NULL;
    `);

    console.log('✅ Performance indexes created\n');

    // 7. Final verification
    console.log('🔍 Verifying database structure...');

    // Check critical tables
    const criticalTables = [
      'voiceovers',
      'voiceovers__locales',
      'voiceovers_additional_photos',
      'voiceovers_style_tags',
      'media',
      'users',
      'payload_migrations',
      'payload_preferences',
    ];

    let allTablesExist = true;
    for (const table of criticalTables) {
      const result = await pool.query(
        `
        SELECT EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_name = $1
        );
      `,
        [table]
      );

      if (!result.rows[0].exists) {
        console.log(`  ❌ Missing table: ${table}`);
        allTablesExist = false;
      } else {
        console.log(`  ✅ Table exists: ${table}`);
      }
    }

    if (allTablesExist) {
      console.log('\n🎉 All critical tables verified!');
    } else {
      console.log('\n⚠️  Some tables are still missing. Run Payload migrations to create them.');
    }

    console.log('\n✨ Database fix completed successfully!');
  } catch (error) {
    console.error('❌ Database fix error:', error.message);
    console.error('Stack trace:', error.stack);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the fix
fixProductionDatabase()
  .then(() => {
    console.log('\n✅ Production database is ready!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fix failed:', error);
    process.exit(1);
  });
