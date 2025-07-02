import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getPayload } from '@/utilities/payload'
import { 
  processScheduledEmails, 
  getEmailQueueStats, 
  retryFailedEmails,
  cleanupOldEmailJobs 
} from '@/lib/email/sequences'

export async function GET(request: Request) {
  const startTime = Date.now()
  
  try {
    const headersList = await headers()
    const authHeader = headersList.get('authorization')
    
    // Verify cron secret (for Vercel Cron or similar)
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'process'
    const limit = parseInt(searchParams.get('limit') || '1000', 10)
    
    const payload = await getPayload()
    
    let result: any = {}
    
    switch (action) {
      case 'process':
        // Process scheduled emails with configurable limit
        result = await processScheduledEmails(payload, limit)
        break
        
      case 'retry':
        // Retry failed emails
        result = await retryFailedEmails(payload, limit)
        break
        
      case 'stats':
        // Get queue statistics
        result = await getEmailQueueStats(payload)
        break
        
      case 'cleanup':
        // Clean up old sent/cancelled jobs
        const daysToKeep = parseInt(searchParams.get('days') || '30', 10)
        const deletedCount = await cleanupOldEmailJobs(payload, daysToKeep)
        result = { deletedCount }
        break
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
    
    const duration = Date.now() - startTime
    
    return NextResponse.json({ 
      success: true,
      action,
      result,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Email processing error:', error)
    
    // Log detailed error information
    const errorDetails = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      duration: `${Date.now() - startTime}ms`,
    }
    
    console.error('Error details:', errorDetails)
    
    return NextResponse.json(
      { 
        error: 'Email processing failed',
        details: process.env.NODE_ENV === 'development' ? errorDetails : undefined,
      },
      { status: 500 }
    )
  }
}

// Optional: POST endpoint for manual triggers
export async function POST(request: Request) {
  try {
    const headersList = await headers()
    const authHeader = headersList.get('authorization')
    
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { action = 'process', limit = 1000, ...params } = body
    
    const payload = await getPayload()
    let result: any = {}
    
    switch (action) {
      case 'process':
        result = await processScheduledEmails(payload, limit)
        break
        
      case 'retry':
        result = await retryFailedEmails(payload, limit)
        break
        
      case 'cleanup':
        const deletedCount = await cleanupOldEmailJobs(payload, params.daysToKeep || 30)
        result = { deletedCount }
        break
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
    
    return NextResponse.json({ 
      success: true,
      action,
      result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Email processing error:', error)
    return NextResponse.json(
      { error: 'Email processing failed' },
      { status: 500 }
    )
  }
}