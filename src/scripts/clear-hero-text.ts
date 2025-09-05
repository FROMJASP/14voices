import { sql } from '@payloadcms/db-postgres';
import * as dotenv from 'dotenv';
import path from 'path';
import { Pool } from 'pg';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function clearHeroTextData() {
  // Connect directly to the database
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Connecting to database...');
    
    // Clear plain text title and description from hero blocks in pages table
    const result = await pool.query(`
      UPDATE pages
      SET layout = (
        SELECT jsonb_agg(
          CASE 
            WHEN block->>'blockType' IN ('hero-v1', 'hero-v2') THEN
              jsonb_set(
                jsonb_set(
                  jsonb_set(
                    block,
                    '{title}',
                    'null'::jsonb,
                    false
                  ),
                  '{description}',
                  'null'::jsonb,
                  false
                ),
                '{subtitle}',
                CASE 
                  WHEN block->>'blockType' = 'hero-v2' THEN 'null'::jsonb
                  ELSE block->'subtitle'
                END,
                false
              )
            ELSE block
          END
        )
        FROM jsonb_array_elements(layout) AS block
      )
      WHERE layout IS NOT NULL
      RETURNING slug
    `);

    console.log(`Updated ${result.rowCount} pages`);
    
    if (result.rows.length > 0) {
      console.log('Updated pages:', result.rows.map(r => r.slug).join(', '));
    }

    console.log('\n✓ Successfully cleared plain text data from hero blocks');
    console.log('You can now enter fresh content using the rich text editor in the admin panel.');
  } catch (error) {
    console.error('Error clearing hero data:', error);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

clearHeroTextData();