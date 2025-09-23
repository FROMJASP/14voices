import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export async function checkDuplicateRisk() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  console.log('🔍 Checking media records and their usage...\n');

  try {
    // Check where media files are referenced
    console.log('📊 Media Usage Analysis:\n');

    // Check in Pages collection
    const pagesResult = await pool.query(`
      SELECT COUNT(*) as count
      FROM pages
      WHERE content::text LIKE '%"id":%' 
      AND content::text LIKE '%media%'
    `);
    console.log(`Pages with media references: ${pagesResult.rows[0].count}`);

    // Check in Voiceovers collection
    const voiceoversResult = await pool.query(`
      SELECT COUNT(*) as count, 
             COUNT(DISTINCT portrait_id) as portrait_count,
             COUNT(DISTINCT full_demo_reel_id) as demo_count
      FROM voiceovers
      WHERE portrait_id IS NOT NULL 
         OR full_demo_reel_id IS NOT NULL
    `);
    console.log(`Voiceovers with portraits: ${voiceoversResult.rows[0].portrait_count}`);
    console.log(`Voiceovers with demo reels: ${voiceoversResult.rows[0].demo_count}`);

    // Get specific media references from voiceovers
    const voiceoverMediaResult = await pool.query(`
      SELECT v.name as voiceover_name, 
             m1.filename as portrait_filename,
             m2.filename as demo_filename
      FROM voiceovers v
      LEFT JOIN media m1 ON v.portrait_id = m1.id
      LEFT JOIN media m2 ON v.full_demo_reel_id = m2.id
      WHERE v.portrait_id IS NOT NULL OR v.full_demo_reel_id IS NOT NULL
      ORDER BY v.name
    `);

    console.log('\n📸 Voiceover Media Files:');
    voiceoverMediaResult.rows.forEach((row) => {
      console.log(`\n${row.voiceover_name}:`);
      if (row.portrait_filename) console.log(`  Portrait: ${row.portrait_filename}`);
      if (row.demo_filename) console.log(`  Demo: ${row.demo_filename}`);
    });

    // Check for orphaned media (not referenced anywhere)
    const orphanedResult = await pool.query(`
      SELECT m.id, m.filename, m.mime_type, m.created_at
      FROM media m
      WHERE NOT EXISTS (
        SELECT 1 FROM voiceovers v 
        WHERE v.portrait_id = m.id OR v.full_demo_reel_id = m.id
      )
      AND NOT EXISTS (
        SELECT 1 FROM pages p 
        WHERE p.content::text LIKE '%"id":' || m.id || '%'
      )
      ORDER BY m.created_at DESC
    `);

    console.log(`\n🗑️  Potentially Orphaned Media: ${orphanedResult.rows.length} files`);
    if (orphanedResult.rows.length > 0) {
      console.log('\nOrphaned files:');
      orphanedResult.rows.forEach((row) => {
        console.log(`  - ${row.filename} (ID: ${row.id}, created: ${row.created_at})`);
      });
    }

    // Solution suggestion
    console.log('\n💡 Recommended Solution:');
    console.log('1. Instead of re-uploading, we can:');
    console.log('   - Create placeholder images for missing portraits');
    console.log('   - Use existing demo files where available');
    console.log('   - Only upload truly missing critical files');
    console.log('\n2. For orphaned media records:');
    console.log('   - These can be safely deleted from the database');
    console.log('   - This will prevent duplicates when re-uploading');
  } catch (error) {
    console.error('❌ Error checking media:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (import.meta.main) {
  checkDuplicateRisk()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
