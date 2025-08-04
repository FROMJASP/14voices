import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/auth-middleware';
import { getServerSideUser } from '@/utilities/payload';

async function GETHandler() {
  // Only allow in development environment
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Require admin authentication even in development
  try {
    const user = await getServerSideUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only show non-sensitive debug info
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET ? 'SET' : 'NOT SET',
    RESEND_API_KEY: process.env.RESEND_API_KEY ? 'SET' : 'NOT SET',
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN ? 'SET' : 'NOT SET',
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL || 'NOT SET',
    // Never expose any part of connection strings
    DATABASE_CONFIGURED: !!(process.env.POSTGRES_URL || process.env.DATABASE_URL),
  };

  return NextResponse.json({
    status: 'debug info',
    timestamp: new Date().toISOString(),
    env: envVars,
    warning: 'This endpoint is disabled in production',
  });
}

export const GET = withAdminAuth(GETHandler, { rateLimit: 'admin' });
