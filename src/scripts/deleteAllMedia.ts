import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export async function deleteAllMedia() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  console.log('🗑️  Preparing to delete all media records...\n');

  try {
    // First, let's see what we're about to delete
    const countResult = await pool.query('SELECT COUNT(*) as count FROM media');
    const totalCount = countResult.rows[0].count;

    console.log(`📊 Found ${totalCount} media records to delete\n`);

    if (totalCount === 0) {
      console.log('✅ No media records to delete. Media collection is already empty.');
      return;
    }

    // Show a sample of what will be deleted
    const sampleResult = await pool.query(`
      SELECT id, filename, mime_type, created_at 
      FROM media 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    console.log('📋 Sample of records to be deleted:');
    sampleResult.rows.forEach((row) => {
      console.log(`  - ${row.filename || 'unnamed'} (ID: ${row.id})`);
    });
    console.log(`  ... and ${totalCount - 5} more records\n`);

    // Delete all media records
    console.log('🗑️  Deleting all media records...');
    const deleteResult = await pool.query('DELETE FROM media RETURNING id');

    console.log(`✅ Successfully deleted ${deleteResult.rowCount} media records`);

    // Verify deletion
    const verifyResult = await pool.query('SELECT COUNT(*) as count FROM media');
    const remainingCount = verifyResult.rows[0].count;

    if (remainingCount === 0) {
      console.log('✅ Verified: Media collection is now empty');
    } else {
      console.log(`⚠️  Warning: ${remainingCount} records still remain`);
    }

    console.log('\n📝 Next steps:');
    console.log('1. You can now re-upload all media files through the admin panel');
    console.log('2. Files will be uploaded fresh without any duplicates');
    console.log('3. Remember to upload files that are referenced in your content');
  } catch (error) {
    console.error('❌ Error deleting media records:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (import.meta.main) {
  console.log('⚠️  WARNING: This will delete ALL media records from the database!');
  console.log('Press Ctrl+C to cancel, or wait 3 seconds to continue...\n');

  setTimeout(() => {
    deleteAllMedia()
      .then(() => {
        console.log('\n✅ Media deletion completed');
        process.exit(0);
      })
      .catch((error) => {
        console.error('❌ Media deletion failed:', error);
        process.exit(1);
      });
  }, 3000);
}
