import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres';
import { sql } from 'drizzle-orm';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Voiceovers indexes
  await db.execute(sql`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_voiceovers_status 
    ON voiceovers(status);
  `);

  await db.execute(sql`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_voiceovers_created_at 
    ON voiceovers(created_at DESC);
  `);

  await db.execute(sql`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_voiceovers_slug 
    ON voiceovers(slug);
  `);

  await db.execute(sql`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_voiceovers_status_created 
    ON voiceovers(status, created_at DESC);
  `);

  // Email jobs indexes
  await db.execute(sql`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_email_jobs_status 
    ON "email-jobs"(status);
  `);

  await db.execute(sql`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_email_jobs_scheduled_for 
    ON "email-jobs"(scheduled_for);
  `);

  await db.execute(sql`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_email_jobs_status_scheduled 
    ON "email-jobs"(status, scheduled_for) 
    WHERE status = 'scheduled';
  `);

  await db.execute(sql`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_email_jobs_recipient 
    ON "email-jobs"(recipient);
  `);

  await db.execute(sql`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_email_jobs_sequence 
    ON "email-jobs"(sequence);
  `);

  // Email contacts indexes
  await db.execute(sql`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_email_contacts_email 
    ON "email-contacts"(email);
  `);

  await db.execute(sql`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_email_contacts_subscribed 
    ON "email-contacts"(subscribed);
  `);

  await db.execute(sql`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_email_contacts_subscribed_email 
    ON "email-contacts"(subscribed, email) 
    WHERE subscribed = true;
  `);

  // Bookings indexes
  await db.execute(sql`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_customer 
    ON bookings(customer);
  `);

  await db.execute(sql`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_status 
    ON bookings(status);
  `);

  await db.execute(sql`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_voiceover 
    ON bookings(voiceover);
  `);

  await db.execute(sql`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_customer_status 
    ON bookings(customer, status);
  `);

  await db.execute(sql`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_created_at 
    ON bookings(created_at DESC);
  `);

  // Composite indexes for common query patterns
  await db.execute(sql`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_voiceovers_group_status 
    ON voiceovers("group", status);
  `);

  // Media relationship indexes (for N+1 query prevention)
  await db.execute(sql`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_voiceovers_profile_photo 
    ON voiceovers(profile_photo_id);
  `);

  await db.execute(sql`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_voiceovers_full_demo 
    ON voiceovers(full_demo_reel);
  `);

  await db.execute(sql`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_voiceovers_commercials_demo 
    ON voiceovers(commercials_demo);
  `);

  await db.execute(sql`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_voiceovers_narrative_demo 
    ON voiceovers(narrative_demo);
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Remove voiceovers indexes
  await db.execute(sql`DROP INDEX IF EXISTS idx_voiceovers_status;`);
  await db.execute(sql`DROP INDEX IF EXISTS idx_voiceovers_created_at;`);
  await db.execute(sql`DROP INDEX IF EXISTS idx_voiceovers_slug;`);
  await db.execute(sql`DROP INDEX IF EXISTS idx_voiceovers_status_created;`);
  await db.execute(sql`DROP INDEX IF EXISTS idx_voiceovers_group_status;`);
  await db.execute(sql`DROP INDEX IF EXISTS idx_voiceovers_profile_photo;`);
  await db.execute(sql`DROP INDEX IF EXISTS idx_voiceovers_full_demo;`);
  await db.execute(sql`DROP INDEX IF EXISTS idx_voiceovers_commercials_demo;`);
  await db.execute(sql`DROP INDEX IF EXISTS idx_voiceovers_narrative_demo;`);

  // Remove email jobs indexes
  await db.execute(sql`DROP INDEX IF EXISTS idx_email_jobs_status;`);
  await db.execute(sql`DROP INDEX IF EXISTS idx_email_jobs_scheduled_for;`);
  await db.execute(sql`DROP INDEX IF EXISTS idx_email_jobs_status_scheduled;`);
  await db.execute(sql`DROP INDEX IF EXISTS idx_email_jobs_recipient;`);
  await db.execute(sql`DROP INDEX IF EXISTS idx_email_jobs_sequence;`);

  // Remove email contacts indexes
  await db.execute(sql`DROP INDEX IF EXISTS idx_email_contacts_email;`);
  await db.execute(sql`DROP INDEX IF EXISTS idx_email_contacts_subscribed;`);
  await db.execute(sql`DROP INDEX IF EXISTS idx_email_contacts_subscribed_email;`);

  // Remove bookings indexes
  await db.execute(sql`DROP INDEX IF EXISTS idx_bookings_customer;`);
  await db.execute(sql`DROP INDEX IF EXISTS idx_bookings_status;`);
  await db.execute(sql`DROP INDEX IF EXISTS idx_bookings_voiceover;`);
  await db.execute(sql`DROP INDEX IF EXISTS idx_bookings_customer_status;`);
  await db.execute(sql`DROP INDEX IF EXISTS idx_bookings_created_at;`);
}
