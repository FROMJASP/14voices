import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getPayload } from '@/utilities/payload'
import { getEmailQueueStats } from '@/lib/email/sequences'

export async function GET(request: Request) {
  try {
    const headersList = await headers()
    const authHeader = headersList.get('authorization')
    
    // Check admin authentication (you may want to use your existing auth system)
    if (process.env.ADMIN_SECRET && authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const payload = await getPayload()
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'day'
    
    // Get current queue stats
    const queueStats = await getEmailQueueStats(payload)
    
    // Get performance metrics for the period
    const now = new Date()
    const startDate = new Date()
    
    switch (period) {
      case 'hour':
        startDate.setHours(now.getHours() - 1)
        break
      case 'day':
        startDate.setDate(now.getDate() - 1)
        break
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
    }
    
    // Get email logs for the period
    const emailLogs = await payload.find({
      collection: 'email-logs',
      where: {
        sentAt: {
          greater_than: startDate,
        },
      },
      limit: 0, // We just want the count
    })
    
    // Get failed jobs for the period
    const failedJobs = await payload.find({
      collection: 'email-jobs',
      where: {
        status: {
          equals: 'failed',
        },
        lastAttempt: {
          greater_than: startDate,
        },
      },
      limit: 100,
      sort: '-lastAttempt',
    })
    
    // Calculate delivery rate
    const totalAttempted = emailLogs.totalDocs + failedJobs.totalDocs
    const deliveryRate = totalAttempted > 0 
      ? ((emailLogs.totalDocs / totalAttempted) * 100).toFixed(2)
      : '0.00'
    
    // Get template performance
    const templateStats = await payload.db.collections['email-logs'].aggregate([
      {
        $match: {
          sentAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$template',
          count: { $sum: 1 },
          firstSent: { $min: '$sentAt' },
          lastSent: { $max: '$sentAt' }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ])
    
    // Get sequence performance
    const sequenceStats = await payload.db.collections['email-jobs'].aggregate([
      {
        $match: {
          sequence: { $exists: true },
          updatedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            sequence: '$sequence',
            status: '$status'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.sequence',
          stats: {
            $push: {
              status: '$_id.status',
              count: '$count'
            }
          },
          total: { $sum: '$count' }
        }
      },
      {
        $sort: { total: -1 }
      },
      {
        $limit: 10
      }
    ])
    
    // Calculate throughput
    const periodHours = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60)
    const emailsPerHour = emailLogs.totalDocs / periodHours
    const emailsPerMinute = emailsPerHour / 60
    
    return NextResponse.json({
      success: true,
      period,
      stats: {
        queue: queueStats,
        performance: {
          sent: emailLogs.totalDocs,
          failed: failedJobs.totalDocs,
          deliveryRate: `${deliveryRate}%`,
          throughput: {
            perHour: Math.round(emailsPerHour),
            perMinute: emailsPerMinute.toFixed(2),
          },
        },
        templates: templateStats,
        sequences: sequenceStats,
        recentFailures: failedJobs.docs.map(job => ({
          id: job.id,
          recipient: job.recipient.email,
          template: job.template.name || job.template.key,
          error: job.error,
          attempts: job.attempts,
          lastAttempt: job.lastAttempt,
        })),
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Email stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch email statistics' },
      { status: 500 }
    )
  }
}