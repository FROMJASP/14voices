#!/usr/bin/env node
/**
 * Schema Migration Generator
 *
 * This script generates a Payload migration file for schema changes.
 * It creates a migration that will be automatically run on deployment.
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

// Skip in build environment
if (process.env.DATABASE_URL?.includes('fake:fake@fake')) {
  console.log('⏭️  Skipping migration generation for build environment');
  process.exit(0);
}

const migrationName = process.argv[2] || 'schema-sync';
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').split('-')[0];
const fileName = `${timestamp}_${migrationName}.ts`;
const migrationsDir = path.join(process.cwd(), 'src', 'migrations');

// Ensure migrations directory exists
if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true });
}

const migrationContent = `import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres';
import { sql } from 'drizzle-orm';

/**
 * Migration: ${migrationName}
 * Generated: ${new Date().toISOString()}
 * 
 * This migration ensures the database schema matches the Payload collections.
 * It's safe to run multiple times (idempotent).
 */

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // The Pages collection needs hero fields
  await db.execute(sql\`
    -- Add hero fields to pages table if they don't exist
    DO $$ 
    BEGIN
      -- hero_type column
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pages' AND column_name = 'hero_type'
      ) THEN
        ALTER TABLE pages ADD COLUMN hero_type text DEFAULT 'none';
      END IF;

      -- hero_title column
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pages' AND column_name = 'hero_title'
      ) THEN
        ALTER TABLE pages ADD COLUMN hero_title text;
      END IF;

      -- hero_subtitle column
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pages' AND column_name = 'hero_subtitle'
      ) THEN
        ALTER TABLE pages ADD COLUMN hero_subtitle text;
      END IF;

      -- hero_image_id column
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pages' AND column_name = 'hero_image_id'
      ) THEN
        ALTER TABLE pages ADD COLUMN hero_image_id integer;
      END IF;

      -- hero_video_url column
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pages' AND column_name = 'hero_video_url'
      ) THEN
        ALTER TABLE pages ADD COLUMN hero_video_url text;
      END IF;

      -- hero_cta_text column
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pages' AND column_name = 'hero_cta_text'
      ) THEN
        ALTER TABLE pages ADD COLUMN hero_cta_text text;
      END IF;

      -- hero_cta_link column
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pages' AND column_name = 'hero_cta_link'
      ) THEN
        ALTER TABLE pages ADD COLUMN hero_cta_link text;
      END IF;

      -- hero_cta_style column
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pages' AND column_name = 'hero_cta_style'
      ) THEN
        ALTER TABLE pages ADD COLUMN hero_cta_style text DEFAULT 'primary';
      END IF;

      -- meta fields
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pages' AND column_name = 'meta_title'
      ) THEN
        ALTER TABLE pages ADD COLUMN meta_title text;
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pages' AND column_name = 'meta_description'
      ) THEN
        ALTER TABLE pages ADD COLUMN meta_description text;
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pages' AND column_name = 'meta_image_id'
      ) THEN
        ALTER TABLE pages ADD COLUMN meta_image_id integer;
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pages' AND column_name = 'meta_no_index'
      ) THEN
        ALTER TABLE pages ADD COLUMN meta_no_index boolean DEFAULT false;
      END IF;

      -- open graph fields
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pages' AND column_name = 'open_graph_title'
      ) THEN
        ALTER TABLE pages ADD COLUMN open_graph_title text;
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pages' AND column_name = 'open_graph_description'
      ) THEN
        ALTER TABLE pages ADD COLUMN open_graph_description text;
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pages' AND column_name = 'open_graph_type'
      ) THEN
        ALTER TABLE pages ADD COLUMN open_graph_type text DEFAULT 'website';
      END IF;

      -- parent relationship
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pages' AND column_name = 'parent_id'
      ) THEN
        ALTER TABLE pages ADD COLUMN parent_id integer;
      END IF;

      -- navigation fields
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pages' AND column_name = 'show_in_nav'
      ) THEN
        ALTER TABLE pages ADD COLUMN show_in_nav boolean DEFAULT true;
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pages' AND column_name = 'nav_order'
      ) THEN
        ALTER TABLE pages ADD COLUMN nav_order integer DEFAULT 0;
      END IF;

      -- publishing fields
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pages' AND column_name = 'published_date'
      ) THEN
        ALTER TABLE pages ADD COLUMN published_date timestamp DEFAULT CURRENT_TIMESTAMP;
      END IF;

      -- version status
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pages' AND column_name = '_status'
      ) THEN
        ALTER TABLE pages ADD COLUMN _status text DEFAULT 'draft';
      END IF;
    END $$;
  \`);

  // Create array field tables for pages sections
  await db.execute(sql\`
    -- Create pages_sections table if it doesn't exist
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

    -- Create nested array tables for sections
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

    CREATE TABLE IF NOT EXISTS pages_sections_pricing_plans_features (
      id SERIAL PRIMARY KEY,
      _order integer NOT NULL,
      _parent_id integer REFERENCES pages_sections_pricing_plans(id) ON DELETE CASCADE,
      feature text NOT NULL,
      _uuid text,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamp DEFAULT CURRENT_TIMESTAMP
    );

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

    -- Create pages meta keywords array table
    CREATE TABLE IF NOT EXISTS pages_meta_keywords (
      id SERIAL PRIMARY KEY,
      _order integer NOT NULL,
      _parent_id integer REFERENCES pages(id) ON DELETE CASCADE,
      keyword text,
      _uuid text,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamp DEFAULT CURRENT_TIMESTAMP
    );

    -- Create relationship tables
    CREATE TABLE IF NOT EXISTS pages_rels (
      id SERIAL PRIMARY KEY,
      "order" integer,
      parent_id integer REFERENCES pages(id) ON DELETE CASCADE,
      path text NOT NULL,
      testimonials_id integer,
      media_id integer
    );

    CREATE TABLE IF NOT EXISTS pages_sections_rels (
      id SERIAL PRIMARY KEY,
      "order" integer,
      parent_id integer REFERENCES pages_sections(id) ON DELETE CASCADE,
      path text NOT NULL,
      testimonials_id integer,
      media_id integer
    );

    -- Create indexes for performance
    CREATE INDEX IF NOT EXISTS idx_pages_sections_parent ON pages_sections(_parent_id);
    CREATE INDEX IF NOT EXISTS idx_pages_sections_order ON pages_sections(_order);
    CREATE INDEX IF NOT EXISTS idx_pages_sections_cta_buttons_parent ON pages_sections_cta_buttons(_parent_id);
    CREATE INDEX IF NOT EXISTS idx_pages_sections_pricing_plans_parent ON pages_sections_pricing_plans(_parent_id);
    CREATE INDEX IF NOT EXISTS idx_pages_sections_pricing_plans_features_parent ON pages_sections_pricing_plans_features(_parent_id);
    CREATE INDEX IF NOT EXISTS idx_pages_sections_faqs_parent ON pages_sections_faqs(_parent_id);
    CREATE INDEX IF NOT EXISTS idx_pages_meta_keywords_parent ON pages_meta_keywords(_parent_id);
    CREATE INDEX IF NOT EXISTS idx_pages_rels_parent ON pages_rels(parent_id);
    CREATE INDEX IF NOT EXISTS idx_pages_sections_rels_parent ON pages_sections_rels(parent_id);
  \`);

  console.log('✅ Schema migration completed successfully');
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Down migrations are typically not used in production
  // But we include this for completeness
  console.log('⚠️  Down migration not implemented - manual intervention required');
}
`;

const migrationPath = path.join(migrationsDir, fileName);
fs.writeFileSync(migrationPath, migrationContent);

console.log(`✅ Migration created: ${migrationPath}`);
console.log(`\nTo run this migration, use: npx payload migrate`);
