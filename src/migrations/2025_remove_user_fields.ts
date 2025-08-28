import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres';
import { sql } from 'drizzle-orm';

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  // Note: The fields we're removing are:
  // - department (select field)
  // - status (select field)
  // - emailPreferences (group with nested fields)
  // - security (group with nested fields)
  // - metadata (group with nested fields)
  // - timezone (select field)
  // - notifications (group with nested fields)

  // These columns may or may not exist depending on the current state of the database
  // We'll use try-catch to handle cases where columns don't exist

  const alterations = [
    // Remove standalone columns
    `ALTER TABLE users DROP COLUMN IF EXISTS department`,
    `ALTER TABLE users DROP COLUMN IF EXISTS status`,
    `ALTER TABLE users DROP COLUMN IF EXISTS timezone`,

    // Remove group field columns (Payload stores these as JSON columns)
    `ALTER TABLE users DROP COLUMN IF EXISTS email_preferences`,
    `ALTER TABLE users DROP COLUMN IF EXISTS security`,
    `ALTER TABLE users DROP COLUMN IF EXISTS metadata`,
    `ALTER TABLE users DROP COLUMN IF EXISTS notifications`,

    // Add new theme column if it doesn't exist
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS admin_theme VARCHAR(20) DEFAULT 'auto'`,
  ];

  for (const alteration of alterations) {
    try {
      await payload.db.execute(sql.raw(alteration));
      console.log(`✅ Executed: ${alteration.substring(0, 50)}...`);
    } catch {
      // Log but don't fail - column might already be removed or not exist
      console.log(`⚠️  Skipped (possibly already applied): ${alteration.substring(0, 50)}...`);
    }
  }

  console.log('✅ User fields migration completed');
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // Re-add the removed columns if rolling back
  const alterations = [
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS department VARCHAR(50)`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active'`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'Europe/Amsterdam'`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS email_preferences JSONB`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS security JSONB`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS metadata JSONB`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS notifications JSONB`,
    `ALTER TABLE users DROP COLUMN IF EXISTS admin_theme`,
  ];

  for (const alteration of alterations) {
    try {
      await payload.db.execute(sql.raw(alteration));
      console.log(`✅ Rolled back: ${alteration.substring(0, 50)}...`);
    } catch {
      console.log(`⚠️  Skipped rollback: ${alteration.substring(0, 50)}...`);
    }
  }

  console.log('✅ User fields migration rolled back');
}
