-- Fix Payload CMS Localization Table Naming Issue
-- This script creates views to map single underscore names to double underscore tables
-- Run this directly on the database if the comprehensive fix script doesn't work

-- Drop existing views if they exist
DROP VIEW IF EXISTS voiceovers_locales CASCADE;
DROP VIEW IF EXISTS pages_locales CASCADE;
DROP VIEW IF EXISTS blog_posts_locales CASCADE;
DROP VIEW IF EXISTS scripts_locales CASCADE;
DROP VIEW IF EXISTS forms_locales CASCADE;
DROP VIEW IF EXISTS faq_locales CASCADE;
DROP VIEW IF EXISTS email_templates_locales CASCADE;

-- Create view for voiceovers_locales
CREATE VIEW voiceovers_locales AS 
SELECT * FROM voiceovers__locales;

-- Create rules for voiceovers_locales view
CREATE OR REPLACE RULE voiceovers_locales_insert AS
ON INSERT TO voiceovers_locales
DO INSTEAD
INSERT INTO voiceovers__locales (name, description, _locale, _parent_id, created_at, updated_at)
VALUES (NEW.name, NEW.description, NEW._locale, NEW._parent_id, NEW.created_at, NEW.updated_at)
RETURNING *;

CREATE OR REPLACE RULE voiceovers_locales_update AS
ON UPDATE TO voiceovers_locales
DO INSTEAD
UPDATE voiceovers__locales
SET name = NEW.name,
    description = NEW.description,
    _locale = NEW._locale,
    _parent_id = NEW._parent_id,
    updated_at = NEW.updated_at
WHERE id = OLD.id
RETURNING *;

CREATE OR REPLACE RULE voiceovers_locales_delete AS
ON DELETE TO voiceovers_locales
DO INSTEAD
DELETE FROM voiceovers__locales
WHERE id = OLD.id
RETURNING *;

-- Create view for pages_locales (if table exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pages__locales') THEN
        CREATE VIEW pages_locales AS SELECT * FROM pages__locales;
    END IF;
END $$;

-- Create view for blog_posts_locales (if table exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'blog_posts__locales') THEN
        CREATE VIEW blog_posts_locales AS SELECT * FROM blog_posts__locales;
    END IF;
END $$;

-- Create view for scripts_locales (if table exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'scripts__locales') THEN
        CREATE VIEW scripts_locales AS SELECT * FROM scripts__locales;
    END IF;
END $$;

-- Create view for forms_locales (if table exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'forms__locales') THEN
        CREATE VIEW forms_locales AS SELECT * FROM forms__locales;
    END IF;
END $$;

-- Create view for faq_locales (if table exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'faq__locales') THEN
        CREATE VIEW faq_locales AS SELECT * FROM faq__locales;
    END IF;
END $$;

-- Create view for email_templates_locales (if table exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_templates__locales') THEN
        CREATE VIEW email_templates_locales AS SELECT * FROM email_templates__locales;
    END IF;
END $$;

-- Verify the views were created
SELECT 'Views created:' as message;
SELECT table_name FROM information_schema.views 
WHERE table_name LIKE '%_locales' 
ORDER BY table_name;