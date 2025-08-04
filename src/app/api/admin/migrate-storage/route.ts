import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/auth-middleware';
import { getPayload } from 'payload';
import config from '@payload-config';
import { migrateStorageStructure } from '@/lib/storage/migration';
import { storageMigrationSchema } from '@/lib/validation/schemas';
import { validateRequest } from '@/lib/api-security';
import { getServerSideUser } from '@/utilities/payload';

async function handler(req: NextRequest) {
  try {
    // Validate request
    const validatedData = await validateRequest(req, storageMigrationSchema);
    const { dryRun } = validatedData;

    const payload = await getPayload({ config });
    const token = process.env.BLOB_READ_WRITE_TOKEN;

    if (!token) {
      return NextResponse.json({ error: 'Blob storage token not configured' }, { status: 500 });
    }

    // Add timeout for long-running migration
    const migrationPromise = migrateStorageStructure(payload, token, dryRun);
    const timeoutPromise = new Promise(
      (_, reject) => setTimeout(() => reject(new Error('Migration timeout')), 300000) // 5 minute timeout
    );

    const results = (await Promise.race([migrationPromise, timeoutPromise])) as Array<{
      status: string;
      [key: string]: unknown;
    }>;

    return NextResponse.json({
      dryRun,
      totalFiles: results.length,
      successful: results.filter((r) => r.status === 'success').length,
      failed: results.filter((r) => r.status === 'error').length,
      results,
    });
  } catch (error) {
    console.error('Storage migration error:', error);

    if (error instanceof Error) {
      if (error.name === 'ValidationError') {
        return NextResponse.json(
          { error: 'Invalid request', details: (error as Error & { errors?: unknown }).errors },
          { status: 400 }
        );
      }
      if (error.message === 'Migration timeout') {
        return NextResponse.json({ error: 'Migration timed out after 5 minutes' }, { status: 504 });
      }
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

// Export with admin-only auth middleware
async function POSTHandler(_req: NextRequest) {
  // Check auth first
  const user = await getServerSideUser();
  if (!user || !user.roles?.includes('admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check rate limit would go here
  // For now, just call the handler
  const response = await handler(_req);

  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

export const POST = withAdminAuth(POSTHandler, { rateLimit: 'admin' });
