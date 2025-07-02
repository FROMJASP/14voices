import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { createApiHandler } from '@/lib/api/handlers'
import { createPerformanceMonitor } from '@/lib/db/performance-monitor'

export const GET = createApiHandler(
  async () => {
    const payload = await getPayload({ config: configPromise })
    const monitor = createPerformanceMonitor(payload)
    
    // Get performance metrics
    const report = await monitor.generatePerformanceReport()
    
    // Calculate average response times from recent API calls
    const recentApiCalls = process.env.NODE_ENV === 'production'
      ? await getRecentApiMetrics()
      : mockApiMetrics()
    
    return {
      status: determineHealthStatus(report, recentApiCalls),
      metrics: {
        database: {
          slowQueries: report.slowQueries.length,
          unusedIndexes: report.unusedIndexes.length,
          connectionPool: report.connectionStats,
          avgQueryTime: calculateAvgQueryTime(report.slowQueries),
        },
        api: {
          avgResponseTime: recentApiCalls.avgResponseTime,
          p95ResponseTime: recentApiCalls.p95ResponseTime,
          p99ResponseTime: recentApiCalls.p99ResponseTime,
          requestsPerMinute: recentApiCalls.rpm,
        },
        tables: {
          largest: report.largestTables.slice(0, 5).map(t => ({
            name: t.tableName,
            size: t.totalSize
          }))
        }
      },
      recommendations: generateRecommendations(report, recentApiCalls),
      timestamp: new Date().toISOString()
    }
  },
  {
    cache: {
      enabled: true,
      ttl: 60000, // 1 minute cache
      key: () => 'health:performance'
    },
    rateLimit: {
      requests: 10,
      window: 60
    }
  }
)

function determineHealthStatus(report: any, apiMetrics: any): string {
  if (report.slowQueries.length > 10 || apiMetrics.avgResponseTime > 500) {
    return 'degraded'
  }
  if (report.slowQueries.length > 5 || apiMetrics.avgResponseTime > 200) {
    return 'warning'
  }
  return 'healthy'
}

function calculateAvgQueryTime(slowQueries: any[]): number {
  if (slowQueries.length === 0) return 0
  const total = slowQueries.reduce((sum, q) => sum + q.meanTime, 0)
  return Math.round(total / slowQueries.length)
}

function generateRecommendations(report: any, apiMetrics: any): string[] {
  const recommendations: string[] = []
  
  if (report.slowQueries.length > 5) {
    recommendations.push('Consider optimizing slow queries or adding indexes')
  }
  
  if (report.unusedIndexes.length > 10) {
    recommendations.push('Remove unused indexes to improve write performance')
  }
  
  if (apiMetrics.avgResponseTime > 200) {
    recommendations.push('API response times exceeding target - review caching strategy')
  }
  
  if (report.connectionStats.waiting > 5) {
    recommendations.push('Database connections are queuing - consider increasing pool size')
  }
  
  return recommendations
}

// Mock data for development
function mockApiMetrics() {
  return {
    avgResponseTime: 85,
    p95ResponseTime: 150,
    p99ResponseTime: 200,
    rpm: 120
  }
}

async function getRecentApiMetrics() {
  // In production, this would fetch from monitoring service
  // For now, return mock data
  return mockApiMetrics()
}