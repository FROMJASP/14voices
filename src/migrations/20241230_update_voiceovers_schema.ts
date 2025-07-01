import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add new columns to voiceovers table
  await db.execute(sql`
    ALTER TABLE voiceovers 
    ADD COLUMN IF NOT EXISTS profile_photo_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS primary_demo_id INTEGER REFERENCES media(id) ON DELETE SET NULL;
  `)

  // Create new array tables for additional photos and demos
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS voiceovers_additional_photos (
      id SERIAL PRIMARY KEY,
      _order INTEGER NOT NULL,
      _parent_id INTEGER NOT NULL REFERENCES voiceovers(id) ON DELETE CASCADE,
      photo_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
      caption TEXT,
      _locale VARCHAR(10)
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS voiceovers_additional_demos (
      id SERIAL PRIMARY KEY,
      _order INTEGER NOT NULL,
      _parent_id INTEGER NOT NULL REFERENCES voiceovers(id) ON DELETE CASCADE,
      demo_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
      title TEXT NOT NULL,
      description TEXT,
      _locale VARCHAR(10)
    );
  `)

  // Create indexes
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS idx_voiceovers_additional_photos_parent ON voiceovers_additional_photos(_parent_id);
    CREATE INDEX IF NOT EXISTS idx_voiceovers_additional_demos_parent ON voiceovers_additional_demos(_parent_id);
  `)

  // Migrate data from old tables if they exist
  try {
    // Check if old tables exist and migrate data
    const oldPhotosExist = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'voiceover-photos'
      );
    `)

    if (oldPhotosExist.rows[0]?.exists) {
      // Migrate primary photos
      await db.execute(sql`
        UPDATE voiceovers v
        SET profile_photo_id = (
          SELECT id FROM "voiceover-photos" vp 
          WHERE vp.voiceover_artist = v.id 
          AND vp.is_primary = true
          LIMIT 1
        )
        WHERE EXISTS (
          SELECT 1 FROM "voiceover-photos" vp 
          WHERE vp.voiceover_artist = v.id 
          AND vp.is_primary = true
        );
      `)

      // Migrate additional photos
      await db.execute(sql`
        INSERT INTO voiceovers_additional_photos (_order, _parent_id, photo_id, caption)
        SELECT 
          ROW_NUMBER() OVER (PARTITION BY voiceover_artist ORDER BY id) as _order,
          voiceover_artist as _parent_id,
          id as photo_id,
          alt as caption
        FROM "voiceover-photos"
        WHERE is_primary = false OR is_primary IS NULL;
      `)
    }

    const oldDemosExist = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'voiceover-demos'
      );
    `)

    if (oldDemosExist.rows[0]?.exists) {
      // Migrate primary demos
      await db.execute(sql`
        UPDATE voiceovers v
        SET primary_demo_id = (
          SELECT id FROM "voiceover-demos" vd 
          WHERE vd.voiceover_artist = v.id 
          AND vd.is_primary = true
          LIMIT 1
        )
        WHERE EXISTS (
          SELECT 1 FROM "voiceover-demos" vd 
          WHERE vd.voiceover_artist = v.id 
          AND vd.is_primary = true
        );
      `)

      // Migrate additional demos
      await db.execute(sql`
        INSERT INTO voiceovers_additional_demos (_order, _parent_id, demo_id, title, description)
        SELECT 
          ROW_NUMBER() OVER (PARTITION BY voiceover_artist ORDER BY id) as _order,
          voiceover_artist as _parent_id,
          id as demo_id,
          title,
          description
        FROM "voiceover-demos"
        WHERE is_primary = false OR is_primary IS NULL;
      `)
    }
  } catch {
    console.log('Old tables do not exist, skipping migration')
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Remove the new columns
  await db.execute(sql`
    ALTER TABLE voiceovers 
    DROP COLUMN IF EXISTS profile_photo_id,
    DROP COLUMN IF EXISTS primary_demo_id;
  `)

  // Drop the new tables
  await db.execute(sql`
    DROP TABLE IF EXISTS voiceovers_additional_photos CASCADE;
    DROP TABLE IF EXISTS voiceovers_additional_demos CASCADE;
  `)
}