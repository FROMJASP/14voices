import { Payload } from 'payload';

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'critical';
  issues: string[];
  metrics: {
    queueDepth: number;
    failureRate: number;
    processingTime: number;
    oldestScheduledJob: Date | null;
  };
}

export async function performEmailSystemHealthCheck(payload: Payload): Promise<HealthCheckResult> {
  const issues: string[] = [];
  let status: 'healthy' | 'degraded' | 'critical' = 'healthy';

  try {
    // Check queue depth
    const scheduledCount = await payload.count({
      collection: 'email-jobs',
      where: {
        status: {
          equals: 'scheduled',
        },
      },
    });

    if (scheduledCount.totalDocs > 10000) {
      status = 'critical';
      issues.push(`Queue depth critical: ${scheduledCount.totalDocs} emails pending`);
    } else if (scheduledCount.totalDocs > 5000) {
      status = 'degraded';
      issues.push(`Queue depth high: ${scheduledCount.totalDocs} emails pending`);
    }

    // Check failure rate (last hour)
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    // Query for each status type in the last hour
    const statuses = ['scheduled', 'processing', 'failed', 'sent', 'cancelled'];
    const jobCounts: Record<string, number> = {};

    await Promise.all(
      statuses.map(async (status) => {
        const count = await payload.count({
          collection: 'email-jobs',
          where: {
            and: [
              {
                status: {
                  equals: status,
                },
              },
              {
                lastAttempt: {
                  greater_than_equal: oneHourAgo.toISOString(),
                },
              },
            ],
          },
        });
        jobCounts[status] = count.totalDocs;
      })
    );

    const totalRecent = Object.values(jobCounts).reduce((sum, count) => sum + count, 0);
    const failureRate = totalRecent > 0 ? (jobCounts.failed || 0) / totalRecent : 0;

    if (failureRate > 0.2) {
      status = 'critical';
      issues.push(`High failure rate: ${(failureRate * 100).toFixed(1)}% in last hour`);
    } else if (failureRate > 0.1) {
      if (status !== 'critical') status = 'degraded';
      issues.push(`Elevated failure rate: ${(failureRate * 100).toFixed(1)}% in last hour`);
    }

    // Check for stuck jobs
    const fifteenMinutesAgo = new Date();
    fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15);

    const stuckJobs = await payload.count({
      collection: 'email-jobs',
      where: {
        status: {
          equals: 'processing',
        },
        updatedAt: {
          less_than: fifteenMinutesAgo,
        },
      },
    });

    if (stuckJobs.totalDocs > 0) {
      if (status !== 'critical') status = 'degraded';
      issues.push(`${stuckJobs.totalDocs} jobs stuck in processing state`);
    }

    // Check oldest scheduled job
    const oldestJob = await payload.find({
      collection: 'email-jobs',
      where: {
        status: {
          equals: 'scheduled',
        },
      },
      sort: 'scheduledFor',
      limit: 1,
    });

    const oldestScheduledJob = oldestJob.docs[0]?.scheduledFor
      ? new Date(oldestJob.docs[0].scheduledFor)
      : null;

    if (oldestScheduledJob) {
      const delayMinutes = (Date.now() - oldestScheduledJob.getTime()) / (1000 * 60);
      if (delayMinutes > 60) {
        if (status !== 'critical') status = 'degraded';
        issues.push(`Oldest scheduled email delayed by ${Math.round(delayMinutes)} minutes`);
      }
    }

    // Calculate average processing time
    const recentSentJobs = await payload.find({
      collection: 'email-jobs',
      where: {
        and: [
          {
            status: {
              equals: 'sent',
            },
          },
          {
            lastAttempt: {
              greater_than_equal: oneHourAgo.toISOString(),
            },
          },
        ],
      },
      limit: 100, // Sample up to 100 recent jobs
    });

    let avgProcessingTime = 0;
    if (recentSentJobs.docs.length > 0) {
      const processingTimes = recentSentJobs.docs
        .filter((job) => job.scheduledFor && job.lastAttempt)
        .map((job) => {
          const scheduled = new Date(job.scheduledFor).getTime();
          const attempted = new Date(job.lastAttempt).getTime();
          return attempted - scheduled;
        });

      if (processingTimes.length > 0) {
        avgProcessingTime =
          processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length;
      }
    }

    return {
      status,
      issues,
      metrics: {
        queueDepth: scheduledCount.totalDocs,
        failureRate,
        processingTime: Math.round(avgProcessingTime / 1000), // Convert to seconds
        oldestScheduledJob,
      },
    };
  } catch (error) {
    return {
      status: 'critical',
      issues: [`Health check failed: ${error instanceof Error ? error.message : String(error)}`],
      metrics: {
        queueDepth: 0,
        failureRate: 0,
        processingTime: 0,
        oldestScheduledJob: null,
      },
    };
  }
}

