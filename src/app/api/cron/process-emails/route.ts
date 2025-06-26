import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getPayload } from '@/utilities/payload'
import { processScheduledEmails } from '@/lib/email/sequences'

export async function GET(req: NextRequest) {
  try {
    const headersList = await headers()
    const authHeader = headersList.get('authorization')
    
    // Verify cron secret (for Vercel Cron or similar)
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const payload = await getPayload()
    await processScheduledEmails(payload)
    
    return NextResponse.json({ 
      success: true, 
      timestamp: new Date().toISOString() 
    })
  } catch (error) {
    console.error('Email processing error:', error)
    return NextResponse.json(
      { error: 'Email processing failed' },
      { status: 500 }
    )
  }
}