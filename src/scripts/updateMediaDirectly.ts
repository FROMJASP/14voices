import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export async function updateMediaDirectly() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  console.log('🔄 Updating media records directly in database...\n');

  // Map of known video files
  const videoFiles = {
    'videoproductie.mp4': '/videos/videoproductie.mp4',
    'tv-commercial.mp4': '/videos/tv-commercial.mp4',
    'web-commercial.mp4': '/videos/web-commercial.mp4',
    'e-learning.mp4': '/videos/e-learning.mp4',
    'radiospot.mp4': '/videos/radiospot.mp4',
    'voice-response.mp4': '/videos/voice-response.mp4',
  };

  try {
    // Get all media records
    const result = await pool.query(`
      SELECT id, filename, url, thumbnail_u_r_l, mime_type
      FROM media
      ORDER BY id
    `);

    console.log(`Found ${result.rows.length} media records\n`);

    let updatedCount = 0;
    let videoCount = 0;
    let imageCount = 0;
    let audioCount = 0;

    for (const row of result.rows) {
      const { id, filename, mime_type } = row;

      if (!filename) {
        console.log(`⚠️  No filename for media ID ${id}`);
        continue;
      }

      // Check if it's a video file we have locally
      if (videoFiles[filename]) {
        const localUrl = videoFiles[filename];
        console.log(`📹 Updating video: ${filename} -> ${localUrl}`);

        await pool.query(
          `
          UPDATE media
          SET url = $1, thumbnail_u_r_l = $1
          WHERE id = $2
        `,
          [localUrl, id]
        );

        videoCount++;
        updatedCount++;
        continue;
      }

      // For all other files, update to use local media path
      const localUrl = `/media/${filename}`;

      if (filename.endsWith('.mp3')) {
        console.log(`🎵 Updating audio: ${filename} -> ${localUrl}`);
        audioCount++;
      } else if (filename.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        console.log(`🖼️  Updating image: ${filename} -> ${localUrl}`);
        imageCount++;
      } else {
        console.log(`📄 Updating other: ${filename} -> ${localUrl}`);
      }

      await pool.query(
        `
        UPDATE media
        SET url = $1, thumbnail_u_r_l = $1
        WHERE id = $2
      `,
        [localUrl, id]
      );

      updatedCount++;
    }

    // Also update the sizes URLs
    console.log('\n🔄 Updating size variant URLs...');

    await pool.query(`
      UPDATE media
      SET sizes_thumbnail_url = REPLACE(sizes_thumbnail_url, 'http://localhost:3000/api/media/file/', '/media/')
      WHERE sizes_thumbnail_url IS NOT NULL AND sizes_thumbnail_url LIKE 'http://localhost:3000/api/media/file/%'
    `);

    await pool.query(`
      UPDATE media
      SET sizes_card_url = REPLACE(sizes_card_url, 'http://localhost:3000/api/media/file/', '/media/')
      WHERE sizes_card_url IS NOT NULL AND sizes_card_url LIKE 'http://localhost:3000/api/media/file/%'
    `);

    await pool.query(`
      UPDATE media
      SET sizes_tablet_url = REPLACE(sizes_tablet_url, 'http://localhost:3000/api/media/file/', '/media/')
      WHERE sizes_tablet_url IS NOT NULL AND sizes_tablet_url LIKE 'http://localhost:3000/api/media/file/%'
    `);

    console.log('\n📊 Update Summary:');
    console.log(`  ✅ Total records updated: ${updatedCount}`);
    console.log(`  📹 Video files: ${videoCount}`);
    console.log(`  🖼️  Image files: ${imageCount}`);
    console.log(`  🎵 Audio files: ${audioCount}`);

    // Show current status
    console.log('\n📝 File Status:');
    console.log('Video files (available in /videos):');
    Object.keys(videoFiles).forEach((file) => {
      console.log(`  ✅ ${file}`);
    });

    console.log('\nOther files (need to be re-uploaded):');
    const missingResult = await pool.query(
      `
      SELECT DISTINCT filename, mime_type
      FROM media
      WHERE filename IS NOT NULL
      AND filename NOT IN (${Object.keys(videoFiles)
        .map((_, i) => `$${i + 1}`)
        .join(',')})
      ORDER BY filename
    `,
      Object.keys(videoFiles)
    );

    missingResult.rows.forEach((row) => {
      const type = row.filename.endsWith('.mp3')
        ? 'audio'
        : row.filename.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)
          ? 'image'
          : 'other';
      console.log(`  ❌ ${row.filename} (${type})`);
    });
  } catch (error) {
    console.error('❌ Error updating media records:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (import.meta.main) {
  updateMediaDirectly()
    .then(() => {
      console.log('\n✅ Media update completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Media update failed:', error);
      process.exit(1);
    });
}
