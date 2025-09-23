import { Pool } from 'pg';

export async function checkMediaSchema() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // Get column information
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'media'
      ORDER BY ordinal_position;
    `);

    console.log('Media table columns:');
    console.log('==================');
    result.rows.forEach((row) => {
      console.log(
        `${row.column_name} (${row.data_type}) ${row.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`
      );
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (import.meta.main) {
  checkMediaSchema();
}
