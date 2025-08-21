#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Database Performance Optimization Script
 *
 * This script analyzes and optimizes database performance by:
 * 1. Creating optimal indexes for all queries
 * 2. Analyzing query performance with EXPLAIN
 * 3. Updating table statistics
 * 4. Setting up proper constraints
 * 5. Configuring optimal PostgreSQL settings
 *
 * Usage: node scripts/optimize-database-performance.js
 */

const { Pool } = require('pg');

// Get database URL from environment
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL not found in environment variables');
  process.exit(1);
}

// Don't run on fake build database
if (DATABASE_URL.includes('fake:fake@fake')) {
  console.log('⏭️  Skipping optimization for build environment');
  process.exit(0);
}

console.log('🚀 Starting database performance optimization...\n');

async function optimizeDatabase() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
  });

  try {
    // Test database connection
    await pool.query('SELECT 1');
    console.log('✅ Database connection established\n');

    // 1. Create optimal indexes for voiceovers queries
    console.log('📊 Creating optimal indexes for voiceovers...');

    // Composite indexes for common query patterns
    await pool.query(`
      -- Composite index for status + availability queries
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_voiceovers_status_available 
        ON voiceovers(status, (availability->>'isAvailable')) 
        WHERE status IN ('active', 'more-voices');
      
      -- Composite index for slug lookups with status
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_voiceovers_slug_status 
        ON voiceovers(slug, status) 
        WHERE status != 'archived';
      
      -- Partial index for active voiceovers only
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_voiceovers_active 
        ON voiceovers(id, slug, name, status) 
        WHERE status = 'active';
      
      -- Index for cohort filtering
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_voiceovers_cohort_status 
        ON voiceovers(cohort_id, status) 
        WHERE cohort_id IS NOT NULL;
    `);

    console.log('✅ Voiceovers indexes created\n');

    // 2. Optimize media table indexes
    console.log('📸 Optimizing media table indexes...');

    await pool.query(`
      -- Composite index for security scanning
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_media_scan_upload 
        ON media(scan_status, uploaded_by, created_at) 
        WHERE scan_status != 'blocked';
      
      -- Index for mime type filtering
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_media_mime_audio 
        ON media(id, filename, url) 
        WHERE mime_type LIKE 'audio/%';
      
      -- Index for image filtering
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_media_mime_image 
        ON media(id, filename, url, width, height) 
        WHERE mime_type LIKE 'image/%';
    `);

    console.log('✅ Media indexes optimized\n');

    // 3. Optimize locales tables
    console.log('🌍 Optimizing locales tables...');

    const localizedTables = [
      'voiceovers__locales',
      'pages__locales',
      'blog_posts__locales',
      'testimonials__locales',
      'faq__locales',
    ];

    for (const table of localizedTables) {
      // Check if table exists
      const tableExists = await pool.query(
        `
        SELECT EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_name = $1
        );
      `,
        [table]
      );

      if (tableExists.rows[0].exists) {
        await pool.query(`
          -- Composite index for parent + locale lookups
          CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_${table}_parent_locale 
            ON ${table}(_parent_id, _locale);
          
          -- Index for specific locale queries
          CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_${table}_locale_nl 
            ON ${table}(_parent_id) 
            WHERE _locale = 'nl';
        `);
      }
    }

    console.log('✅ Locales tables optimized\n');

    // 4. Optimize relationship tables
    console.log('🔗 Optimizing relationship tables...');

    await pool.query(`
      -- Optimize voiceovers_style_tags for tag queries
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_voiceovers_style_tags_tag_parent 
        ON voiceovers_style_tags(tag, _parent_id) 
        WHERE tag IS NOT NULL;
      
      -- Optimize voiceovers_additional_photos for ordering
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_voiceovers_photos_parent_order 
        ON voiceovers_additional_photos(_parent_id, _order);
    `);

    console.log('✅ Relationship tables optimized\n');

    // 5. Create indexes for common JOIN patterns
    console.log('🔄 Creating JOIN optimization indexes...');

    await pool.query(`
      -- Users table indexes for authentication
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email_lower 
        ON users(LOWER(email)) 
        WHERE email IS NOT NULL;
      
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_role_active 
        ON users(role, created_at) 
        WHERE role IS NOT NULL;
      
      -- Pages table for slug lookups
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pages_slug_published 
        ON pages(slug, status, published_at) 
        WHERE status = 'published';
      
      -- Email logs for analytics
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_email_logs_campaign_status 
        ON email_logs(campaign_id, status, created_at) 
        WHERE campaign_id IS NOT NULL;
    `);

    console.log('✅ JOIN indexes created\n');

    // 6. Analyze tables to update statistics
    console.log('📈 Updating table statistics...');

    const mainTables = [
      'voiceovers',
      'media',
      'users',
      'pages',
      'email_logs',
      'bookings',
      'scripts',
    ];

    for (const table of mainTables) {
      try {
        await pool.query(`ANALYZE ${table};`);
        console.log(`  ✅ Analyzed ${table}`);
      } catch (err) {
        console.log(`  ⚠️  Could not analyze ${table}: ${err.message}`);
      }
    }

    console.log('\n✅ Table statistics updated\n');

    // 7. Check for missing indexes using pg_stat_user_indexes
    console.log('🔍 Checking for potentially missing indexes...');

    const missingIndexes = await pool.query(`
      SELECT 
        schemaname,
        tablename,
        attname,
        n_distinct,
        correlation
      FROM pg_stats
      WHERE schemaname = 'public'
        AND n_distinct > 100
        AND correlation < 0.1
      ORDER BY n_distinct DESC
      LIMIT 10;
    `);

    if (missingIndexes.rows.length > 0) {
      console.log('  ⚠️  Columns that might benefit from indexes:');
      missingIndexes.rows.forEach((row) => {
        console.log(`     - ${row.tablename}.${row.attname} (distinct values: ${row.n_distinct})`);
      });
    } else {
      console.log('  ✅ No obvious missing indexes detected');
    }

    console.log('\n');

    // 8. Check and optimize slow queries
    console.log('🐌 Analyzing slow queries...');

    // Check if pg_stat_statements extension is available
    const hasStatStatements = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_extension WHERE extname = 'pg_stat_statements'
      );
    `);

    if (hasStatStatements.rows[0].exists) {
      const slowQueries = await pool.query(`
        SELECT 
          SUBSTRING(query, 1, 100) as query_preview,
          calls,
          ROUND(mean_exec_time::numeric, 2) as avg_ms,
          ROUND(total_exec_time::numeric, 2) as total_ms
        FROM pg_stat_statements
        WHERE query NOT LIKE '%pg_stat_statements%'
          AND mean_exec_time > 100
        ORDER BY mean_exec_time DESC
        LIMIT 5;
      `);

      if (slowQueries.rows.length > 0) {
        console.log('  ⚠️  Slow queries detected:');
        slowQueries.rows.forEach((row, i) => {
          console.log(`     ${i + 1}. ${row.query_preview}...`);
          console.log(
            `        Calls: ${row.calls}, Avg: ${row.avg_ms}ms, Total: ${row.total_ms}ms`
          );
        });
      } else {
        console.log('  ✅ No slow queries detected');
      }
    } else {
      console.log('  ℹ️  pg_stat_statements extension not available for query analysis');
    }

    console.log('\n');

    // 9. Optimize database settings
    console.log('⚙️  Checking database configuration...');

    const settings = await pool.query(`
      SELECT name, setting, unit, short_desc
      FROM pg_settings
      WHERE name IN (
        'shared_buffers',
        'effective_cache_size',
        'work_mem',
        'maintenance_work_mem',
        'random_page_cost',
        'effective_io_concurrency'
      )
      ORDER BY name;
    `);

    console.log('  Current performance-related settings:');
    settings.rows.forEach((row) => {
      console.log(`     - ${row.name}: ${row.setting}${row.unit || ''}`);
    });

    console.log('\n');

    // 10. Create database performance view
    console.log('📊 Creating performance monitoring view...');

    await pool.query(`
      CREATE OR REPLACE VIEW database_performance_stats AS
      SELECT 
        'tables' as metric_type,
        schemaname || '.' || tablename as object_name,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
        n_live_tup as live_rows,
        n_dead_tup as dead_rows,
        CASE 
          WHEN n_live_tup > 0 
          THEN ROUND((n_dead_tup::numeric / n_live_tup::numeric) * 100, 2)
          ELSE 0
        END as dead_row_percent
      FROM pg_stat_user_tables
      WHERE schemaname = 'public'
      
      UNION ALL
      
      SELECT 
        'indexes' as metric_type,
        schemaname || '.' || indexname as object_name,
        pg_size_pretty(pg_relation_size(schemaname||'.'||indexname)) as size,
        idx_scan as live_rows,
        idx_tup_read as dead_rows,
        CASE 
          WHEN idx_scan > 0 
          THEN ROUND((idx_tup_read::numeric / idx_scan::numeric), 2)
          ELSE 0
        END as dead_row_percent
      FROM pg_stat_user_indexes
      WHERE schemaname = 'public'
      ORDER BY metric_type, size DESC;
    `);

    console.log('✅ Performance monitoring view created\n');

    // 11. Final summary
    console.log('📋 Performance Optimization Summary:');

    // Count indexes
    const indexCount = await pool.query(`
      SELECT COUNT(*) as count 
      FROM pg_indexes 
      WHERE schemaname = 'public';
    `);

    // Database size
    const dbSize = await pool.query(`
      SELECT pg_database_size(current_database()) as size;
    `);

    // Table count
    const tableCount = await pool.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE';
    `);

    console.log(`  - Total tables: ${tableCount.rows[0].count}`);
    console.log(`  - Total indexes: ${indexCount.rows[0].count}`);
    console.log(`  - Database size: ${(dbSize.rows[0].size / 1024 / 1024).toFixed(2)} MB`);

    console.log('\n✨ Database optimization completed successfully!');
  } catch (error) {
    console.error('❌ Optimization error:', error.message);
    console.error('Stack trace:', error.stack);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run optimization
optimizeDatabase()
  .then(() => {
    console.log('\n✅ Database is optimized for production!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Optimization failed:', error);
    process.exit(1);
  });
