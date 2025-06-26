import { Payload } from 'payload'

interface TriggerSequenceOptions {
  sequenceKey: string
  userId: string
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
  for (let i = 0; i < sequence.emails.length; i++) {
    const emailConfig = sequence.emails[i]
    const scheduledFor = calculateScheduleDate(
      emailConfig.delayValue,
      emailConfig.delayUnit
    )
    
    await payload.create({
      collection: 'email-jobs',
      data: {
        recipient: userId,
        template: emailConfig.template.id,
        sequence: sequence.id,
        sequenceEmailIndex: i,
        scheduledFor,
        status: 'scheduled',
        variables: {
          ...variables,
          userName: user.name || user.email,
          userEmail: user.email,
          sequenceName: sequence.name,
        },
      },
    })
  }
}

export async function cancelEmailSequence(options: {
  sequenceId: string
  userId: string
  payload: Payload
}): Promise<void> {
  const { sequenceId, userId, payload } = options
  
  const jobs = await payload.find({
    collection: 'email-jobs',
    where: {
      recipient: {
        equals: userId,
      },
      sequence: {
        equals: sequenceId,
      },
      status: {
        equals: 'scheduled',
      },
    },
  })
  
  for (const job of jobs.docs) {
    await payload.update({
      collection: 'email-jobs',
      id: job.id,
      data: {
        status: 'cancelled',
      },
    })
  }
}

export async function processScheduledEmails(payload: Payload): Promise<void> {
  const now = new Date()
  
  const dueJobs = await payload.find({
    collection: 'email-jobs',
    where: {
      status: {
        equals: 'scheduled',
      },
      scheduledFor: {
        less_than_equal: now,
      },
    },
    limit: 50,
    depth: 2,
  })
  
  for (const job of dueJobs.docs) {
    try {
      await payload.update({
        collection: 'email-jobs',
        id: job.id,
        data: {
          status: 'processing',
        },
      })
      
      const { sendEmail } = await import('./renderer')
      
      const emailId = await sendEmail({
        templateKey: job.template.key,
        variables: job.variables || {},
        recipient: {
          email: job.recipient.email,
          name: job.recipient.name,
        },
        tags: job.sequence ? [`sequence:${job.sequence.key}`] : [],
        payload,
      })
      
      const emailLog = await payload.find({
        collection: 'email-logs',
        where: {
          resendId: {
            equals: emailId,
          },
        },
        limit: 1,
      })
      
      await payload.update({
        collection: 'email-jobs',
        id: job.id,
        data: {
          status: 'sent',
          emailLog: emailLog.docs[0]?.id,
        },
      })
    } catch (error) {
      await payload.update({
        collection: 'email-jobs',
        id: job.id,
        data: {
          status: 'failed',
          attempts: (job.attempts || 0) + 1,
          lastAttempt: now,
          error: error instanceof Error ? error.message : String(error),
        },
      })
    }
  }
}