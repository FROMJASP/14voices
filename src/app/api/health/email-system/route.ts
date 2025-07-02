import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getPayload } from '@/utilities/payload'
import { performEmailSystemHealthCheck } from '@/lib/email/monitoring'

export async function GET() {
  try {
    const headersList = await headers()
    // const authHeader = headersList.get('authorization')
    
    // Optional: Add authentication for health checks
    // if (process.env.HEALTH_CHECK_SECRET && authHeader !== `Bearer ${process.env.HEALTH_CHECK_SECRET}`) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }
    
    const payload = await getPayload()
    const healthCheck = await performEmailSystemHealthCheck(payload)
    
    // Return appropriate HTTP status based on health
    const httpStatus = 
      healthCheck.status === 'critical' ? 503 :
      healthCheck.status === 'degraded' ? 200 :
      200
    
    return NextResponse.json({
      ...healthCheck,
      timestamp: new Date().toISOString(),
    }, { status: httpStatus })
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json({
      status: 'critical',
      issues: ['Health check failed to execute'],
      metrics: {
        queueDepth: 0,
        failureRate: 0,
        processingTime: 0,
        oldestScheduledJob: null,
      },
      timestamp: new Date().toISOString(),
    }, { status: 503 })
  }
}