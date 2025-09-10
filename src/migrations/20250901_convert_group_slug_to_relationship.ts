import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres';
import { sql } from 'drizzle-orm';

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const { db } = payload;

  // First, check if groups table exists and create default groups if needed
  const defaultGroups = [
    { name: 'November 2024', slug: 'nov-2024' },
    { name: 'Summer 2024', slug: 'summer-2024' },
    { name: 'Spring 2024', slug: 'spring-2024' },
  ];

  try {
    // Check if any groups exist
    const existingGroups = await payload.find({
      collection: 'groups',
      limit: 1,
    });

    // Only create default groups if none exist
    if (existingGroups.totalDocs === 0) {
      for (const group of defaultGroups) {
        await payload.create({
          collection: 'groups',
          data: {
            name: group.name,
            slug: group.slug,
            description: `Voiceovers from ${group.name}`,
            isActive: true,
          },
        });
      }
    }
  } catch (error) {
    console.log('Groups collection might not exist yet, skipping default groups creation');
  }

  // Remove the color column from groups table if it exists
  await db.execute(sql`
    ALTER TABLE groups 
    DROP COLUMN IF EXISTS color;
  `);

  // Add the group column to voiceovers table if it doesn't exist
  await db.execute(sql`
    ALTER TABLE voiceovers 
    ADD COLUMN IF NOT EXISTS "group" integer;
  `);

  // Create an index on the group column for better performance
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS idx_voiceovers_group ON voiceovers("group");
  `);

  // Add foreign key constraint
  await db.execute(sql`
    ALTER TABLE voiceovers
    ADD CONSTRAINT fk_voiceovers_group
    FOREIGN KEY ("group") REFERENCES groups(id)
    ON DELETE SET NULL;
  `);

  // Update existing voiceovers to use the first group as default
  const firstGroup = await payload.find({
    collection: 'groups',
    limit: 1,
  });

  if (firstGroup.docs.length > 0) {
    await db.execute(sql`
      UPDATE voiceovers 
      SET "group" = ${firstGroup.docs[0].id}
      WHERE "group" IS NULL;
    `);
  }

  // Remove the old groupSlug column
  await db.execute(sql`
    ALTER TABLE voiceovers 
    DROP COLUMN IF EXISTS "group_slug";
  `);
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  const { db } = payload;

  // Add back the groupSlug column
  await db.execute(sql`
    ALTER TABLE voiceovers 
    ADD COLUMN IF NOT EXISTS "group_slug" varchar;
  `);

  // Remove the foreign key constraint
  await db.execute(sql`
    ALTER TABLE voiceovers
    DROP CONSTRAINT IF EXISTS fk_voiceovers_group;
  `);

  // Remove the index
  await db.execute(sql`
    DROP INDEX IF EXISTS idx_voiceovers_group;
  `);

  // Remove the group column
  await db.execute(sql`
    ALTER TABLE voiceovers 
    DROP COLUMN IF EXISTS "group";
  `);

  // Add back the color column to groups
  await db.execute(sql`
    ALTER TABLE groups 
    ADD COLUMN IF NOT EXISTS color varchar;
  `);
}
