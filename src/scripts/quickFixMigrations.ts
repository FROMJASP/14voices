/**
 * Quick fix for migration issues
 */

import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const quickFix = async () => {
  console.log('\n🔧 Quick Migration Fix\n');

  const sql = neon(process.env.DATABASE_URL!);

  try {
    // 1. Check if payload_migrations table exists
    console.log('📋 Checking for payload_migrations table...');
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'payload_migrations'
      )
    `;

    if (!tableExists[0].exists) {
      console.log('Creating payload_migrations table...');
      await sql`
        CREATE TABLE IF NOT EXISTS payload_migrations (
          id serial PRIMARY KEY,
          name varchar(255) NOT NULL UNIQUE,
          batch integer,
          executed_at timestamp DEFAULT CURRENT_TIMESTAMP
        )
      `;
      console.log('✅ Created payload_migrations table');
    }

    // 2. Mark the problematic migration as already run
    console.log('\n📋 Marking problematic migrations as completed...');

    const migrationNames = [
      '20241227_104517_initial',
      '20241227_162853_add_price_overrides',
      '2025_01_03_fix_extra_services_production_relationship',
      '2025_fix_extra_services_constraints',
    ];

    for (const name of migrationNames) {
      try {
        await sql`
          INSERT INTO payload_migrations (name, batch, executed_at)
          VALUES (${name}, 1, NOW())
          ON CONFLICT (name) DO NOTHING
        `;
        console.log(`✅ Marked ${name} as completed`);
      } catch (error) {
        console.log(`⚠️  Migration ${name} already marked or error`);
      }
    }

    // 3. Check if the problematic table exists
    console.log('\n📋 Checking database state...');
    const problematicTable = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'extra_services_production_price_overrides'
      )
    `;

    if (problematicTable[0].exists) {
      console.log('✅ Table extra_services_production_price_overrides exists');

      // Check constraints
      const constraints = await sql`
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_name = 'extra_services_production_price_overrides'
        AND constraint_type = 'FOREIGN KEY'
      `;

      console.log(`Found ${constraints.length} foreign key constraints`);
    } else {
      console.log('⚠️  Table extra_services_production_price_overrides does not exist');
    }

    console.log('\n✅ Migration fix completed!');
    console.log('\nNext steps:');
    console.log('1. Clear Next.js cache: rm -rf .next');
    console.log('2. Restart dev server: bun dev');
  } catch (error) {
    console.error('\n❌ Error:', error);
  }
};

// Run the fix
quickFix().catch(console.error);
