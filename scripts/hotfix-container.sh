#!/bin/bash
# Quick hotfix script to run in the production container
# 
# Usage: Copy this to your container and run it:
# docker cp hotfix-container.sh CONTAINER_ID:/tmp/hotfix.sh
# docker exec CONTAINER_ID bash /tmp/hotfix.sh

echo "🚨 Emergency Production Hotfix Starting..."

# Run the comprehensive table creation script
if [ -f /app/scripts/fix-all-missing-tables.js ]; then
  echo "🔧 Running comprehensive table fix..."
  cd /app
  node scripts/fix-all-missing-tables.js
else
  echo "❌ fix-all-missing-tables.js not found, using SQL directly..."
  
  # If the script isn't available, run SQL directly
  psql "$DATABASE_URL" << 'EOF'
BEGIN;

-- Create pages_sections table
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

-- Fix voiceovers localization
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'voiceovers_locales')
       AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'voiceovers__locales') THEN
        ALTER TABLE voiceovers_locales RENAME TO voiceovers__locales;
    END IF;
END $$;

-- Create compatibility view
DROP VIEW IF EXISTS voiceovers_locales CASCADE;
CREATE VIEW voiceovers_locales AS SELECT * FROM voiceovers__locales;

COMMIT;

\echo '✅ Emergency hotfix applied!'
EOF
fi

echo "✅ Hotfix completed! Restart your application if needed."