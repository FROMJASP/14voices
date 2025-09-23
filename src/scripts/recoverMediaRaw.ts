import { Pool } from 'pg';
import { v4 as uuid } from 'uuid';
import path from 'path';
import mime from 'mime-types';

// Manual mapping of files we know exist in storage
const KNOWN_FILES = [
  // Audio files
  { filename: 'Bjo_rn-full-Demo-reel_1756831589510.mp3', type: 'audio', size: 4309514 },
  { filename: 'Gina-Demo_1756819589316.mp3', type: 'audio', size: 2193808 },
  { filename: 'Jorien-full-demo-reel_1756827433284.mp3', type: 'audio', size: 4310968 },
  { filename: 'Michelle-Full-Demo-reel_1756828103959.mp3', type: 'audio', size: 2391240 },
  { filename: 'Oguilvio-Full-Demo-Reel_1756827933923.mp3', type: 'audio', size: 3355848 },
  { filename: 'Sabine-Demo_1756827747714.mp3', type: 'audio', size: 2054424 },
  { filename: 'ivan-full-demo-reel_1756831364726.mp3', type: 'audio', size: 0 },

  // Main images (not variants)
  { filename: 'Bjorn-portret_1756831503805.jpg', type: 'image', variants: ['400x300'] },
  {
    filename: 'Ivan_1756831231250.jpg',
    type: 'image',
    variants: ['400x300', '768x1024', '1024x1293'],
  },
  {
    filename: 'Michelle-portet_1756828385087.jpg',
    type: 'image',
    variants: ['400x300', '768x1024'],
  },
  {
    filename: 'Oguilvio_1756827865158.jpg',
    type: 'image',
    variants: ['400x300', '768x1024', '1024x1280'],
  },
  {
    filename: 'T308TMLTU-U308TMLV8-4fba3b66ba84-512_1757944406369.png',
    type: 'image',
    variants: ['400x300'],
  },
  { filename: 'camilla_1757945165753.png', type: 'image', variants: ['400x300'] },
  { filename: 'gina_1756819501697.png', type: 'image', variants: ['400x300', '768x1024'] },
  { filename: 'hero-image_1756746260304.png', type: 'image', variants: ['400x300', '768x1024'] },
  { filename: 'jan_1757944664431.jpeg', type: 'image', variants: ['400x300'] },
  { filename: 'jasp-avatar_1756391814877.jpg', type: 'avatar', variants: ['400x300'] },
  { filename: 'jasp-avatar_1756395782624.jpg', type: 'avatar', variants: [] },
  { filename: 'jasp_1756455422733.jpeg', type: 'avatar', variants: ['400x300'] },
  { filename: 'jorien_1756827355452', type: 'image', variants: ['400x300'] },
  { filename: 'lune_1757945319258.png', type: 'image', variants: ['400x300'] },
  { filename: 'mabel_1757944756546.jpeg', type: 'image', variants: ['400x300'] },
  { filename: 'malou_1757945069112.png', type: 'image', variants: ['400x300'] },
  { filename: 'mike_1757945241386.jpeg', type: 'image', variants: ['400x300'] },
  { filename: 'nienke_1757944950725.jpeg', type: 'image', variants: ['400x300'] },
  { filename: 'rinus_1757944548634.jpeg', type: 'image', variants: ['400x300'] },
  { filename: 'sabine-portret_1756827684881', type: 'image', variants: ['400x300'] },
  { filename: 'thyrza_1757944852461.png', type: 'image', variants: ['400x300'] },
  {
    filename: 'vrouw-die-koptelefoon-draagt-op-station_1756911823149',
    type: 'image',
    variants: ['400x300', '768x1024', '1024x574'],
  },

  // Video
  { filename: 'videoproductie.mp4', type: 'video', size: 2203911 },
];

