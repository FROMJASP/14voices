-- Fix missing locales tables for Payload CMS v3
-- Run this directly in PostgreSQL to fix the immediate issue

-- Create voiceovers_locales table
CREATE TABLE IF NOT EXISTS voiceovers_locales (
  id SERIAL PRIMARY KEY,
  name text,
  description text,
  _locale text NOT NULL,
  _parent_id integer,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key if voiceovers table exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'voiceovers') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
      WHERE table_name = 'voiceovers_locales' 
      AND constraint_name = 'voiceovers_locales__parent_id_fkey') THEN
      ALTER TABLE voiceovers_locales 
        ADD CONSTRAINT voiceovers_locales__parent_id_fkey 
        FOREIGN KEY (_parent_id) REFERENCES voiceovers(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_voiceovers_locales_parent ON voiceovers_locales(_parent_id);
CREATE INDEX IF NOT EXISTS idx_voiceovers_locales_locale ON voiceovers_locales(_locale);
CREATE UNIQUE INDEX IF NOT EXISTS idx_voiceovers_locales_unique ON voiceovers_locales(_locale, _parent_id);

-- Create productions_locales table
CREATE TABLE IF NOT EXISTS productions_locales (
  id SERIAL PRIMARY KEY,
  title text,
  client text,
  description text,
  _locale text NOT NULL,
  _parent_id integer,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key if productions table exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'productions') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
      WHERE table_name = 'productions_locales' 
      AND constraint_name = 'productions_locales__parent_id_fkey') THEN
      ALTER TABLE productions_locales 
        ADD CONSTRAINT productions_locales__parent_id_fkey 
        FOREIGN KEY (_parent_id) REFERENCES productions(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_productions_locales_parent ON productions_locales(_parent_id);
CREATE INDEX IF NOT EXISTS idx_productions_locales_locale ON productions_locales(_locale);
CREATE UNIQUE INDEX IF NOT EXISTS idx_productions_locales_unique ON productions_locales(_locale, _parent_id);

-- Create pages_locales table
CREATE TABLE IF NOT EXISTS pages_locales (
  id SERIAL PRIMARY KEY,
  title text,
  slug text,
  content jsonb,
  excerpt text,
  _locale text NOT NULL,
  _parent_id integer,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key if pages table exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pages') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
      WHERE table_name = 'pages_locales' 
      AND constraint_name = 'pages_locales__parent_id_fkey') THEN
      ALTER TABLE pages_locales 
        ADD CONSTRAINT pages_locales__parent_id_fkey 
        FOREIGN KEY (_parent_id) REFERENCES pages(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_pages_locales_parent ON pages_locales(_parent_id);
CREATE INDEX IF NOT EXISTS idx_pages_locales_locale ON pages_locales(_locale);
CREATE UNIQUE INDEX IF NOT EXISTS idx_pages_locales_unique ON pages_locales(_locale, _parent_id);

-- Create blog_posts_locales table
CREATE TABLE IF NOT EXISTS blog_posts_locales (
  id SERIAL PRIMARY KEY,
  title text,
  slug text,
  content jsonb,
  excerpt text,
  _locale text NOT NULL,
  _parent_id integer,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key if blog_posts table exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'blog_posts') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
      WHERE table_name = 'blog_posts_locales' 
      AND constraint_name = 'blog_posts_locales__parent_id_fkey') THEN
      ALTER TABLE blog_posts_locales 
        ADD CONSTRAINT blog_posts_locales__parent_id_fkey 
        FOREIGN KEY (_parent_id) REFERENCES blog_posts(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_locales_parent ON blog_posts_locales(_parent_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_locales_locale ON blog_posts_locales(_locale);
CREATE UNIQUE INDEX IF NOT EXISTS idx_blog_posts_locales_unique ON blog_posts_locales(_locale, _parent_id);

-- Create other necessary locales tables
CREATE TABLE IF NOT EXISTS testimonials_locales (
  id SERIAL PRIMARY KEY,
  content text,
  author text,
  company text,
  _locale text NOT NULL,
  _parent_id integer,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS f_a_q_locales (
  id SERIAL PRIMARY KEY,
  question text,
  answer text,
  _locale text NOT NULL,
  _parent_id integer,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS email_templates_locales (
  id SERIAL PRIMARY KEY,
  subject text,
  preview_text text,
  _locale text NOT NULL,
  _parent_id integer,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS forms_locales (
  id SERIAL PRIMARY KEY,
  title text,
  submit_button_label text,
  confirmation_message jsonb,
  _locale text NOT NULL,
  _parent_id integer,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Create globals locales tables
CREATE TABLE IF NOT EXISTS "site-settings_locales" (
  id SERIAL PRIMARY KEY,
  site_title text,
  tagline text,
  description text,
  _locale text NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_site_settings_locales_locale ON "site-settings_locales"(_locale);

CREATE TABLE IF NOT EXISTS "homepage-settings_locales" (
  id SERIAL PRIMARY KEY,
  hero_title text,
  hero_subtitle text,
  hero_cta_text text,
  _locale text NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_homepage_settings_locales_locale ON "homepage-settings_locales"(_locale);

-- Clean up old double-underscore tables if they exist
DROP TABLE IF EXISTS voiceovers__locales CASCADE;
DROP TABLE IF EXISTS pages__locales CASCADE;
DROP TABLE IF EXISTS blog_posts__locales CASCADE;

-- Show current tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE '%_locales'
ORDER BY table_name;