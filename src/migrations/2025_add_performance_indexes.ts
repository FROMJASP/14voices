import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres';

/**
 * Add performance indexes for commonly queried fields
 * This migration adds indexes to improve query performance across the application
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  console.log('Creating performance indexes...');

  try {
    // Voiceovers collection indexes
    await db.execute(`
      -- Index for status queries (active, more-voices, etc.)
      CREATE INDEX IF NOT EXISTS idx_voiceovers_status 
      ON voiceovers(status) 
      WHERE status IS NOT NULL;
      
      -- Index for slug lookups
      CREATE INDEX IF NOT EXISTS idx_voiceovers_slug 
      ON voiceovers(slug) 
      WHERE slug IS NOT NULL;
      
      -- Composite index for status + updatedAt (common filter + sort)
      CREATE INDEX IF NOT EXISTS idx_voiceovers_status_updated 
      ON voiceovers(status, "updatedAt" DESC);
      
      -- Full text search index for voiceover search
      CREATE INDEX IF NOT EXISTS idx_voiceovers_search 
      ON voiceovers 
      USING gin(to_tsvector('english', COALESCE(name, '') || ' ' || COALESCE(bio, '')));
    `);

    // Blog posts indexes
    await db.execute(`
      -- Index for published blog posts
      CREATE INDEX IF NOT EXISTS idx_blog_posts_status 
      ON blog_posts(status) 
      WHERE status = 'published';
      
      -- Index for slug lookups
      CREATE INDEX IF NOT EXISTS idx_blog_posts_slug 
      ON blog_posts(slug) 
      WHERE slug IS NOT NULL;
      
      -- Composite index for status + publishedDate (blog listing queries)
      CREATE INDEX IF NOT EXISTS idx_blog_posts_published 
      ON blog_posts(status, "publishedDate" DESC) 
      WHERE status = 'published';
      
      -- Index for category relationships
      CREATE INDEX IF NOT EXISTS idx_blog_posts_category 
      ON blog_posts(category) 
      WHERE category IS NOT NULL;
    `);

    // Pages collection indexes
    await db.execute(`
      -- Index for page slugs
      CREATE INDEX IF NOT EXISTS idx_pages_slug 
      ON pages(slug) 
      WHERE slug IS NOT NULL;
      
      -- Index for published pages
      CREATE INDEX IF NOT EXISTS idx_pages_status 
      ON pages(status) 
      WHERE status = 'published';
    `);

    // Categories collection indexes
    await db.execute(`
      -- Index for category slugs
      CREATE INDEX IF NOT EXISTS idx_categories_slug 
      ON categories(slug) 
      WHERE slug IS NOT NULL;
    `);

    // Media collection indexes
    await db.execute(`
      -- Index for filename searches
      CREATE INDEX IF NOT EXISTS idx_media_filename 
      ON media(filename) 
      WHERE filename IS NOT NULL;
      
      -- Index for mime type filtering
      CREATE INDEX IF NOT EXISTS idx_media_mimetype 
      ON media("mimeType") 
      WHERE "mimeType" IS NOT NULL;
    `);

    // Users collection indexes
    await db.execute(`
      -- Index for email lookups (authentication)
      CREATE INDEX IF NOT EXISTS idx_users_email 
      ON users(email) 
      WHERE email IS NOT NULL;
      
      -- Index for role-based queries
      CREATE INDEX IF NOT EXISTS idx_users_role 
      ON users(role) 
      WHERE role IS NOT NULL;
    `);

    // Form submissions indexes
    await db.execute(`
      -- Index for form submissions by form
      CREATE INDEX IF NOT EXISTS idx_form_submissions_form 
      ON form_submissions(form) 
      WHERE form IS NOT NULL;
      
      -- Index for submission timestamps
      CREATE INDEX IF NOT EXISTS idx_form_submissions_created 
      ON form_submissions("createdAt" DESC);
    `);

    // Email logs indexes for monitoring
    await db.execute(`
      -- Index for email status monitoring
      CREATE INDEX IF NOT EXISTS idx_email_logs_status 
      ON email_logs(status) 
      WHERE status IS NOT NULL;
      
      -- Index for email type filtering
      CREATE INDEX IF NOT EXISTS idx_email_logs_type 
      ON email_logs(type) 
      WHERE type IS NOT NULL;
      
      -- Composite index for status + createdAt (monitoring queries)
      CREATE INDEX IF NOT EXISTS idx_email_logs_monitoring 
      ON email_logs(status, "createdAt" DESC);
    `);

    // Security logs indexes
    await db.execute(`
      -- Index for event type queries
      CREATE INDEX IF NOT EXISTS idx_security_logs_event 
      ON security_logs("eventType") 
      WHERE "eventType" IS NOT NULL;
      
      -- Index for severity filtering
      CREATE INDEX IF NOT EXISTS idx_security_logs_severity 
      ON security_logs(severity) 
      WHERE severity IS NOT NULL;
      
      -- Composite index for monitoring (severity + timestamp)
      CREATE INDEX IF NOT EXISTS idx_security_logs_monitoring 
      ON security_logs(severity, "createdAt" DESC);
    `);

    console.log('Performance indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
    throw error;
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  console.log('Dropping performance indexes...');

  try {
    // Drop all indexes in reverse order
    await db.execute(`
      -- Security logs
      DROP INDEX IF EXISTS idx_security_logs_monitoring;
      DROP INDEX IF EXISTS idx_security_logs_severity;
      DROP INDEX IF EXISTS idx_security_logs_event;
      
      -- Email logs
      DROP INDEX IF EXISTS idx_email_logs_monitoring;
      DROP INDEX IF EXISTS idx_email_logs_type;
      DROP INDEX IF EXISTS idx_email_logs_status;
      
      -- Form submissions
      DROP INDEX IF EXISTS idx_form_submissions_created;
      DROP INDEX IF EXISTS idx_form_submissions_form;
      
      -- Users
      DROP INDEX IF EXISTS idx_users_role;
      DROP INDEX IF EXISTS idx_users_email;
      
      -- Media
      DROP INDEX IF EXISTS idx_media_mimetype;
      DROP INDEX IF EXISTS idx_media_filename;
      
      -- Categories
      DROP INDEX IF EXISTS idx_categories_slug;
      
      -- Pages
      DROP INDEX IF EXISTS idx_pages_status;
      DROP INDEX IF EXISTS idx_pages_slug;
      
      -- Blog posts
      DROP INDEX IF EXISTS idx_blog_posts_category;
      DROP INDEX IF EXISTS idx_blog_posts_published;
      DROP INDEX IF EXISTS idx_blog_posts_slug;
      DROP INDEX IF EXISTS idx_blog_posts_status;
      
      -- Voiceovers
      DROP INDEX IF EXISTS idx_voiceovers_search;
      DROP INDEX IF EXISTS idx_voiceovers_status_updated;
      DROP INDEX IF EXISTS idx_voiceovers_slug;
      DROP INDEX IF EXISTS idx_voiceovers_status;
    `);

    console.log('Performance indexes dropped successfully');
  } catch (error) {
    console.error('Error dropping indexes:', error);
    throw error;
  }
}
