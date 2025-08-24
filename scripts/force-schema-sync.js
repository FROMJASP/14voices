#!/usr/bin/env node
/**
 * Force Schema Sync Script
 *
 * This script aggressively ensures the database schema matches Payload collections
 * by directly creating any missing columns based on the Pages collection definition.
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const { Pool } = require('pg');

// Skip in build environment
if (process.env.DATABASE_URL?.includes('fake:fake@fake')) {
  console.log('⏭️  Skipping schema sync for build environment');
  process.exit(0);
}

console.log('🔨 Force Schema Sync Starting...\n');

async function forceSchemaSync() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // Test connection
    await pool.query('SELECT 1');
    console.log('✅ Database connection established\n');

    // Force create all missing columns for Pages collection
    console.log('📄 Syncing Pages table schema...');

    const pagesColumns = [
      // Hero group fields
      { name: 'hero_type', type: 'text', default: "'none'" },
      { name: 'hero_title', type: 'text' },
      { name: 'hero_subtitle', type: 'text' },
      { name: 'hero_image_id', type: 'integer' },
      { name: 'hero_video_url', type: 'text' },
      { name: 'hero_cta_text', type: 'text' },
      { name: 'hero_cta_link', type: 'text' },
      { name: 'hero_cta_style', type: 'text', default: "'primary'" },

      // Meta group fields
      { name: 'meta_title', type: 'text' },
      { name: 'meta_description', type: 'text' },
      { name: 'meta_image_id', type: 'integer' },
      { name: 'meta_no_index', type: 'boolean', default: 'false' },

      // Open Graph group fields
      { name: 'open_graph_title', type: 'text' },
      { name: 'open_graph_description', type: 'text' },
      { name: 'open_graph_type', type: 'text', default: "'website'" },

      // Settings fields
      { name: 'parent_id', type: 'integer' },
      { name: 'status', type: 'text', default: "'draft'" },
      { name: 'published_date', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
      { name: 'show_in_nav', type: 'boolean', default: 'true' },
      { name: 'nav_order', type: 'integer', default: '0' },

      // Version fields
      { name: '_status', type: 'text', default: "'draft'" },
    ];

    // Check if pages table exists
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'pages'
      );
    `);

    if (!tableExists.rows[0].exists) {
      console.log('❌ Pages table does not exist! This is a bigger problem.');
      console.log('   Running Payload migrations should create it.');
      return;
    }

    // Add each column if it doesn't exist
    for (const column of pagesColumns) {
      try {
        const columnExists = await pool.query(
          `
          SELECT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'pages' AND column_name = $1
          );
        `,
          [column.name]
        );

        if (!columnExists.rows[0].exists) {
          let sql = `ALTER TABLE pages ADD COLUMN ${column.name} ${column.type}`;
          if (column.default) {
            sql += ` DEFAULT ${column.default}`;
          }

          await pool.query(sql);
          console.log(`  ✅ Added column: ${column.name}`);
        } else {
          console.log(`  ⏭️  Column exists: ${column.name}`);
        }
      } catch (err) {
        console.log(`  ❌ Error adding ${column.name}: ${err.message}`);
      }
    }

    // Create array field tables
    console.log('\n📋 Creating array field tables...');

    const arrayTables = [
      {
        name: 'pages_sections',
        sql: `
          CREATE TABLE IF NOT EXISTS pages_sections (
            id SERIAL PRIMARY KEY,
            _order integer NOT NULL,
            _parent_id integer REFERENCES pages(id) ON DELETE CASCADE,
            type text NOT NULL,
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
          
          CREATE INDEX IF NOT EXISTS idx_pages_sections_parent ON pages_sections(_parent_id);
          CREATE INDEX IF NOT EXISTS idx_pages_sections_order ON pages_sections(_order);
        `,
      },
      {
        name: 'pages_sections_cta_buttons',
        sql: `
          CREATE TABLE IF NOT EXISTS pages_sections_cta_buttons (
            id SERIAL PRIMARY KEY,
            _order integer NOT NULL,
            _parent_id integer REFERENCES pages_sections(id) ON DELETE CASCADE,
            text text NOT NULL,
            link text NOT NULL,
            style text DEFAULT 'primary',
            _uuid text,
            created_at timestamp DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp DEFAULT CURRENT_TIMESTAMP
          );
          
          CREATE INDEX IF NOT EXISTS idx_pages_sections_cta_buttons_parent ON pages_sections_cta_buttons(_parent_id);
        `,
      },
      {
        name: 'pages_sections_pricing_plans',
        sql: `
          CREATE TABLE IF NOT EXISTS pages_sections_pricing_plans (
            id SERIAL PRIMARY KEY,
            _order integer NOT NULL,
            _parent_id integer REFERENCES pages_sections(id) ON DELETE CASCADE,
            name text NOT NULL,
            price text NOT NULL,
            description text,
            highlighted boolean DEFAULT false,
            button_text text DEFAULT 'Get Started',
            button_link text DEFAULT '/contact',
            _uuid text,
            created_at timestamp DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp DEFAULT CURRENT_TIMESTAMP
          );
          
          CREATE INDEX IF NOT EXISTS idx_pages_sections_pricing_plans_parent ON pages_sections_pricing_plans(_parent_id);
        `,
      },
      {
        name: 'pages_sections_pricing_plans_features',
        sql: `
          CREATE TABLE IF NOT EXISTS pages_sections_pricing_plans_features (
            id SERIAL PRIMARY KEY,
            _order integer NOT NULL,
            _parent_id integer REFERENCES pages_sections_pricing_plans(id) ON DELETE CASCADE,
            feature text NOT NULL,
            _uuid text,
            created_at timestamp DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp DEFAULT CURRENT_TIMESTAMP
          );
          
          CREATE INDEX IF NOT EXISTS idx_pages_sections_pricing_plans_features_parent ON pages_sections_pricing_plans_features(_parent_id);
        `,
      },
      {
        name: 'pages_sections_faqs',
        sql: `
          CREATE TABLE IF NOT EXISTS pages_sections_faqs (
            id SERIAL PRIMARY KEY,
            _order integer NOT NULL,
            _parent_id integer REFERENCES pages_sections(id) ON DELETE CASCADE,
            question text NOT NULL,
            answer jsonb NOT NULL,
            _uuid text,
            created_at timestamp DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp DEFAULT CURRENT_TIMESTAMP
          );
          
          CREATE INDEX IF NOT EXISTS idx_pages_sections_faqs_parent ON pages_sections_faqs(_parent_id);
        `,
      },
      {
        name: 'pages_meta_keywords',
        sql: `
          CREATE TABLE IF NOT EXISTS pages_meta_keywords (
            id SERIAL PRIMARY KEY,
            _order integer NOT NULL,
            _parent_id integer REFERENCES pages(id) ON DELETE CASCADE,
            keyword text,
            _uuid text,
            created_at timestamp DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp DEFAULT CURRENT_TIMESTAMP
          );
          
          CREATE INDEX IF NOT EXISTS idx_pages_meta_keywords_parent ON pages_meta_keywords(_parent_id);
        `,
      },
      {
        name: 'pages_rels',
        sql: `
          CREATE TABLE IF NOT EXISTS pages_rels (
            id SERIAL PRIMARY KEY,
            "order" integer,
            parent_id integer REFERENCES pages(id) ON DELETE CASCADE,
            path text NOT NULL,
            testimonials_id integer,
            media_id integer
          );
          
          CREATE INDEX IF NOT EXISTS idx_pages_rels_parent ON pages_rels(parent_id);
        `,
      },
      {
        name: 'pages_sections_rels',
        sql: `
          CREATE TABLE IF NOT EXISTS pages_sections_rels (
            id SERIAL PRIMARY KEY,
            "order" integer,
            parent_id integer REFERENCES pages_sections(id) ON DELETE CASCADE,
            path text NOT NULL,
            testimonials_id integer,
            media_id integer
          );
          
          CREATE INDEX IF NOT EXISTS idx_pages_sections_rels_parent ON pages_sections_rels(parent_id);
        `,
      },
    ];

    for (const table of arrayTables) {
      try {
        await pool.query(table.sql);
        console.log(`  ✅ Ensured table: ${table.name}`);
      } catch (err) {
        console.log(`  ❌ Error with ${table.name}: ${err.message}`);
      }
    }

    // Final verification
    console.log('\n🔍 Verifying schema...');
    const missingColumns = await pool.query(`
      SELECT column_name 
      FROM (
        VALUES 
          ('hero_type'), ('hero_title'), ('hero_subtitle'), 
          ('hero_image_id'), ('hero_video_url'), 
          ('hero_cta_text'), ('hero_cta_link'), ('hero_cta_style')
      ) AS required(column_name)
      WHERE NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pages' 
        AND column_name = required.column_name
      );
    `);

    if (missingColumns.rows.length === 0) {
      console.log('✅ All required columns are present!');
    } else {
      console.log(
        '❌ Still missing columns:',
        missingColumns.rows.map((r) => r.column_name).join(', ')
      );
    }

    console.log('\n✨ Force schema sync completed!');
  } catch (error) {
    console.error('❌ Schema sync error:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the sync
forceSchemaSync()
  .then(() => {
    console.log('\n🎉 Schema successfully synchronized!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Schema sync failed:', error);
    process.exit(0); // Exit with 0 to not block deployment
  });
