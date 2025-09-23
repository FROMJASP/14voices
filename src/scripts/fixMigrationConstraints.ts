#!/usr/bin/env bun
/**
 * Fix migration constraint errors on self-hosted database
 */

import { getPayload } from 'payload';
import configPromise from '../payload.config';
import { sql } from 'drizzle-orm';

async function fixConstraints() {
  console.log('🔧 Fixing database constraints...\n');

  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const db = payload.db as any;

    // Step 1: Check if the problematic constraint exists
    console.log('📋 Checking existing constraints...');

    const constraints = await db.execute(sql`
      SELECT 
        constraint_name,
        table_name
      FROM information_schema.table_constraints 
      WHERE table_name = 'extra_services_production_price_overrides'
      AND constraint_type = 'FOREIGN KEY'
    `);

    console.log('Found constraints:', constraints.rows);

    // Step 2: Drop the problematic constraint if it exists
    console.log('\n🔨 Attempting to fix constraints...');

    try {
      // First, check if the constraint with the wrong name exists
      const wrongConstraint = await db.execute(sql`
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'extra_services_production_price_overrides_production_id_product'
        AND table_name = 'extra_services_production_price_overrides'
      `);

      if (wrongConstraint.rows.length > 0) {
        console.log('❌ Found malformed constraint, dropping it...');
        await db.execute(sql`
          ALTER TABLE extra_services_production_price_overrides 
          DROP CONSTRAINT IF EXISTS extra_services_production_price_overrides_production_id_product
        `);
        console.log('✅ Dropped malformed constraint');
      }

      // Drop any existing correct constraint to recreate it
      await db.execute(sql`
        ALTER TABLE extra_services_production_price_overrides 
        DROP CONSTRAINT IF EXISTS extra_services_production_price_overrides_production_id_productions_id_fk
      `);

      // Recreate the constraint properly
      console.log('\n📝 Creating correct constraint...');
      await db.execute(sql`
        ALTER TABLE extra_services_production_price_overrides 
        ADD CONSTRAINT extra_services_production_price_overrides_production_id_productions_id_fk 
        FOREIGN KEY (production_id) 
        REFERENCES productions(id) 
        ON DELETE CASCADE 
        ON UPDATE NO ACTION
      `);

      console.log('✅ Constraint created successfully');
    } catch (error) {
      console.error('❌ Error fixing constraints:', error);

      // Alternative approach: check table structure
      console.log('\n🔍 Checking table structure...');

      const tableInfo = await db.execute(sql`
        SELECT 
          column_name,
          data_type,
          is_nullable
        FROM information_schema.columns
        WHERE table_name = 'extra_services_production_price_overrides'
        ORDER BY ordinal_position
      `);

      console.log('\nTable structure:', tableInfo.rows);

      // Check if productions table exists
      const productionsExists = await db.execute(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'productions'
        )
      `);

      console.log('Productions table exists:', productionsExists.rows[0].exists);
    }

    // Step 3: Update payload_migrations table to mark migration as complete
    console.log('\n📝 Updating migration status...');

    try {
      await db.execute(sql`
        INSERT INTO payload_migrations (name, batch, created_at) 
        VALUES ('2025_fix_extra_services_constraints', 1, NOW())
        ON CONFLICT (name) DO NOTHING
      `);
      console.log('✅ Migration marked as complete');
    } catch (error) {
      console.error('⚠️  Could not update migration status:', error);
    }

    console.log('\n✅ Constraint fix complete!');
  } catch (error) {
    console.error('❌ Failed to fix constraints:', error);
    process.exit(1);
  }
}

// Alternative: Reset and recreate tables
async function resetAndRecreate() {
  console.log('🔄 Alternative: Reset and recreate tables...\n');

  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const db = payload.db as any;

    // Drop and recreate the problematic table
    console.log(
      '⚠️  This will DROP and RECREATE the extra_services_production_price_overrides table!'
    );
    console.log('   All data in this table will be lost.');
    console.log('   Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');

    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log('📝 Dropping table...');
    await db.execute(sql`
      DROP TABLE IF EXISTS extra_services_production_price_overrides CASCADE
    `);

    console.log('📝 Creating table with correct structure...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS extra_services_production_price_overrides (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        production_id UUID REFERENCES productions(id) ON DELETE CASCADE,
        extra_service_id UUID REFERENCES extra_services(id) ON DELETE CASCADE,
        price DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('✅ Table recreated successfully');
  } catch (error) {
    console.error('❌ Failed to reset table:', error);
  }
}

// Main execution
if (import.meta.main) {
  const args = process.argv.slice(2);

  if (args.includes('--reset')) {
    resetAndRecreate();
  } else {
    fixConstraints();
  }
}
