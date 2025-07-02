import { Payload } from 'payload'
import { Resend } from 'resend'
import { renderEmailTemplate } from './renderer'

const resend = new Resend(process.env.RESEND_API_KEY)

interface BatchEmailJob {
  id: string
  recipient: {
    id: string
    email: string
    name?: string
  }
  template: {
    id: string
    key: string
  }
  sequence?: {
    id: string
    key: string
  }
  variables?: Record<string, unknown>
}

interface BatchResult {
  successful: string[]
  failed: Array<{
    jobId: string
    error: string
  }>
  totalProcessed: number
  duration: number
}

export class EmailBatchProcessor {
  private payload: Payload
  private batchSize: number
  private maxRetries: number
  private concurrency: number

  constructor(payload: Payload, options?: {
    batchSize?: number
    maxRetries?: number
    concurrency?: number
  }) {
    this.payload = payload
    this.batchSize = options?.batchSize || 100
    this.maxRetries = options?.maxRetries || 3
    this.concurrency = options?.concurrency || 10
  }

  async processBatch(limit: number = 1000): Promise<BatchResult> {
    const startTime = Date.now()
    const result: BatchResult = {
      successful: [],
      failed: [],
      totalProcessed: 0,
      duration: 0
    }

    try {
      const batches = Math.ceil(limit / this.batchSize)
      
      for (let i = 0; i < batches; i++) {
        const offset = i * this.batchSize
        const batchLimit = Math.min(this.batchSize, limit - offset)
        
        const jobs = await this.fetchDueJobs(batchLimit, offset)
        
        if (jobs.length === 0) break
        
        await this.markJobsAsProcessing(jobs.map(j => j.id))
        
        const batchResults = await this.processBatchConcurrently(jobs)
        
        result.successful.push(...batchResults.successful)
        result.failed.push(...batchResults.failed)
        result.totalProcessed += jobs.length
        
        await this.updateJobStatuses(batchResults)
        
        if (jobs.length < batchLimit) break
      }
    } catch (error) {
      console.error('Batch processing error:', error)
    } finally {
      result.duration = Date.now() - startTime
    }

    return result
  }

  private async fetchDueJobs(limit: number, offset: number = 0): Promise<BatchEmailJob[]> {
    const now = new Date()
    
    const response = await this.payload.find({
      collection: 'email-jobs',
      where: {
        status: {
          equals: 'scheduled',
        },
        scheduledFor: {
          less_than_equal: now,
        },
        attempts: {
          less_than: this.maxRetries,
        },
      },
      limit,
      page: Math.floor(offset / limit) + 1,
      depth: 2,
      sort: 'scheduledFor',
    })

    return response.docs as unknown as BatchEmailJob[]
  }

  private async markJobsAsProcessing(jobIds: string[]): Promise<void> {
    const updatePromises = jobIds.map(id => 
      this.payload.update({
        collection: 'email-jobs',
        id,
        data: {
          status: 'processing',
        },
      })
    )

    await Promise.all(updatePromises)
  }

  private async processBatchConcurrently(jobs: BatchEmailJob[]): Promise<{
    successful: string[]
    failed: Array<{ jobId: string; error: string }>
  }> {
    const successful: string[] = []
    const failed: Array<{ jobId: string; error: string }> = []
    
    const chunks = this.chunkArray(jobs, this.concurrency)
    
    for (const chunk of chunks) {
      const promises = chunk.map(async (job) => {
        try {
          const { subject, html, text, fromName, fromEmail, replyTo } = await renderEmailTemplate({
            templateKey: job.template.key,
            variables: job.variables || {},
            recipient: {
              email: job.recipient.email,
              name: job.recipient.name,
            },
            payload: this.payload,
          })

          const emailData = {
            from: fromEmail 
              ? `${fromName || '14voices'} <${fromEmail}>`
              : `14voices <noreply@14voices.com>`,
            to: job.recipient.email,
            subject,
            html,
            text,
            ...(replyTo && { replyTo }),
            tags: job.sequence ? [{ name: `sequence:${job.sequence.key}`, value: `sequence:${job.sequence.key}` }] : [],
          }

          const result = await resend.emails.send(emailData)

          if (result.error) {
            throw new Error(result.error.message)
          }

          await this.createEmailLog({
            recipient: job.recipient.email,
            templateKey: job.template.key,
            subject,
            resendId: result.data?.id || '',
          })

          successful.push(job.id)
        } catch (error) {
          failed.push({
            jobId: job.id,
            error: error instanceof Error ? error.message : String(error),
          })
        }
      })

      await Promise.all(promises)
    }

    return { successful, failed }
  }

  private async updateJobStatuses(results: {
    successful: string[]
    failed: Array<{ jobId: string; error: string }>
  }): Promise<void> {
    const now = new Date()
    
    const successPromises = results.successful.map(id =>
      this.payload.update({
        collection: 'email-jobs',
        id,
        data: {
          status: 'sent',
          lastAttempt: now,
        },
      })
    )

    const failPromises = results.failed.map(({ jobId, error }) =>
      this.payload.db.collections['email-jobs'].updateOne(
        { _id: jobId },
        {
          $set: {
            status: 'failed',
            lastAttempt: now,
            error: error,
          },
          $inc: {
            attempts: 1,
          },
        }
      )
    )

    await Promise.all([...successPromises, ...failPromises])
  }

  private async createEmailLog(data: {
    recipient: string
    templateKey: string
    subject: string
    resendId: string
  }): Promise<void> {
    await this.payload.create({
      collection: 'email-logs',
      data: {
        recipient: data.recipient,
        recipientEmail: data.recipient,
        template: data.templateKey,
        subject: data.subject,
        status: 'sent',
        sentAt: new Date(),
        resendId: data.resendId,
      },
    })
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  }

  async retryFailedJobs(limit: number = 100): Promise<BatchResult> {
    const startTime = Date.now()
    const result: BatchResult = {
      successful: [],
      failed: [],
      totalProcessed: 0,
      duration: 0,
    }

    try {
      const failedJobs = await this.payload.find({
        collection: 'email-jobs',
        where: {
          status: {
            equals: 'failed',
          },
          attempts: {
            less_than: this.maxRetries,
          },
        },
        limit,
        depth: 2,
      })

      if (failedJobs.docs.length === 0) {
        return result
      }

      await this.payload.db.collections['email-jobs'].updateMany(
        {
          _id: { $in: failedJobs.docs.map(job => job.id) },
        },
        {
          $set: {
            status: 'scheduled',
            scheduledFor: new Date(),
          },
        }
      )

      return await this.processBatch(failedJobs.docs.length)
    } finally {
      result.duration = Date.now() - startTime
    }
  }

  async getQueueStats(): Promise<{
    scheduled: number
    processing: number
    failed: number
    sent: number
    cancelled: number
  }> {
    const stats = await this.payload.db.collections['email-jobs'].aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ])

    const result = {
      scheduled: 0,
      processing: 0,
      failed: 0,
      sent: 0,
      cancelled: 0,
    }

    for (const stat of stats) {
      if (stat._id in result) {
        result[stat._id as keyof typeof result] = stat.count
      }
    }

    return result
  }

  async cleanupOldJobs(daysToKeep: number = 30): Promise<number> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

    const result = await this.payload.db.collections['email-jobs'].deleteMany({
      status: { $in: ['sent', 'cancelled'] },
      updatedAt: { $lt: cutoffDate },
    })

    return result.deletedCount || 0
  }
}