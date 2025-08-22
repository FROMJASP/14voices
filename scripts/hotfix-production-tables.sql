-- Production Hotfix SQL Script for 14voices
-- Run this directly in your PostgreSQL container to fix missing tables immediately
-- 
-- Usage: psql -U $POSTGRES_USER -d $POSTGRES_DB -f /path/to/hotfix-production-tables.sql
-- Or copy-paste into PostgreSQL console

BEGIN;

-- 1. Create pages_sections and related tables
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

-- Add foreign key for pages_sections if pages table exists
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

-- Create nested array tables for pages sections
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

-- Create pages metadata tables
CREATE TABLE IF NOT EXISTS pages_meta_keywords (
    id SERIAL PRIMARY KEY,
    _order integer NOT NULL,
    _parent_id integer,
    keyword text,
    _uuid text,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key for pages_meta_keywords
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

-- Create pages relations table
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

-- Add foreign keys for pages_rels
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

-- 2. Fix voiceovers localization table naming
DO $$
BEGIN
    -- Check if single underscore exists but double underscore doesn't
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'voiceovers_locales')
       AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'voiceovers__locales') THEN
        
        -- Rename the table
        ALTER TABLE voiceovers_locales RENAME TO voiceovers__locales;
        
        -- Rename constraint if it exists
        IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
                  WHERE table_name = 'voiceovers__locales' 
                  AND constraint_name = 'voiceovers_locales__parent_id_fkey') THEN
            ALTER TABLE voiceovers__locales 
            RENAME CONSTRAINT voiceovers_locales__parent_id_fkey 
            TO voiceovers__locales__parent_id_fkey;
        END IF;
        
        RAISE NOTICE 'Renamed voiceovers_locales to voiceovers__locales';
        
    -- If double underscore doesn't exist at all, create it
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'voiceovers__locales') THEN
        
        CREATE TABLE voiceovers__locales (
            id SERIAL PRIMARY KEY,
            name text,
            description text,
            _locale text NOT NULL,
            _parent_id integer,
            created_at timestamp DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Add foreign key if voiceovers table exists
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'voiceovers') THEN
            ALTER TABLE voiceovers__locales 
            ADD CONSTRAINT voiceovers__locales__parent_id_fkey 
            FOREIGN KEY (_parent_id) REFERENCES voiceovers(id) ON DELETE CASCADE;
        END IF;
        
        RAISE NOTICE 'Created voiceovers__locales table';
    END IF;
END $$;

-- Create compatibility view for Payload queries
DROP VIEW IF EXISTS voiceovers_locales CASCADE;
CREATE VIEW voiceovers_locales AS SELECT * FROM voiceovers__locales;

-- 3. Create all necessary indexes
CREATE INDEX IF NOT EXISTS idx_pages_sections_parent ON pages_sections(_parent_id);
CREATE INDEX IF NOT EXISTS idx_pages_sections_order ON pages_sections(_order);
CREATE INDEX IF NOT EXISTS idx_pages_sections_type ON pages_sections(type);

CREATE INDEX IF NOT EXISTS idx_pages_sections_cta_buttons_parent ON pages_sections_cta_buttons(_parent_id);
CREATE INDEX IF NOT EXISTS idx_pages_sections_cta_buttons_order ON pages_sections_cta_buttons(_order);

CREATE INDEX IF NOT EXISTS idx_pages_sections_pricing_plans_parent ON pages_sections_pricing_plans(_parent_id);
CREATE INDEX IF NOT EXISTS idx_pages_sections_pricing_plans_order ON pages_sections_pricing_plans(_order);

CREATE INDEX IF NOT EXISTS idx_pages_sections_pricing_plans_features_parent ON pages_sections_pricing_plans_features(_parent_id);
CREATE INDEX IF NOT EXISTS idx_pages_sections_pricing_plans_features_order ON pages_sections_pricing_plans_features(_order);

CREATE INDEX IF NOT EXISTS idx_pages_sections_faqs_parent ON pages_sections_faqs(_parent_id);
CREATE INDEX IF NOT EXISTS idx_pages_sections_faqs_order ON pages_sections_faqs(_order);

CREATE INDEX IF NOT EXISTS idx_pages_meta_keywords_parent ON pages_meta_keywords(_parent_id);
CREATE INDEX IF NOT EXISTS idx_pages_meta_keywords_order ON pages_meta_keywords(_order);

CREATE INDEX IF NOT EXISTS idx_pages_rels_parent ON pages_rels(parent_id);
CREATE INDEX IF NOT EXISTS idx_pages_rels_order ON pages_rels("order");
CREATE INDEX IF NOT EXISTS idx_pages_rels_path ON pages_rels(path);

CREATE INDEX IF NOT EXISTS idx_voiceovers__locales_parent ON voiceovers__locales(_parent_id);
CREATE INDEX IF NOT EXISTS idx_voiceovers__locales_locale ON voiceovers__locales(_locale);
CREATE INDEX IF NOT EXISTS idx_voiceovers__locales_parent_locale ON voiceovers__locales(_parent_id, _locale);

-- 4. Verify the fixes
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========== Verification ==========';
    
    -- Check pages_sections
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pages_sections') THEN
        RAISE NOTICE '✅ pages_sections table exists';
    ELSE
        RAISE NOTICE '❌ pages_sections table missing';
    END IF;
    
    -- Check voiceovers__locales
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'voiceovers__locales') THEN
        RAISE NOTICE '✅ voiceovers__locales table exists';
    ELSE
        RAISE NOTICE '❌ voiceovers__locales table missing';
    END IF;
    
    -- Check compatibility view
    IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_name = 'voiceovers_locales') THEN
        RAISE NOTICE '✅ voiceovers_locales compatibility view exists';
    END IF;
    
    RAISE NOTICE '==================================';
END $$;

COMMIT;

-- Final message
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🎉 Hotfix completed! Please restart your application.';
END $$;