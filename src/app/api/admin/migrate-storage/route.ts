import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { migrateStorageStructure } from '@/lib/storage/migration'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: req.headers })
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { dryRun = true } = await req.json()
    const token = process.env.BLOB_READ_WRITE_TOKEN
    
    if (!token) {
      return NextResponse.json({ error: 'Blob storage token not configured' }, { status: 500 })
    }
    
    const results = await migrateStorageStructure(payload, token, dryRun)
    
    return NextResponse.json({
      dryRun,
      totalFiles: results.length,
      successful: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'error').length,
      results,
    })
  } catch (error) {
    console.error('Storage migration error:', error)
    return NextResponse.json(
      { error: 'Migration failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}