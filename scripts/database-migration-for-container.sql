-- =============================================================================
-- 14voices Production Database Migration Script
-- For running directly in PostgreSQL container
-- =============================================================================
-- This script fixes all known production issues:
-- 1. Creates/fixes users table with Payload v3 columns
-- 2. Creates/fixes voiceovers table with required columns  
-- 3. Seeds sample voiceovers if table is empty
-- 4. Creates homepage settings
-- 5. Handles Payload locale table compatibility
-- =============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- USERS TABLE FIXES
-- =============================================================================

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hash VARCHAR(255),
    salt VARCHAR(255) DEFAULT '',
    roles JSONB DEFAULT '{}'::jsonb,
    _verified BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Add Payload v3 required columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS "_verified" BOOLEAN DEFAULT null;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "loginAttempts" INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "lockUntil" TIMESTAMP DEFAULT null;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "resetPasswordToken" VARCHAR(255) DEFAULT null;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "resetPasswordExpiration" TIMESTAMP DEFAULT null;

-- Create user indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_roles ON users(roles);
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users("resetPasswordToken");

-- Create payload_preferences table
CREATE TABLE IF NOT EXISTS payload_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    key VARCHAR(255),
    value JSONB,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Create admin user if none exists (using bcrypt hash for 'ChangeMeImmediately123!')
-- Hash generated with: bcrypt.hash('ChangeMeImmediately123!', 12)
INSERT INTO users (
    email, 
    hash, 
    salt,
    _verified,
    roles, 
    "createdAt", 
    "updatedAt"
) 
SELECT 
    'admin@14voices.com',
    '$2b$12$8K5P6mVqj3V5OmVX9bFjN.rDj2XQi2CX3zHJMKL5iHWqXx2Y7kJ7K', -- ChangeMeImmediately123!
    '',
    true,
    '{"admin": true}'::jsonb,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE roles ? 'admin'
);

-- =============================================================================
-- VOICEOVERS TABLE FIXES
-- =============================================================================

-- Create voiceovers table if it doesn't exist
CREATE TABLE IF NOT EXISTS voiceovers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    bio TEXT,
    status VARCHAR(50) DEFAULT 'active',
    availability JSONB DEFAULT '{"isAvailable": true}',
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Add required columns if missing
ALTER TABLE voiceovers ADD COLUMN IF NOT EXISTS slug VARCHAR(255);
ALTER TABLE voiceovers ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';
ALTER TABLE voiceovers ADD COLUMN IF NOT EXISTS availability JSONB DEFAULT '{"isAvailable": true}';
ALTER TABLE voiceovers ADD COLUMN IF NOT EXISTS bio TEXT;

-- Fix NULL slugs
UPDATE voiceovers 
SET slug = LOWER(REPLACE(COALESCE(name, 'voiceover-' || id), ' ', '-'))
WHERE slug IS NULL AND name IS NOT NULL;

-- Create voiceover indexes
CREATE INDEX IF NOT EXISTS idx_voiceovers_slug ON voiceovers(slug);
CREATE INDEX IF NOT EXISTS idx_voiceovers_status ON voiceovers(status);
CREATE INDEX IF NOT EXISTS idx_voiceovers_updated_at ON voiceovers("updatedAt");

