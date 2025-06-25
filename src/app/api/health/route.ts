import { NextResponse } from 'next/server'

export async function GET() {
  const checks = {
    environment: process.env.NODE_ENV,
    hasPayloadSecret: !!process.env.PAYLOAD_SECRET,
    hasPostgresUrl: !!process.env.POSTGRES_URL,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasResendApiKey: !!process.env.RESEND_API_KEY,
    hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
    serverUrl: process.env.NEXT_PUBLIC_SERVER_URL || 'not set',
  }

  // Try database connection
  let dbStatus = 'unknown'
  if (process.env.POSTGRES_URL || process.env.DATABASE_URL) {
    try {
      const { Pool } = await import('pg')
      const pool = new Pool({
        connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
      })
      
      await pool.query('SELECT 1')
      await pool.end()
      dbStatus = 'connected'
    } catch (error) {
      dbStatus = `error: ${error instanceof Error ? error.message : 'unknown'}`
    }
  } else {
    dbStatus = 'no connection string'
  }

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    checks: {
      ...checks,
      database: dbStatus,
    },
  })
}