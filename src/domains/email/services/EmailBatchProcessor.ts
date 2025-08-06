import { Payload } from 'payload';
import { Resend } from 'resend';
import { renderEmailTemplate } from '../../../lib/email/renderer';

const resend = new Resend(process.env.RESEND_API_KEY);

interface BatchEmailJob {
  id: string;
  recipient: {
    id: string;
    email: string;
    name?: string;
  };
  template: {
    id: string;
    key: string;
  };
  sequence?: {
    id: string;
    key: string;
  };
  variables?: Record<string, string | number | boolean>;
}

interface BatchResult {
  successful: string[];
  failed: Array<{
    jobId: string;
    error: string;
  }>;
  totalProcessed: number;
  duration: number;
}

export class EmailBatchProcessor {
  private payload: Payload;
  private batchSize: number;
  private maxRetries: number;
  private concurrency: number;

  constructor(
    payload: Payload,
    options?: {
      batchSize?: number;
      maxRetries?: number;
      concurrency?: number;
    }
  ) {
    this.payload = payload;
    this.batchSize = options?.batchSize || 100;
    this.maxRetries = options?.maxRetries || 3;
    this.concurrency = options?.concurrency || 10;
  }

  async processBatch(limit: number = 1000): Promise<BatchResult> {
    const startTime = Date.now();
    const result: BatchResult = {
      successful: [],
      failed: [],
      totalProcessed: 0,
      duration: 0,
    };

    try {
      const batches = Math.ceil(limit / this.batchSize);

      for (let i = 0; i < batches; i++) {
        const offset = i * this.batchSize;
        const batchLimit = Math.min(this.batchSize, limit - offset);

        const jobs = await this.fetchDueJobs(batchLimit, offset);

        if (jobs.length === 0) break;

        await this.markJobsAsProcessing(jobs.map((j) => j.id));

        const batchResults = await this.processBatchConcurrently(jobs);

        result.successful.push(...batchResults.successful);
        result.failed.push(...batchResults.failed);
        result.totalProcessed += jobs.length;

        await this.updateJobStatuses(batchResults);

        if (jobs.length < batchLimit) break;
      }
    } catch (error) {
      console.error('Batch processing error:', error);
    } finally {
      result.duration = Date.now() - startTime;
    }

    return result;
  }

  private async fetchDueJobs(limit: number, offset: number = 0): Promise<BatchEmailJob[]> {
    const now = new Date();

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
    });

    return response.docs as unknown as BatchEmailJob[];
  }

  private async markJobsAsProcessing(jobIds: string[]): Promise<void> {
    const updatePromises = jobIds.map((id) =>
      this.payload.update({
        collection: 'email-jobs',
        id,
        data: {
          status: 'processing',
        },
      })
    );

    await Promise.all(updatePromises);
  }

  private async processBatchConcurrently(jobs: BatchEmailJob[]): Promise<{
    successful: string[];
    failed: Array<{ jobId: string; error: string }>;
  }> {
    const successful: string[] = [];
    const failed: Array<{ jobId: string; error: string }> = [];

    const chunks = this.chunkArray(jobs, this.concurrency);

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
          });

          const emailData = {
            from: fromEmail
              ? `${fromName || '14voices'} <${fromEmail}>`
              : `14voices <noreply@14voices.com>`,
            to: job.recipient.email,
            subject,
            html,
            text,
            ...(replyTo && { replyTo }),
            tags: job.sequence
              ? [{ name: `sequence:${job.sequence.key}`, value: `sequence:${job.sequence.key}` }]
              : [],
          };

          const result = await resend.emails.send(emailData);

          if (result.error) {
            throw new Error(result.error.message);
          }

          await this.createEmailLog({
            recipientId: job.recipient.id,
            recipientEmail: job.recipient.email,
            templateId: job.template.id,
            templateKey: job.template.key,
            subject,
            resendId: result.data?.id || '',
          });

          successful.push(job.id);
        } catch (error) {
          failed.push({
            jobId: job.id,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      });

      await Promise.all(promises);
    }

    return { successful, failed };
  }

  private async updateJobStatuses(results: {
    successful: string[];
    failed: Array<{ jobId: string; error: string }>;
  }): Promise<void> {
    const now = new Date();

    const successPromises = results.successful.map((id) =>
      this.payload.update({
        collection: 'email-jobs',
        id,
        data: {
          status: 'sent',
          lastAttempt: now.toISOString(),
        },
      })
    );

    const failPromises = results.failed.map(async ({ jobId, error }) => {
      const job = await this.payload.findByID({
        collection: 'email-jobs',
        id: jobId,
      });

      return this.payload.update({
        collection: 'email-jobs',
        id: jobId,
        data: {
          status: 'failed',
          lastAttempt: now.toISOString(),
          error: error,
          attempts: (job.attempts || 0) + 1,
        },
      });
    });

    await Promise.all([...successPromises, ...failPromises]);
  }

  private async createEmailLog(data: {
    recipientId: string;
    recipientEmail: string;
    templateId: string;
    templateKey: string;
    subject: string;
    resendId: string;
  }): Promise<void> {
    await this.payload.create({
      collection: 'email-logs',
      data: {
        recipient: parseInt(data.recipientId, 10),
        recipientEmail: data.recipientEmail,
        template: parseInt(data.templateId, 10),
        subject: data.subject,
        status: 'sent',
        sentAt: new Date().toISOString(),
        resendId: data.resendId,
      },
    });
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  async retryFailedJobs(limit: number = 100): Promise<BatchResult> {
    const startTime = Date.now();
    const result: BatchResult = {
      successful: [],
      failed: [],
      totalProcessed: 0,
      duration: 0,
    };

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
      });

      if (failedJobs.docs.length === 0) {
        return result;
      }

      await Promise.all(
        failedJobs.docs.map((job) =>
          this.payload.update({
            collection: 'email-jobs',
            id: job.id,
            data: {
              status: 'scheduled',
              scheduledFor: new Date().toISOString(),
            },
          })
        )
      );

      return await this.processBatch(failedJobs.docs.length);
    } finally {
      result.duration = Date.now() - startTime;
    }
  }

  async getQueueStats(): Promise<{
    scheduled: number;
    processing: number;
    failed: number;
    sent: number;
    cancelled: number;
  }> {
    const result = {
      scheduled: 0,
      processing: 0,
      failed: 0,
      sent: 0,
      cancelled: 0,
    };

    // Query for each status type
    const statuses: Array<keyof typeof result> = [
      'scheduled',
      'processing',
      'failed',
      'sent',
      'cancelled',
    ];

    await Promise.all(
      statuses.map(async (status) => {
        const count = await this.payload.count({
          collection: 'email-jobs',
          where: {
            status: {
              equals: status,
            },
          },
        });
        result[status] = count.totalDocs;
      })
    );

    return result;
  }

  async cleanupOldJobs(daysToKeep: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    // Find old jobs
    const oldJobs = await this.payload.find({
      collection: 'email-jobs',
      where: {
        and: [
          {
            status: {
              in: ['sent', 'cancelled'],
            },
          },
          {
            updatedAt: {
              less_than: cutoffDate.toISOString(),
            },
          },
        ],
      },
      limit: 1000,
    });

    // Delete them one by one
    let deletedCount = 0;
    await Promise.all(
      oldJobs.docs.map(async (job) => {
        try {
          await this.payload.delete({
            collection: 'email-jobs',
            id: job.id,
          });
          deletedCount++;
        } catch (error) {
          console.error(`Failed to delete job ${job.id}:`, error);
        }
      })
    );

    return deletedCount;
  }
}