-- Add sample voiceovers if table is empty
INSERT INTO voiceovers (name, slug, description, bio, status, availability, "createdAt", "updatedAt")
SELECT * FROM (VALUES
    ('Emma de Vries', 'emma-de-vries', 'Warme, vriendelijke stem perfect voor commercials en bedrijfspresentaties', 'Emma heeft meer dan 10 jaar ervaring in voice-over werk en heeft gewerkt voor bekende merken.', 'active', '{"isAvailable": true}'::jsonb, NOW(), NOW()),
    ('Thomas Bakker', 'thomas-bakker', 'Diepe, autoritaire stem ideaal voor documentaires en bedrijfsfilms', 'Thomas is gespecialiseerd in educatieve content en heeft een warme, vertrouwde stem.', 'active', '{"isAvailable": true}'::jsonb, NOW(), NOW()),
    ('Sophie Jansen', 'sophie-jansen', 'Energieke, jeugdige stem voor animaties en commercials', 'Sophie brengt enthousiasme en energie in elke voice-over en werkt graag met creatieve projecten.', 'active', '{"isAvailable": true}'::jsonb, NOW(), NOW()),
    ('Mark Hendriks', 'mark-hendriks', 'Professionele stem voor corporate videos en e-learning', 'Mark heeft uitgebreide ervaring in zakelijke voice-overs en spreekt ook vloeiend Engels.', 'active', '{"isAvailable": true}'::jsonb, NOW(), NOW()),
    ('Lisa van der Berg', 'lisa-van-der-berg', 'Veelzijdige stem voor radio, tv en online content', 'Lisa kan van toon wisselen van professioneel naar speels, perfect voor diverse projecten.', 'active', '{"isAvailable": true}'::jsonb, NOW(), NOW())
) AS new_voiceovers(name, slug, description, bio, status, availability, "createdAt", "updatedAt")
WHERE NOT EXISTS (SELECT 1 FROM voiceovers LIMIT 1);

-- =============================================================================
-- GLOBALS TABLE AND HOMEPAGE SETTINGS
-- =============================================================================

-- Create globals table if it doesn't exist
CREATE TABLE IF NOT EXISTS globals (
    id SERIAL PRIMARY KEY,
    "globalType" VARCHAR(255) UNIQUE,
    hero JSONB,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Insert default homepage settings if they don't exist
INSERT INTO globals ("globalType", hero, "createdAt", "updatedAt")
SELECT 
    'homepage-settings',
    '{
        "title": "Vind de stem die jouw merk laat spreken.",
        "description": "Een goed verhaal verdient een goede stem.",
        "primaryButton": {"text": "Ontdek stemmen", "url": "#voiceovers"},
        "secondaryButton": {"text": "Hoe wij werken", "url": "/hoe-het-werkt"},
        "heroImage": "/header-image.png",
        "stats": [
            {"number": "14", "label": "Stemacteurs"},
            {"number": "<48u", "label": "Snelle levering"},
            {"number": "9.1/10", "label": "Klantbeoordeling"}
        ]
    }'::jsonb,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM globals WHERE "globalType" = 'homepage-settings'
);

-- =============================================================================
-- PAYLOAD LOCALE COMPATIBILITY
-- =============================================================================

-- Handle Payload v3 locale table naming issues
-- Create view if double underscore table exists but single doesn't
DO $$
BEGIN
    -- Check if voiceovers__locales exists but voiceovers_locales doesn't
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'voiceovers__locales'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.views 
        WHERE table_name = 'voiceovers_locales'
    ) THEN
        -- Create compatibility view
        EXECUTE 'DROP VIEW IF EXISTS voiceovers_locales CASCADE';
        EXECUTE 'CREATE VIEW voiceovers_locales AS SELECT * FROM voiceovers__locales';
    END IF;
END $$;

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

-- Show final status
\echo '=== MIGRATION RESULTS ==='
SELECT 'Admin Users' as category, COUNT(*) as count FROM users WHERE roles ? 'admin'
UNION ALL
SELECT 'Total Users' as category, COUNT(*) as count FROM users
UNION ALL  
SELECT 'Voiceovers' as category, COUNT(*) as count FROM voiceovers
UNION ALL
SELECT 'Homepage Settings' as category, COUNT(*) as count FROM globals WHERE "globalType" = 'homepage-settings';

\echo '=== SAMPLE VOICEOVER DATA ==='
SELECT name, slug, status FROM voiceovers LIMIT 3;

\echo '=== MIGRATION COMPLETED SUCCESSFULLY ==='