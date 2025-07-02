import { Payload } from 'payload'
import { EmailBatchProcessor } from './batch-processor'

interface TriggerSequenceOptions {
  sequenceKey: string
  userId: string
  variables?: Record<string, string | number | boolean>
  payload: Payload
}

interface BatchTriggerOptions {
  sequenceKey: string
  userIds: string[]
  variables?: Record<string, string | number | boolean>
  payload: Payload
}

function calculateScheduleDate(delayValue: number, delayUnit: string): Date {
  const now = new Date()
  
  switch (delayUnit) {
    case 'minutes':
      return new Date(now.getTime() + delayValue * 60 * 1000)
    case 'hours':
      return new Date(now.getTime() + delayValue * 60 * 60 * 1000)
    case 'days':
      return new Date(now.getTime() + delayValue * 24 * 60 * 60 * 1000)
    case 'weeks':
      return new Date(now.getTime() + delayValue * 7 * 24 * 60 * 60 * 1000)
    default:
      return now
  }
}

export async function triggerEmailSequence(options: TriggerSequenceOptions): Promise<void> {
  const { sequenceKey, userId, variables = {}, payload } = options
  
  const sequences = await payload.find({
    collection: 'email-sequences',
    where: {
      key: {
        equals: sequenceKey,
      },
      active: {
        equals: true,
      },
    },
    depth: 2,
  })
  
  const sequence = sequences.docs[0]
  
  if (!sequence) {
    throw new Error(`Email sequence with key "${sequenceKey}" not found`)
  }
  
  const user = await payload.findByID({
    collection: 'users',
    id: userId,
  })
  
  if (!user) {
    throw new Error(`User with ID "${userId}" not found`)
  }
  
  // Check if user already has active jobs for this sequence
  const existingJobs = await payload.find({
    collection: 'email-jobs',
    where: {
      recipient: {
        equals: userId,
      },
      sequence: {
        equals: sequence.id,
      },
      status: {
        in: ['scheduled', 'processing'],
      },
    },
  })
  
  if (existingJobs.totalDocs > 0) {
    console.log(`User ${userId} already has active jobs for sequence ${sequenceKey}`)
    return
  }
  
  // Create jobs for each email in the sequence
  const jobsToCreate = sequence.emails.map((emailConfig: {
    template: { id: string }
    delayValue: number
    delayUnit: string
  }, i: number) => ({
    recipient: userId,
    template: emailConfig.template.id,
    sequence: sequence.id,
    sequenceEmailIndex: i,
    scheduledFor: calculateScheduleDate(emailConfig.delayValue, emailConfig.delayUnit),
    status: 'scheduled',
    variables: {
      ...variables,
      userName: user.name || user.email,
      userEmail: user.email,
      sequenceName: sequence.name,
    },
  }))

  // Batch create all jobs
  await Promise.all(
    jobsToCreate.map((data: any) => 
      payload.create({
        collection: 'email-jobs',
        data,
      })
    )
  )
}

export async function triggerEmailSequenceBatch(options: BatchTriggerOptions): Promise<{
  successful: number
  failed: number
  errors: Array<{ userId: string; error: string }>
}> {
  const { sequenceKey, userIds, variables = {}, payload } = options
  const result = {
    successful: 0,
    failed: 0,
    errors: [] as Array<{ userId: string; error: string }>
  }
  
  // Fetch sequence once
  const sequences = await payload.find({
    collection: 'email-sequences',
    where: {
      key: {
        equals: sequenceKey,
      },
      active: {
        equals: true,
      },
    },
    depth: 2,
  })
  
  const sequence = sequences.docs[0]
  
  if (!sequence) {
    throw new Error(`Email sequence with key "${sequenceKey}" not found`)
  }
  
  // Batch fetch users
  const users = await payload.find({
    collection: 'users',
    where: {
      id: {
        in: userIds,
      },
    },
    limit: userIds.length,
  })
  
  const userMap = new Map(users.docs.map(user => [user.id, user]))
  
  // Check existing jobs in batch
  const existingJobs = await payload.find({
    collection: 'email-jobs',
    where: {
      recipient: {
        in: userIds,
      },
      sequence: {
        equals: sequence.id,
      },
      status: {
        in: ['scheduled', 'processing'],
      },
    },
    limit: userIds.length,
  })
  
  const usersWithJobs = new Set(existingJobs.docs.map(job => job.recipient.id))
  
  // Prepare all jobs to create
  const allJobsToCreate: Array<{
    recipient: string
    template: string
    sequence: string
    sequenceEmailIndex: number
    scheduledFor: Date
    status: string
    variables: Record<string, unknown>
  }> = []
  
  for (const userId of userIds) {
    try {
      if (usersWithJobs.has(userId)) {
        console.log(`User ${userId} already has active jobs for sequence ${sequenceKey}`)
        continue
      }
      
      const user = userMap.get(userId)
      if (!user) {
        result.failed++
        result.errors.push({ userId, error: 'User not found' })
        continue
      }
      
      const userJobs = sequence.emails.map((emailConfig: {
        template: { id: string }
        delayValue: number
        delayUnit: string
      }, i: number) => ({
        recipient: userId,
        template: emailConfig.template.id,
        sequence: sequence.id,
        sequenceEmailIndex: i,
        scheduledFor: calculateScheduleDate(emailConfig.delayValue, emailConfig.delayUnit),
        status: 'scheduled',
        variables: {
          ...variables,
          userName: user.name || user.email,
          userEmail: user.email,
          sequenceName: sequence.name,
        },
      }))
      
      allJobsToCreate.push(...userJobs)
      result.successful++
    } catch (error) {
      result.failed++
      result.errors.push({ 
        userId, 
        error: error instanceof Error ? error.message : String(error) 
      })
    }
  }
  
  // Batch create all jobs using Payload API
  if (allJobsToCreate.length > 0) {
    const batchSize = 10 // Smaller batch size for API calls
    for (let i = 0; i < allJobsToCreate.length; i += batchSize) {
      const batch = allJobsToCreate.slice(i, i + batchSize)
      await Promise.all(
        batch.map((data) =>
          payload.create({
            collection: 'email-jobs',
            data,
          })
        )
      )
    }
  }
  
  return result
}