export async function generateEmailSystemReport(
  payload: Payload,
  days: number = 7
): Promise<{
  summary: {
    totalSent: number;
    totalFailed: number;
    deliveryRate: string;
    avgProcessingTime: string;
    topTemplates: Array<{ template: string; count: number }>;
    topSequences: Array<{ sequence: string; count: number }>;
  };
  dailyStats: Array<{
    date: string;
    sent: number;
    failed: number;
    deliveryRate: string;
  }>;
}> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get total counts
  const sentCount = await payload.count({
    collection: 'email-logs',
    where: {
      sentAt: {
        greater_than: startDate,
      },
    },
  });

  const failedCount = await payload.count({
    collection: 'email-jobs',
    where: {
      status: {
        equals: 'failed',
      },
      lastAttempt: {
        greater_than: startDate,
      },
    },
  });

  const totalAttempted = sentCount.totalDocs + failedCount.totalDocs;
  const deliveryRate =
    totalAttempted > 0 ? ((sentCount.totalDocs / totalAttempted) * 100).toFixed(2) : '0.00';

  // Get average processing time
  const sentJobsSample = await payload.find({
    collection: 'email-jobs',
    where: {
      and: [
        {
          status: {
            equals: 'sent',
          },
        },
        {
          lastAttempt: {
            greater_than_equal: startDate.toISOString(),
          },
        },
      ],
    },
    limit: 100, // Sample up to 100 jobs
  });

  let avgProcessingTime = 0;
  if (sentJobsSample.docs.length > 0) {
    const processingTimes = sentJobsSample.docs
      .filter((job) => job.scheduledFor && job.lastAttempt)
      .map((job) => {
        const scheduled = new Date(job.scheduledFor).getTime();
        const attempted = new Date(job.lastAttempt).getTime();
        return attempted - scheduled;
      });

    if (processingTimes.length > 0) {
      avgProcessingTime =
        processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length;
    }
  }

  // Get top templates
  // TODO: Implement when Payload v3 supports complex aggregations
  const templateStats: Array<{ _id: string; count: number }> = [];

  // Get daily statistics
  // TODO: Implement when Payload v3 supports complex aggregations
  const dailyStats: Array<{ _id: string; sent: number }> = [];

  const dailyFailed: Array<{ _id: string; failed: number }> = [];

  // Merge daily stats
  const dailyMap = new Map();
  dailyStats.forEach((day) => {
    dailyMap.set(day._id, { date: day._id, sent: day.sent, failed: 0 });
  });
  dailyFailed.forEach((day) => {
    const existing = dailyMap.get(day._id);
    if (existing) {
      existing.failed = day.failed;
    } else {
      dailyMap.set(day._id, { date: day._id, sent: 0, failed: day.failed });
    }
  });

  const mergedDailyStats = Array.from(dailyMap.values())
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((day) => ({
      ...day,
      deliveryRate:
        day.sent + day.failed > 0
          ? ((day.sent / (day.sent + day.failed)) * 100).toFixed(2)
          : '0.00',
    }));

  return {
    summary: {
      totalSent: sentCount.totalDocs,
      totalFailed: failedCount.totalDocs,
      deliveryRate: `${deliveryRate}%`,
      avgProcessingTime: `${(avgProcessingTime / 1000).toFixed(2)}s`,
      topTemplates: templateStats.map((t) => ({ template: t._id, count: t.count })),
      topSequences: [], // You can implement sequence stats similarly
    },
    dailyStats: mergedDailyStats,
  };
}
