import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export async function analyzeMediaUsage() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  console.log('🔍 Analyzing media usage to prevent duplicates...\n');

  try {
    // Check voiceovers media usage
    const voiceoverMediaResult = await pool.query(`
      SELECT 
        v.name as voiceover_name,
        m1.id as profile_photo_id,
        m1.filename as profile_photo,
        m2.id as demo_reel_id,
        m2.filename as demo_reel,
        m3.id as commercials_demo_id,
        m3.filename as commercials_demo,
        m4.id as narrative_demo_id,
        m4.filename as narrative_demo
      FROM voiceovers v
      LEFT JOIN media m1 ON v.profile_photo_id = m1.id
      LEFT JOIN media m2 ON v.full_demo_reel_id = m2.id
      LEFT JOIN media m3 ON v.commercials_demo_id = m3.id
      LEFT JOIN media m4 ON v.narrative_demo_id = m4.id
      WHERE v.profile_photo_id IS NOT NULL 
         OR v.full_demo_reel_id IS NOT NULL
         OR v.commercials_demo_id IS NOT NULL
         OR v.narrative_demo_id IS NOT NULL
      ORDER BY v.name
    `);

    console.log('👥 Voiceover Media Files:');
    const voiceoverMediaIds = new Set();
    voiceoverMediaResult.rows.forEach((row) => {
      console.log(`\n${row.voiceover_name}:`);
      if (row.profile_photo) {
        console.log(`  📸 Profile: ${row.profile_photo}`);
        voiceoverMediaIds.add(row.profile_photo_id);
      }
      if (row.demo_reel) {
        console.log(`  🎵 Demo Reel: ${row.demo_reel}`);
        voiceoverMediaIds.add(row.demo_reel_id);
      }
      if (row.commercials_demo) {
        console.log(`  🎵 Commercials Demo: ${row.commercials_demo}`);
        voiceoverMediaIds.add(row.commercials_demo_id);
      }
      if (row.narrative_demo) {
        console.log(`  🎵 Narrative Demo: ${row.narrative_demo}`);
        voiceoverMediaIds.add(row.narrative_demo_id);
      }
    });

    // Check page hero images
    const heroImagesResult = await pool.query(`
      SELECT DISTINCT
        h.image_id,
        m.filename,
        p.title as page_title
      FROM pages_blocks_hero_v1 h
      JOIN pages p ON h._parent_id = p.id
      JOIN media m ON h.image_id = m.id
      WHERE h.image_id IS NOT NULL
    `);

    console.log('\n\n🖼️  Page Hero Images:');
    const pageMediaIds = new Set();
    heroImagesResult.rows.forEach((row) => {
      console.log(`  - ${row.filename} (used in: ${row.page_title})`);
      pageMediaIds.add(row.image_id);
    });

    // Check all media files and their usage
    const allMediaResult = await pool.query(`
      SELECT 
        id,
        filename,
        mime_type,
        created_at
      FROM media
      WHERE filename IS NOT NULL
      ORDER BY created_at DESC
    `);

    const allUsedIds = new Set([...voiceoverMediaIds, ...pageMediaIds]);
    const unusedMedia = allMediaResult.rows.filter((row) => !allUsedIds.has(row.id));

    console.log(`\n\n📊 Media Usage Summary:`);
    console.log(`  - Total media files: ${allMediaResult.rows.length}`);
    console.log(`  - Used in voiceovers: ${voiceoverMediaIds.size}`);
    console.log(`  - Used in pages: ${pageMediaIds.size}`);
    console.log(`  - Unused files: ${unusedMedia.length}`);

    if (unusedMedia.length > 0) {
      console.log('\n🗑️  Unused Media Files (can be cleaned up):');
      unusedMedia.forEach((row) => {
        const type = row.mime_type?.includes('audio')
          ? '🎵'
          : row.mime_type?.includes('image')
            ? '🖼️'
            : row.mime_type?.includes('video')
              ? '📹'
              : '📄';
        console.log(`  ${type} ${row.filename} (ID: ${row.id})`);
      });
    }

    console.log('\n\n💡 SOLUTION TO AVOID DUPLICATES:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. First, clean up unused media records:');
    console.log('   - This will free up filenames for re-use');
    console.log(
      '   - Run: DELETE FROM media WHERE id IN (' + unusedMedia.map((m) => m.id).join(', ') + ')'
    );
    console.log('\n2. Then, when re-uploading:');
    console.log('   - Use the SAME filenames as before');
    console.log('   - Payload will update existing records instead of creating new ones');
    console.log('\n3. Alternative: Create placeholder files:');
    console.log('   - Generate simple placeholder images/audio files');
    console.log('   - Upload them with the exact filenames expected');
  } catch (error) {
    console.error('❌ Error analyzing media:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (import.meta.main) {
  analyzeMediaUsage()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
