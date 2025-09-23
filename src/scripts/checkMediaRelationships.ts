import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export async function checkMediaRelationships() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  console.log('🔍 Analyzing media relationships to avoid duplicates...\n');

  try {
    // First, let's see what tables reference media
    const tablesResult = await pool.query(`
      SELECT DISTINCT 
        tc.table_name,
        kcu.column_name
      FROM information_schema.table_constraints tc 
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage ccu 
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND ccu.table_name = 'media'
      ORDER BY tc.table_name, kcu.column_name
    `);

    console.log('📋 Tables with media relationships:');
    tablesResult.rows.forEach((row) => {
      console.log(`  - ${row.table_name}.${row.column_name} → media`);
    });

    // Get voiceovers table structure
    const voiceoverColsResult = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'voiceovers' 
      AND column_name LIKE '%media%' OR column_name LIKE '%portrait%' OR column_name LIKE '%demo%'
      ORDER BY ordinal_position
    `);

    console.log('\n📊 Voiceover media columns:');
    voiceoverColsResult.rows.forEach((row) => {
      console.log(`  - ${row.column_name} (${row.data_type})`);
    });

    // Count media records by type
    const mediaStatsResult = await pool.query(`
      SELECT 
        CASE 
          WHEN filename LIKE '%.mp3' THEN 'Audio'
          WHEN filename LIKE '%.mp4' THEN 'Video'
          WHEN filename LIKE '%.jpg' OR filename LIKE '%.jpeg' OR filename LIKE '%.png' THEN 'Image'
          ELSE 'Other'
        END as file_type,
        COUNT(*) as count
      FROM media
      WHERE filename IS NOT NULL
      GROUP BY file_type
      ORDER BY count DESC
    `);

    console.log('\n📈 Media files by type:');
    mediaStatsResult.rows.forEach((row) => {
      console.log(`  - ${row.file_type}: ${row.count} files`);
    });

    // Check for media referenced in JSON fields
    const jsonRefsResult = await pool.query(`
      SELECT 'pages' as collection, COUNT(*) as count
      FROM pages
      WHERE hero::text LIKE '%media%' 
         OR content::text LIKE '%media%'
         OR layout::text LIKE '%media%'
    `);

    console.log('\n🔗 Media references in JSON fields:');
    jsonRefsResult.rows.forEach((row) => {
      console.log(`  - ${row.collection}: ${row.count} documents with media references`);
    });

    // Get all media records with their usage status
    const mediaUsageResult = await pool.query(`
      SELECT 
        m.id,
        m.filename,
        m.mime_type,
        m.created_at,
        CASE 
          WHEN EXISTS (
            SELECT 1 FROM pages p 
            WHERE p.hero::text LIKE '%"id":' || m.id || '%'
               OR p.content::text LIKE '%"id":' || m.id || '%'
               OR p.layout::text LIKE '%"id":' || m.id || '%'
          ) THEN 'Used in Pages'
          ELSE 'Not used'
        END as usage_status
      FROM media m
      WHERE m.filename IS NOT NULL
      ORDER BY usage_status, m.created_at DESC
    `);

    const usedCount = mediaUsageResult.rows.filter(
      (r) => r.usage_status === 'Used in Pages'
    ).length;
    const unusedCount = mediaUsageResult.rows.filter((r) => r.usage_status === 'Not used').length;

    console.log(`\n📊 Media Usage Summary:`);
    console.log(`  - Used media files: ${usedCount}`);
    console.log(`  - Unused media files: ${unusedCount}`);

    if (unusedCount > 0) {
      console.log('\n🗑️  Unused media files (safe to clean up):');
      mediaUsageResult.rows
        .filter((r) => r.usage_status === 'Not used')
        .forEach((row) => {
          console.log(`  - ${row.filename} (ID: ${row.id})`);
        });
    }

    console.log('\n💡 Recommendations:');
    console.log('1. Clean up unused media records before re-uploading to avoid duplicates');
    console.log('2. Use a script to delete orphaned media records');
    console.log('3. Create placeholder images for missing files instead of re-uploading');
    console.log('4. Only re-upload truly critical missing files');
  } catch (error) {
    console.error('❌ Error analyzing media:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (import.meta.main) {
  checkMediaRelationships()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
