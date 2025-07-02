import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { migrateStorageStructure } from '@/lib/storage/migration'
import { storageMigrationSchema } from '@/lib/validation/schemas'
import { withAuth, withRateLimit, withSecurityHeaders, composeMiddleware } from '@/middleware/auth'
import { validateRequest } from '@/lib/api-security'

async function handler(req: NextRequest) {
  try {
    // Validate request
    const validatedData = await validateRequest(req, storageMigrationSchema)
    const { dryRun } = validatedData
    
    const payload = await getPayload({ config })
    const token = process.env.BLOB_READ_WRITE_TOKEN
    
    if (!token) {
      return NextResponse.json({ error: 'Blob storage token not configured' }, { status: 500 })
    }
    
    // Add timeout for long-running migration
    const migrationPromise = migrateStorageStructure(payload, token, dryRun)
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Migration timeout')), 300000) // 5 minute timeout
    )
    
    const results = await Promise.race([migrationPromise, timeoutPromise]) as Array<{status: string; [key: string]: unknown}>
    
    return NextResponse.json({
      dryRun,
      totalFiles: results.length,
      successful: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'error').length,
      results,
    })
  } catch (error) {
    console.error('Storage migration error:', error)
    
    if (error instanceof Error) {
      if (error.name === 'ValidationError') {
        return NextResponse.json(
          { error: 'Invalid request', details: (error as Error & {errors?: unknown}).errors },
          { status: 400 }
        )
      }
      if (error.message === 'Migration timeout') {
        return NextResponse.json(
          { error: 'Migration timed out after 5 minutes' },
          { status: 504 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Migration failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Export with admin-only auth middleware
export const POST = composeMiddleware(
  withSecurityHeaders,
  withRateLimit({ windowMs: 3600000, max: 5 }), // 5 migrations per hour
  withAuth({ requireAuth: true, allowedRoles: ['admin'] })
)(handler)