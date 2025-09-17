import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres';
import { sql } from 'drizzle-orm';

/**
 * Migration: fix-extra-services-constraints
 *
 * This migration fixes the foreign key constraint issue with extra_services_production_price_overrides table
 */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // First, check if the constraint already exists and drop it if it does
  await db.execute(sql`
    DO $$ 
    BEGIN
      -- Drop the existing constraint if it exists
      IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'extra_services_production_price_overrides_production_id_productions_id_fk'
        AND table_name = 'extra_services_production_price_overrides'
      ) THEN
        ALTER TABLE extra_services_production_price_overrides 
        DROP CONSTRAINT extra_services_production_price_overrides_production_id_productions_id_fk;
      END IF;

      -- Check if the table exists before adding constraint
      IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'extra_services_production_price_overrides'
        AND table_schema = 'public'
      ) AND EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'productions'
        AND table_schema = 'public'
      ) THEN
        -- Add the constraint with proper settings
        ALTER TABLE extra_services_production_price_overrides 
        ADD CONSTRAINT extra_services_production_price_overrides_production_id_productions_id_fk 
        FOREIGN KEY (production_id) 
        REFERENCES productions(id) 
        ON DELETE CASCADE 
        ON UPDATE NO ACTION;
      END IF;
    END $$;
  `);

  console.log('✅ Fixed extra services constraints');
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Revert to original constraint
  await db.execute(sql`
    DO $$ 
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'extra_services_production_price_overrides_production_id_productions_id_fk'
        AND table_name = 'extra_services_production_price_overrides'
      ) THEN
        ALTER TABLE extra_services_production_price_overrides 
        DROP CONSTRAINT extra_services_production_price_overrides_production_id_productions_id_fk;
        
        ALTER TABLE extra_services_production_price_overrides 
        ADD CONSTRAINT extra_services_production_price_overrides_production_id_productions_id_fk 
        FOREIGN KEY (production_id) 
        REFERENCES productions(id) 
        ON DELETE SET NULL 
        ON UPDATE NO ACTION;
      END IF;
    END $$;
  `);
}
