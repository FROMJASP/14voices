-- HOTFIX: Production Database Schema Fix
-- Run this script directly on the production database to fix the voiceovers locales issue
-- 
-- Usage: psql $DATABASE_URL < scripts/hotfix-production.sql

-- 1. Create voiceovers__locales table (with double underscore)
CREATE TABLE IF NOT EXISTS voiceovers__locales (
  id SERIAL PRIMARY KEY,
  name text,
  description text,
  _locale text NOT NULL,
  _parent_id integer,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- 2. Add foreign key constraint if voiceovers table exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'voiceovers') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE table_name = 'voiceovers__locales' 
      AND constraint_name = 'voiceovers__locales__parent_id_fkey'
    ) THEN
      ALTER TABLE voiceovers__locales 
        ADD CONSTRAINT voiceovers__locales__parent_id_fkey 
        FOREIGN KEY (_parent_id) REFERENCES voiceovers(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- 3. Create indexes
CREATE INDEX IF NOT EXISTS idx_voiceovers__locales_parent 
  ON voiceovers__locales(_parent_id);
CREATE INDEX IF NOT EXISTS idx_voiceovers__locales_locale 
  ON voiceovers__locales(_locale);
CREATE INDEX IF NOT EXISTS idx_voiceovers__locales_parent_locale 
  ON voiceovers__locales(_parent_id, _locale);

-- 4. Migrate data from single underscore table if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'voiceovers_locales') THEN
    -- Copy data
    INSERT INTO voiceovers__locales (name, description, _locale, _parent_id, created_at, updated_at)
    SELECT name, description, _locale, _parent_id, created_at, updated_at
    FROM voiceovers_locales
    ON CONFLICT DO NOTHING;
    
    -- Drop old table
    DROP TABLE voiceovers_locales CASCADE;
    
    RAISE NOTICE 'Migrated data from voiceovers_locales to voiceovers__locales';
  END IF;
END $$;

-- 5. Create voiceovers_additional_photos table if missing
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

-- Add constraints
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'voiceovers') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE table_name = 'voiceovers_additional_photos' 
      AND constraint_name = 'voiceovers_additional_photos__parent_id_fkey'
    ) THEN
      ALTER TABLE voiceovers_additional_photos 
        ADD CONSTRAINT voiceovers_additional_photos__parent_id_fkey 
        FOREIGN KEY (_parent_id) REFERENCES voiceovers(id) ON DELETE CASCADE;
    END IF;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'media') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE table_name = 'voiceovers_additional_photos' 
      AND constraint_name = 'voiceovers_additional_photos_photo_id_fkey'
    ) THEN
      ALTER TABLE voiceovers_additional_photos 
        ADD CONSTRAINT voiceovers_additional_photos_photo_id_fkey 
        FOREIGN KEY (photo_id) REFERENCES media(id) ON DELETE SET NULL;
    END IF;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_voiceovers_additional_photos_parent 
  ON voiceovers_additional_photos(_parent_id);
CREATE INDEX IF NOT EXISTS idx_voiceovers_additional_photos_order 
  ON voiceovers_additional_photos(_order);

-- 6. Create voiceovers_style_tags table if missing
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

-- Add constraint
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'voiceovers') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE table_name = 'voiceovers_style_tags' 
      AND constraint_name = 'voiceovers_style_tags__parent_id_fkey'
    ) THEN
      ALTER TABLE voiceovers_style_tags 
        ADD CONSTRAINT voiceovers_style_tags__parent_id_fkey 
        FOREIGN KEY (_parent_id) REFERENCES voiceovers(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_voiceovers_style_tags_parent 
  ON voiceovers_style_tags(_parent_id);
CREATE INDEX IF NOT EXISTS idx_voiceovers_style_tags_order 
  ON voiceovers_style_tags(_order);
CREATE INDEX IF NOT EXISTS idx_voiceovers_style_tags_tag 
  ON voiceovers_style_tags(tag);

-- 7. Verify the fix
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'voiceovers__locales') THEN
    RAISE NOTICE '✅ voiceovers__locales table exists';
  ELSE
    RAISE WARNING '❌ voiceovers__locales table still missing!';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'voiceovers_additional_photos') THEN
    RAISE NOTICE '✅ voiceovers_additional_photos table exists';
  ELSE
    RAISE WARNING '❌ voiceovers_additional_photos table still missing!';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'voiceovers_style_tags') THEN
    RAISE NOTICE '✅ voiceovers_style_tags table exists';
  ELSE
    RAISE WARNING '❌ voiceovers_style_tags table still missing!';
  END IF;
END $$;

-- Done
SELECT 'Hotfix applied successfully' as status;