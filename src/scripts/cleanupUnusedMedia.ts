import { Pool } from 'pg';
import dotenv from 'dotenv';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import path from 'path';
import fs from 'fs/promises';

dotenv.config({ path: '.env.local' });

export async function cleanupUnusedMedia() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  console.log('🧹 Media Cleanup Strategy\n');
  console.log('This script will help you avoid duplicates when re-uploading media.\n');

  try {
    // First, verify which media records are truly unused
    const unusedMediaResult = await pool.query(`
      SELECT m.id, m.filename, m.mime_type
      FROM media m
      WHERE NOT EXISTS (
        SELECT 1 FROM voiceovers v WHERE 
          v.profile_photo_id = m.id OR
          v.full_demo_reel_id = m.id OR
          v.commercials_demo_id = m.id OR
          v.narrative_demo_id = m.id
      )
      AND NOT EXISTS (
        SELECT 1 FROM pages_blocks_hero_v1 h WHERE h.image_id = m.id
      )
      AND NOT EXISTS (
        SELECT 1 FROM pages_blocks_content_v1 c WHERE c.image_id = m.id
      )
      AND NOT EXISTS (
        SELECT 1 FROM blog_posts b WHERE 
          b.banner_image_id = m.id OR
          b.meta_image_id = m.id
      )
      AND NOT EXISTS (
        SELECT 1 FROM testimonials t WHERE 
          t.avatar_id = m.id OR
          t.media_audio_file_id = m.id OR
          t.media_video_thumbnail_id = m.id
      )
      AND NOT EXISTS (
        SELECT 1 FROM site_settings s WHERE 
          s.branding_favicon_id = m.id OR
          s.branding_logo_image_id = m.id OR
          s.branding_logo_image_dark_id = m.id OR
          s.default_seo_image_id = m.id OR
          s.top_bar_whatsapp_tooltip_image_id = m.id
      )
      AND NOT EXISTS (
        SELECT 1 FROM users u WHERE u.avatar_id = m.id
      )
      AND NOT EXISTS (
        SELECT 1 FROM voiceovers_additional_photos vap WHERE vap.photo_id = m.id
      )
      ORDER BY m.created_at DESC
    `);

    console.log(`📊 Found ${unusedMediaResult.rows.length} unused media records\n`);

    if (unusedMediaResult.rows.length === 0) {
      console.log('✅ No unused media found. All media is referenced somewhere.');
      return;
    }

    // Group by type
    const byType = {
      images: unusedMediaResult.rows.filter((r) => r.mime_type?.includes('image')),
      audio: unusedMediaResult.rows.filter((r) => r.mime_type?.includes('audio')),
      video: unusedMediaResult.rows.filter((r) => r.mime_type?.includes('video')),
      other: unusedMediaResult.rows.filter(
        (r) =>
          !r.mime_type?.includes('image') &&
          !r.mime_type?.includes('audio') &&
          !r.mime_type?.includes('video')
      ),
    };

    console.log('📁 Unused media by type:');
    console.log(`  🖼️  Images: ${byType.images.length}`);
    console.log(`  🎵 Audio: ${byType.audio.length}`);
    console.log(`  📹 Video: ${byType.video.length}`);
    console.log(`  📄 Other: ${byType.other.length}`);

    // Create SQL for cleanup
    const deleteIds = unusedMediaResult.rows.map((r) => r.id);
    const deleteSql = `DELETE FROM media WHERE id IN (${deleteIds.join(', ')})`;

    console.log('\n💾 Saving cleanup SQL...');
    await fs.writeFile(
      'cleanup-unused-media.sql',
      `-- Cleanup unused media records
-- Generated: ${new Date().toISOString()}
-- Total records to delete: ${deleteIds.length}

-- First, let's verify what we're deleting
SELECT id, filename, mime_type, created_at 
FROM media 
WHERE id IN (${deleteIds.join(', ')})
ORDER BY created_at DESC;

-- Uncomment below to actually delete
-- ${deleteSql};

-- After deletion, you can re-upload files with the same names
-- and they will create new records without duplicates.
`,
      'utf-8'
    );

    console.log('✅ Created cleanup-unused-media.sql');

    // Create a list of filenames for reference
    const filenamesList = unusedMediaResult.rows
      .map((r) => `${r.filename} (${r.mime_type || 'unknown type'})`)
      .join('\n');

    await fs.writeFile(
      'media-files-to-reupload.txt',
      `Media files that need to be re-uploaded
Generated: ${new Date().toISOString()}

After running the cleanup SQL, you can re-upload these files:

${filenamesList}

Note: The video files already exist in public/videos/ directory.
`,
      'utf-8'
    );

    console.log('✅ Created media-files-to-reupload.txt');

    console.log('\n📋 Next Steps:');
    console.log('1. Review cleanup-unused-media.sql');
    console.log('2. Run the SQL to delete unused records');
    console.log('3. Re-upload media files with the SAME filenames');
    console.log('4. This will prevent duplicates!\n');

    console.log('⚠️  IMPORTANT: The MinIO storage contains corrupted files (HTML pages).');
    console.log('You will need to upload the actual media files from your local backup.');
  } catch (error) {
    console.error('❌ Error during cleanup analysis:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (import.meta.main) {
  cleanupUnusedMedia()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
