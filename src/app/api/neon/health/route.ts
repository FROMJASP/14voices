import { NextResponse } from 'next/server';
import { checkConnection, sql } from '@/lib/neon/client';

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    // Check basic connection
    const isConnected = await checkConnection();

    if (!isConnected) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Database connection failed',
          connected: false,
        },
        { status: 503 }
      );
    }

    // Get database version and connection info
    const [versionResult] = await sql`SELECT version()`;
    const [currentDb] = await sql`SELECT current_database()`;
    const [currentUser] = await sql`SELECT current_user`;

    return NextResponse.json({
      status: 'success',
      message: 'Neon database connected successfully',
      connected: true,
      database: {
        version: versionResult.version,
        database: currentDb.current_database,
        user: currentUser.current_user,
      },
    });
  } catch (error) {
    console.error('Neon health check error:', error);

    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        connected: false,
      },
      { status: 500 }
    );
  }
}
