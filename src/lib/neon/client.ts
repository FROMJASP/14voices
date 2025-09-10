import { neon } from '@neondatabase/serverless';

/**
 * Creates a Neon database client
 * @param databaseUrl - The database connection string (defaults to DATABASE_URL env var)
 * @returns A Neon SQL query function
 */
export function createNeonClient(databaseUrl?: string) {
  const connectionString = databaseUrl || process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      'Database connection string not found. Please set DATABASE_URL or NEON_DATABASE_URL environment variable.'
    );
  }

  return neon(connectionString);
}

/**
 * Default Neon client instance
 */
export const sql = createNeonClient();

/**
 * Execute a query with the default Neon client
 */
export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  try {
    // Neon client uses template literals, not a query method
    // For parameterized queries, we need to construct the query differently
    const result = params && params.length > 0 ? await sql(text, params) : await sql(text);
    return result as T[];
  } catch (error) {
    console.error('Neon query error:', error);
    throw error;
  }
}

/**
 * Execute a transaction with multiple queries
 */
export async function transaction<T = any>(
  queries: Array<{ text: string; params?: any[] }>
): Promise<T[]> {
  const client = createNeonClient();

  try {
    await client`BEGIN`;

    const results: T[] = [];
    for (const query of queries) {
      const result =
        query.params && query.params.length > 0
          ? await client(query.text, query.params)
          : await client(query.text);
      results.push(result as T);
    }

    await client`COMMIT`;
    return results;
  } catch (error) {
    await client`ROLLBACK`;
    console.error('Transaction error:', error);
    throw error;
  }
}

/**
 * Health check for database connection
 */
export async function checkConnection(): Promise<boolean> {
  try {
    await sql`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection check failed:', error);
    return false;
  }
}