export async function recoverMediaRaw() {
  console.log('🔍 Starting RAW database media recovery...');
  console.log('⚠️  This bypasses all Payload validation\n');

  // Create database connection
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  let recoveredFiles = 0;
  let skippedFiles = 0;

  // Use localhost URLs for local development
  const baseUrl = 'http://localhost:3000/api/media/file';

  try {
    // Check if media table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'media'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.error('❌ Media table does not exist!');
      return;
    }

    for (const fileInfo of KNOWN_FILES) {
      const { filename, type, variants = [], size } = fileInfo;

      // Skip variant files themselves
      if (
        filename.includes('-400x300') ||
        filename.includes('-768x1024') ||
        filename.includes('-1024x')
      ) {
        continue;
      }

      // Check if media already exists
      const existing = await pool.query('SELECT id FROM media WHERE filename = $1', [filename]);

      if (existing.rows.length > 0) {
        console.log(`✅ Already exists: ${filename}`);
        skippedFiles++;
        continue;
      }

      console.log(`📄 Creating: ${filename}`);

      try {
        // Determine mime type
        const extension = path.extname(filename).toLowerCase();
        let mimeType = mime.lookup(filename) || 'application/octet-stream';

        // Override for files without extension
        if (!extension) {
          if (type === 'image') mimeType = 'image/jpeg';
          else if (type === 'audio') mimeType = 'audio/mpeg';
        }

        // Create sizes object for images with variants
        let sizes = null;
        let thumbnailURL = `${baseUrl}/${filename}`;

        if (type === 'image' && variants.length > 0) {
          const sizesObj: Record<string, any> = {};
          const baseName = filename.replace(/\.[^/.]+$/, '');
          const ext = extension || '.jpg';

          for (const variant of variants) {
            const variantFilename = `${baseName}-${variant}${ext}`;

            const sizeName =
              variant === '400x300'
                ? 'thumbnail'
                : variant === '768x1024'
                  ? 'card'
                  : variant === '1024x574'
                    ? 'tablet'
                    : variant === '1024x1280'
                      ? 'tablet'
                      : variant === '1024x1293'
                        ? 'tablet'
                        : variant;

            sizesObj[sizeName] = {
              filename: variantFilename,
              mimeType: mimeType,
              filesize: 0,
              width: parseInt(variant.split('x')[0]) || null,
              height: parseInt(variant.split('x')[1]) || null,
              url: `${baseUrl}/${variantFilename}`,
            };
          }

          sizes = sizesObj;

          // Use thumbnail for thumbnailURL if available
          if (sizesObj.thumbnail) {
            thumbnailURL = sizesObj.thumbnail.url;
          }
        }

        // Insert into database
        const id = Math.floor(Math.random() * 1000000); // Generate numeric ID
        const now = new Date();

        const result = await pool.query(
          `
          INSERT INTO media (
            id, filename, alt, mime_type, filesize, url, 
            scan_status, scan_details, thumbnail_u_r_l, 
            sizes_thumbnail_url, sizes_thumbnail_width, sizes_thumbnail_height,
            sizes_thumbnail_mime_type, sizes_thumbnail_filesize, sizes_thumbnail_filename,
            sizes_card_url, sizes_card_width, sizes_card_height,
            sizes_card_mime_type, sizes_card_filesize, sizes_card_filename,
            sizes_tablet_url, sizes_tablet_width, sizes_tablet_height,
            sizes_tablet_mime_type, sizes_tablet_filesize, sizes_tablet_filename,
            created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9,
            $10, $11, $12, $13, $14, $15,
            $16, $17, $18, $19, $20, $21,
            $22, $23, $24, $25, $26, $27,
            $28, $29
          )
          RETURNING id
        `,
          [
            id,
            filename,
            filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '), // alt text
            mimeType,
            size || 0,
            `${baseUrl}/${filename}`,
            'safe',
            JSON.stringify({
              scannedAt: now,
              note: 'Manually recovered from storage - RAW database insert',
            }),
            thumbnailURL,
            // Thumbnail size
            sizes?.thumbnail?.url || null,
            sizes?.thumbnail?.width || null,
            sizes?.thumbnail?.height || null,
            sizes?.thumbnail?.mimeType || null,
            sizes?.thumbnail?.filesize || null,
            sizes?.thumbnail?.filename || null,
            // Card size
            sizes?.card?.url || null,
            sizes?.card?.width || null,
            sizes?.card?.height || null,
            sizes?.card?.mimeType || null,
            sizes?.card?.filesize || null,
            sizes?.card?.filename || null,
            // Tablet size
            sizes?.tablet?.url || null,
            sizes?.tablet?.width || null,
            sizes?.tablet?.height || null,
            sizes?.tablet?.mimeType || null,
            sizes?.tablet?.filesize || null,
            sizes?.tablet?.filename || null,
            now,
            now,
          ]
        );

        console.log(`  ✅ Created: ${filename} (ID: ${result.rows[0].id})`);
        recoveredFiles++;
      } catch (error) {
        console.error(`  ❌ Error creating ${filename}:`, error);
      }
    }

    console.log('\n📊 Recovery Summary:');
    console.log(`  Files processed: ${KNOWN_FILES.length}`);
    console.log(`  Files recovered: ${recoveredFiles}`);
    console.log(`  Files skipped (already exist): ${skippedFiles}`);
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  recoverMediaRaw()
    .then(() => {
      console.log('✅ Raw media recovery completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Raw media recovery failed:', error);
      process.exit(1);
    });
}
