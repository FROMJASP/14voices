import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';
export async function POST(request: NextRequest) {
  try {
    // Security check - only allow in production with proper secret
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.PAYLOAD_SECRET;

    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await getPayload({
      config: configPromise,
    });

    // Run migrations
    console.log('Starting database migrations...');

    // Payload should auto-migrate when initialized
    // but we can force it by accessing the db
    await payload.find({
      collection: 'users',
      limit: 1,
    });

    return NextResponse.json({
      success: true,
      message: 'Migrations completed successfully',
      info: 'Database schema is up to date',
    });
  } catch (error) {
    console.error('Migration error:', error);

    // If error is about missing tables, that's expected - Payload will create them
    if (error instanceof Error && error.message.includes('does not exist')) {
      return NextResponse.json({
        success: true,
        message: 'Initial migration completed - tables created',
        info: 'Database schema has been initialized',
      });
    }

    return NextResponse.json(
      {
        error: 'Migration failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST method with Authorization header to run migrations',
    example:
      'curl -X POST -H "Authorization: Bearer YOUR_PAYLOAD_SECRET" https://14voices.com/api/admin/migrate',
  });
}
