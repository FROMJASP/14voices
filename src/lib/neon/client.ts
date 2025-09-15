import { neon, NeonQueryFunction } from '@neondatabase/serverless';

/**
 * Creates a Neon database client
 * @param databaseUrl - The database connection string (defaults to DATABASE_URL env var)
 * @returns A Neon SQL query function
 */
export function createNeonClient(databaseUrl?: string): NeonQueryFunction<false, false> {
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
 * Execute a parameterized query with the default Neon client
 * @param text - SQL query with $1, $2, etc. placeholders
 * @param params - Array of parameters to substitute
 *
 * @example
 * const users = await query('SELECT * FROM users WHERE id = $1', [userId]);
 */
export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  try {
    if (!params || params.length === 0) {
      // For queries without parameters, use template literal
      const result = await sql([text] as unknown as TemplateStringsArray);
      return result as T[];
    }

    // For parameterized queries, we need to build the query properly
    // The Neon client expects a specific format for parameterized queries
    let queryText = text;
    const values: any[] = [];

    // Replace $1, $2, etc. with actual values for the template literal
    params.forEach((param, index) => {
      const placeholder = `$${index + 1}`;
      const parts = queryText.split(placeholder);
      if (parts.length > 1) {
        queryText = parts.join('?');
        values.push(param);
      }
    });

    // Build template strings array
    const strings = queryText.split('?');
    const stringsArray = Object.assign(strings, { raw: strings });

    // Execute with parameters
    const result = await sql(stringsArray as TemplateStringsArray, ...values);
    return result as T[];
  } catch (error) {
    console.error('Neon query error:', error);
    throw error;
  }
}

/**
 * Execute a transaction with multiple queries
 * @param queries - Array of queries with their parameters
 */
export async function transaction<T = any>(
  queries: Array<{ text: string; params?: any[] }>
): Promise<T[]> {
  const client = createNeonClient();

  try {
    await client`BEGIN`;

    const results: T[] = [];
    for (const queryItem of queries) {
      if (!queryItem.params || queryItem.params.length === 0) {
        const result = await client([queryItem.text] as unknown as TemplateStringsArray);
        results.push(result as T);
      } else {
        // Use the query function for parameterized queries
        const result = await query(queryItem.text, queryItem.params);
        results.push(result as unknown as T);
      }
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

/**
 * Execute a query using template literal syntax (safest method)
 * This is the preferred way to execute queries as it automatically
 * handles parameterization and prevents SQL injection
 *
 * @example
 * const users = await sqlTemplate`SELECT * FROM users WHERE id = ${userId}`;
 */
export const sqlTemplate = sql;