export async function cancelEmailSequence(options: {
  sequenceId: string
  userId: string
  payload: Payload
}): Promise<void> {
  const { sequenceId, userId, payload } = options
  
  // Find and cancel all scheduled jobs
  const jobsToCancel = await payload.find({
    collection: 'email-jobs',
    where: {
      and: [
        {
          recipient: {
            equals: userId,
          },
        },
        {
          sequence: {
            equals: sequenceId,
          },
        },
        {
          status: {
            equals: 'scheduled',
          },
        },
      ],
    },
    limit: 1000,
  })

  // Update each job to cancelled status
  await Promise.all(
    jobsToCancel.docs.map((job) =>
      payload.update({
        collection: 'email-jobs',
        id: job.id,
        data: {
          status: 'cancelled',
        },
      })
    )
  )
}

export async function processScheduledEmails(payload: Payload, limit: number = 1000): Promise<{
  successful: number
  failed: number
  duration: number
}> {
  const processor = new EmailBatchProcessor(payload, {
    batchSize: 100,
    maxRetries: 3,
    concurrency: 10,
  })
  
  const result = await processor.processBatch(limit)
  
  console.log(`Email processing completed:`, {
    successful: result.successful.length,
    failed: result.failed.length,
    totalProcessed: result.totalProcessed,
    duration: `${result.duration}ms`,
    throughput: `${(result.totalProcessed / (result.duration / 1000)).toFixed(2)} emails/sec`
  })
  
  return {
    successful: result.successful.length,
    failed: result.failed.length,
    duration: result.duration,
  }
}

export async function cancelEmailSequenceBatch(options: {
  sequenceId: string
  userIds: string[]
  payload: Payload
}): Promise<number> {
  const { sequenceId, userIds, payload } = options
  
  // Find jobs to cancel
  const jobsToCancel = await payload.find({
    collection: 'email-jobs',
    where: {
      and: [
        {
          recipient: {
            in: userIds,
          },
        },
        {
          sequence: {
            equals: sequenceId,
          },
        },
        {
          status: {
            equals: 'scheduled',
          },
        },
      ],
    },
    limit: 1000,
  })
  
  // Cancel each job
  let cancelledCount = 0
  await Promise.all(
    jobsToCancel.docs.map(async (job) => {
      try {
        await payload.update({
          collection: 'email-jobs',
          id: job.id,
          data: {
            status: 'cancelled',
          },
        })
        cancelledCount++
      } catch (error) {
        console.error(`Failed to cancel job ${job.id}:`, error)
      }
    })
  )
  
  return cancelledCount
}

export async function getEmailQueueStats(payload: Payload): Promise<{
  scheduled: number
  processing: number
  failed: number
  sent: number
  cancelled: number
  retryable: number
}> {
  const processor = new EmailBatchProcessor(payload)
  const stats = await processor.getQueueStats()
  
  // Get retryable count
  const retryableJobs = await payload.count({
    collection: 'email-jobs',
    where: {
      status: {
        equals: 'failed',
      },
      attempts: {
        less_than: 3,
      },
    },
  })
  
  return {
    ...stats,
    retryable: retryableJobs.totalDocs,
  }
}

export async function retryFailedEmails(payload: Payload, limit: number = 100): Promise<{
  successful: number
  failed: number
  duration: number
}> {
  const processor = new EmailBatchProcessor(payload, {
    batchSize: 50,
    maxRetries: 3,
    concurrency: 5,
  })
  
  const result = await processor.retryFailedJobs(limit)
  
  return {
    successful: result.successful.length,
    failed: result.failed.length,
    duration: result.duration,
  }
}

export async function cleanupOldEmailJobs(payload: Payload, daysToKeep: number = 30): Promise<number> {
  const processor = new EmailBatchProcessor(payload)
  return await processor.cleanupOldJobs(daysToKeep)
}