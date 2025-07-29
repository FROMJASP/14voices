import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    POSTGRES_URL: process.env.POSTGRES_URL ? 'SET' : 'NOT SET',
    DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET ? 'SET' : 'NOT SET',
    RESEND_API_KEY: process.env.RESEND_API_KEY ? 'SET' : 'NOT SET',
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN ? 'SET' : 'NOT SET',
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL || 'NOT SET',

    // Debug: Show first 30 chars of database URLs to check format
    POSTGRES_URL_START: process.env.POSTGRES_URL
      ? process.env.POSTGRES_URL.substring(0, 30) + '...'
      : 'NOT SET',
    DATABASE_URL_START: process.env.DATABASE_URL
      ? process.env.DATABASE_URL.substring(0, 30) + '...'
      : 'NOT SET',
  };

  return NextResponse.json({
    status: 'debug info',
    timestamp: new Date().toISOString(),
    env: envVars,
  });
}
