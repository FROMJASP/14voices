#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Fix ALL Missing Tables Script
 *
 * This comprehensive script creates ALL missing tables that Payload CMS needs,
 * including array field tables for all collections (not just voiceovers).
 *
 * Run this to fix production deployment errors.
 */

const { Pool } = require('pg');

console.log('🚀 Comprehensive Table Creation Script Starting...\n');

async function fixAllMissingTables() {
  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL not found');
    return false;
  }

  // Don't run on fake build database
  if (DATABASE_URL.includes('fake:fake@fake')) {
    console.log('⏭️  Skipping for build environment');
    return true;
  }

  const pool = new Pool({
    connectionString: DATABASE_URL,
  });

  try {
    // Test connection
    await pool.query('SELECT 1');
    console.log('✅ Database connection established\n');

    // Start transaction
    await pool.query('BEGIN');

    // 1. Create pages_sections and related tables
    console.log('📄 Creating Pages collection array tables...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS pages_sections (
        id SERIAL PRIMARY KEY,
        _order integer NOT NULL,
        _parent_id integer,
        type text,
        rich_text_content jsonb,
        left_column jsonb,
        right_column jsonb,
        column_ratio text DEFAULT '50-50',
        cta_heading text,
        cta_text text,
        cta_background_color text DEFAULT 'gray',
        contact_heading text DEFAULT 'Get in Touch',
        contact_subheading text,
        show_contact_form boolean DEFAULT true,
        contact_email text DEFAULT 'casting@14voices.com',
        contact_phone text DEFAULT '020-2614825',
        pricing_heading text DEFAULT 'Our Pricing Plans',
        pricing_subheading text,
        testimonials_heading text,
        testimonials_subheading text,
        testimonials_source text DEFAULT 'featured',
        testimonials_limit integer DEFAULT 6,
        faq_heading text,
        faq_subheading text,
        gallery_heading text,
        gallery_layout text DEFAULT 'grid',
        _uuid text,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add foreign key for pages_sections
    await pool.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pages') THEN
          IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                        WHERE table_name = 'pages_sections' 
                        AND constraint_name = 'pages_sections__parent_id_fkey') THEN
            ALTER TABLE pages_sections 
            ADD CONSTRAINT pages_sections__parent_id_fkey 
            FOREIGN KEY (_parent_id) REFERENCES pages(id) ON DELETE CASCADE;
          END IF;
        END IF;
      END $$;
    `);

    console.log('✅ pages_sections table created');

    // Create nested array tables for pages_sections
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pages_sections_cta_buttons (
        id SERIAL PRIMARY KEY,
        _order integer NOT NULL,
        _parent_id integer,
        text text NOT NULL,
        link text NOT NULL,
        style text DEFAULT 'primary',
        _uuid text,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (_parent_id) REFERENCES pages_sections(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS pages_sections_pricing_plans (
        id SERIAL PRIMARY KEY,
        _order integer NOT NULL,
        _parent_id integer,
        name text NOT NULL,
        price text NOT NULL,
        description text,
        highlighted boolean DEFAULT false,
        button_text text DEFAULT 'Get Started',
        button_link text DEFAULT '/contact',
        _uuid text,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (_parent_id) REFERENCES pages_sections(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS pages_sections_pricing_plans_features (
        id SERIAL PRIMARY KEY,
        _order integer NOT NULL,
        _parent_id integer,
        feature text NOT NULL,
        _uuid text,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (_parent_id) REFERENCES pages_sections_pricing_plans(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS pages_sections_faqs (
        id SERIAL PRIMARY KEY,
        _order integer NOT NULL,
        _parent_id integer,
        question text NOT NULL,
        answer jsonb NOT NULL,
        _uuid text,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (_parent_id) REFERENCES pages_sections(id) ON DELETE CASCADE
      );
    `);

    console.log('✅ pages_sections nested tables created');

    // Create pages metadata tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pages_meta_keywords (
        id SERIAL PRIMARY KEY,
        _order integer NOT NULL,
        _parent_id integer,
        keyword text,
        _uuid text,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add foreign key for pages_meta_keywords
    await pool.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pages') THEN
          IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                        WHERE table_name = 'pages_meta_keywords' 
                        AND constraint_name = 'pages_meta_keywords__parent_id_fkey') THEN
            ALTER TABLE pages_meta_keywords 
            ADD CONSTRAINT pages_meta_keywords__parent_id_fkey 
            FOREIGN KEY (_parent_id) REFERENCES pages(id) ON DELETE CASCADE;
          END IF;
        END IF;
      END $$;
    `);

    console.log('✅ pages_meta_keywords table created');

    // Create pages_rels table for relationships
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pages_rels (
        id SERIAL PRIMARY KEY,
        "order" integer NOT NULL,
        parent_id integer,
        path text NOT NULL,
        testimonials_id integer,
        media_id integer,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add foreign keys for pages_rels
    await pool.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pages') THEN
          IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                        WHERE table_name = 'pages_rels' 
                        AND constraint_name = 'pages_rels_parent_id_fkey') THEN
            ALTER TABLE pages_rels 
            ADD CONSTRAINT pages_rels_parent_id_fkey 
            FOREIGN KEY (parent_id) REFERENCES pages(id) ON DELETE CASCADE;
          END IF;
        END IF;
      END $$;
    `);

    console.log('✅ pages_rels table created');

    // 2. Fix voiceovers localization tables
    console.log('\n🌍 Fixing voiceovers localization tables...');

    // Check current state
    const singleExists = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'voiceovers_locales'
      );
    `);

    const doubleExists = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'voiceovers__locales'
      );
    `);

    if (singleExists.rows[0].exists && !doubleExists.rows[0].exists) {
      // Rename single underscore to double underscore
      console.log('📝 Renaming voiceovers_locales to voiceovers__locales...');

      await pool.query(`
        ALTER TABLE voiceovers_locales RENAME TO voiceovers__locales;
      `);

      // Update constraints
      await pool.query(`
        DO $$
        BEGIN
          IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
                    WHERE table_name = 'voiceovers__locales' 
                    AND constraint_name = 'voiceovers_locales__parent_id_fkey') THEN
            ALTER TABLE voiceovers__locales 
            RENAME CONSTRAINT voiceovers_locales__parent_id_fkey 
            TO voiceovers__locales__parent_id_fkey;
          END IF;
        END $$;
      `);

      console.log('✅ Renamed to voiceovers__locales');
    } else if (!singleExists.rows[0].exists && !doubleExists.rows[0].exists) {
      // Create new double underscore table
      console.log('📝 Creating voiceovers__locales table...');

      await pool.query(`
        CREATE TABLE voiceovers__locales (
          id SERIAL PRIMARY KEY,
          name text,
          description text,
          _locale text NOT NULL,
          _parent_id integer,
          created_at timestamp DEFAULT CURRENT_TIMESTAMP,
          updated_at timestamp DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Add foreign key
      await pool.query(`
        DO $$
        BEGIN
          IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'voiceovers') THEN
            ALTER TABLE voiceovers__locales 
            ADD CONSTRAINT voiceovers__locales__parent_id_fkey 
            FOREIGN KEY (_parent_id) REFERENCES voiceovers(id) ON DELETE CASCADE;
          END IF;
        END $$;
      `);

      console.log('✅ Created voiceovers__locales table');
    }

    // Create compatibility view for single underscore
    await pool.query(`
      DROP VIEW IF EXISTS voiceovers_locales CASCADE;
      
      CREATE VIEW voiceovers_locales AS 
      SELECT * FROM voiceovers__locales;
    `);

    console.log('✅ Created compatibility view voiceovers_locales -> voiceovers__locales');

    // 3. Create all indexes for performance
    console.log('\n🔍 Creating indexes for performance...');

    await pool.query(`
      -- Pages sections indexes
      CREATE INDEX IF NOT EXISTS idx_pages_sections_parent ON pages_sections(_parent_id);
      CREATE INDEX IF NOT EXISTS idx_pages_sections_order ON pages_sections(_order);
      CREATE INDEX IF NOT EXISTS idx_pages_sections_type ON pages_sections(type);

      -- Nested tables indexes
      CREATE INDEX IF NOT EXISTS idx_pages_sections_cta_buttons_parent ON pages_sections_cta_buttons(_parent_id);
      CREATE INDEX IF NOT EXISTS idx_pages_sections_cta_buttons_order ON pages_sections_cta_buttons(_order);

      CREATE INDEX IF NOT EXISTS idx_pages_sections_pricing_plans_parent ON pages_sections_pricing_plans(_parent_id);
      CREATE INDEX IF NOT EXISTS idx_pages_sections_pricing_plans_order ON pages_sections_pricing_plans(_order);

      CREATE INDEX IF NOT EXISTS idx_pages_sections_pricing_plans_features_parent ON pages_sections_pricing_plans_features(_parent_id);
      CREATE INDEX IF NOT EXISTS idx_pages_sections_pricing_plans_features_order ON pages_sections_pricing_plans_features(_order);

      CREATE INDEX IF NOT EXISTS idx_pages_sections_faqs_parent ON pages_sections_faqs(_parent_id);
      CREATE INDEX IF NOT EXISTS idx_pages_sections_faqs_order ON pages_sections_faqs(_order);

      -- Pages metadata indexes
      CREATE INDEX IF NOT EXISTS idx_pages_meta_keywords_parent ON pages_meta_keywords(_parent_id);
      CREATE INDEX IF NOT EXISTS idx_pages_meta_keywords_order ON pages_meta_keywords(_order);

      -- Pages relations indexes
      CREATE INDEX IF NOT EXISTS idx_pages_rels_parent ON pages_rels(parent_id);
      CREATE INDEX IF NOT EXISTS idx_pages_rels_order ON pages_rels("order");
      CREATE INDEX IF NOT EXISTS idx_pages_rels_path ON pages_rels(path);

      -- Voiceovers locales indexes
      CREATE INDEX IF NOT EXISTS idx_voiceovers__locales_parent ON voiceovers__locales(_parent_id);
      CREATE INDEX IF NOT EXISTS idx_voiceovers__locales_locale ON voiceovers__locales(_locale);
      CREATE INDEX IF NOT EXISTS idx_voiceovers__locales_parent_locale ON voiceovers__locales(_parent_id, _locale);
    `);

    console.log('✅ All indexes created');

    // 4. Check for other collections that might need array tables
    console.log('\n🔍 Checking other collections for array fields...');

    // Check if these tables exist and create array field tables if needed
    const collections = [
      'blog_posts',
      'scripts',
      'forms',
      'faq',
      'email_templates',
      'testimonials',
    ];

    for (const collection of collections) {
      // Check if main table exists
      const tableExists = await pool.query(
        `SELECT EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_name = $1
        );`,
        [collection]
      );

      if (tableExists.rows[0].exists) {
        console.log(`✅ ${collection} table exists`);

        // Also check for localization tables
        const localeTableName = `${collection}__locales`;
        const localeExists = await pool.query(
          `SELECT EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_name = $1
          );`,
          [localeTableName]
        );

        if (!localeExists.rows[0].exists) {
          // Check if single underscore exists
          const singleLocaleExists = await pool.query(
            `SELECT EXISTS (
              SELECT 1 FROM information_schema.tables 
              WHERE table_name = $1
            );`,
            [`${collection}_locales`]
          );

          if (singleLocaleExists.rows[0].exists) {
            console.log(`📝 Found ${collection}_locales, creating view...`);
            await pool.query(`
              DROP VIEW IF EXISTS ${collection}_locales CASCADE;
              CREATE VIEW ${collection}_locales AS 
              SELECT * FROM ${collection}__locales;
            `);
          }
        }
      }
    }

    // Commit transaction
    await pool.query('COMMIT');

    console.log('\n🎉 All table creation and fixes completed successfully!');
    return true;
  } catch (error) {
    // Rollback on error
    await pool.query('ROLLBACK');
    console.error('❌ Error creating tables:', error.message);
    console.error('Full error:', error);
    return false;
  } finally {
    await pool.end();
  }
}

// Run the fixes
fixAllMissingTables()
  .then((success) => {
    if (success) {
      console.log('\n✨ Database is ready for production!');
      process.exit(0);
    } else {
      console.error('\n❌ Table creation failed');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n❌ Unexpected error:', error);
    process.exit(1);
  });
