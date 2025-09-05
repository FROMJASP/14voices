import * as dotenv from 'dotenv';
import path from 'path';
import { Pool } from 'pg';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function runMigration() {
  // Connect directly to the database
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Connecting to database...');
    
    // Read the SQL file
    const sqlPath = path.resolve(process.cwd(), 'src/scripts/fix-hero-columns.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');
    
    // Split SQL statements and run them one by one
    const statements = sql.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Running:', statement.substring(0, 50) + '...');
        try {
          await pool.query(statement);
          console.log('✓ Success');
        } catch (error: any) {
          console.error('✗ Error:', error.message);
          // Continue with other statements even if one fails
        }
      }
    }

    console.log('\n✓ Migration complete');
    console.log('You can now restart the dev server and the schema should sync properly.');
  } catch (error) {
    console.error('Error running migration:', error);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

runMigration();