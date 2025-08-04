import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/auth-middleware';

async function GETHandler() {
  const token = process.env.BLOB_READ_WRITE_TOKEN || '';

  const debugInfo = {
    hasToken: !!process.env.BLOB_READ_WRITE_TOKEN,
    tokenLength: token.length,
    startsWithCorrectPrefix: token.startsWith('vercel_blob_rw_'),
    firstChars: token.substring(0, 20) + '...',
    hasQuotes: token.startsWith('"') || token.endsWith('"'),
    actualFirstChar: token.charAt(0),
    actualFirstCharCode: token.charCodeAt(0),
  };

  return NextResponse.json({
    status: 'blob debug info',
    timestamp: new Date().toISOString(),
    debug: debugInfo,
    willBlobStorageActivate:
      !!process.env.BLOB_READ_WRITE_TOKEN && token.startsWith('vercel_blob_rw_'),
  });
}

export const GET = withAdminAuth(GETHandler, { rateLimit: 'admin' });
