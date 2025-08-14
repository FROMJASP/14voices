import { BaseError, ErrorCode } from './base';
import globalCache from '@/lib/cache';

/**
 * Error aggregation service for tracking and reporting error patterns
 */
export class ErrorAggregator {
  private static readonly ERROR_STATS_PREFIX = 'error_stats:';
  private static readonly ERROR_HISTORY_PREFIX = 'error_history:';
  private static readonly AGGREGATION_WINDOW = 3600; // 1 hour in seconds
  private static readonly MAX_HISTORY_SIZE = 100;

  /**
   * Record an error occurrence
   */
  static async recordError(error: BaseError): Promise<void> {
    const timestamp = Date.now();
    const hour = Math.floor(timestamp / (1000 * 60 * 60));
    
    // Update error counts
    await this.incrementErrorCount(error.code, hour);
    
    // Update error history
    await this.addToErrorHistory(error);
    
    // Check for error spikes
    await this.checkErrorSpike(error.code);
  }

  /**
   * Get error statistics for a time period
   */
  static async getErrorStats(
    startTime: Date,
    endTime: Date = new Date()
  ): Promise<ErrorStatistics> {
    const stats: ErrorStatistics = {
      totalErrors: 0,
      errorsByCode: {},
      errorsByHour: {},
      topErrors: [],
      errorRate: 0,
    };

    const startHour = Math.floor(startTime.getTime() / (1000 * 60 * 60));
    const endHour = Math.floor(endTime.getTime() / (1000 * 60 * 60));

    // Collect stats for each hour
    for (let hour = startHour; hour <= endHour; hour++) {
      const hourStats = await this.getHourlyStats(hour);
      
      stats.totalErrors += hourStats.total;
      stats.errorsByHour[hour] = hourStats.total;
      
      // Aggregate by error code
      for (const [code, count] of Object.entries(hourStats.byCode)) {
        stats.errorsByCode[code] = (stats.errorsByCode[code] || 0) + count;
      }
    }

    // Calculate top errors
    stats.topErrors = Object.entries(stats.errorsByCode)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([code, count]) => ({ code, count }));

    // Calculate error rate (errors per hour)
    const hours = endHour - startHour + 1;
    stats.errorRate = stats.totalErrors / hours;

    return stats;
  }

  /**
   * Get recent error history
   */
  static async getRecentErrors(limit = 20): Promise<ErrorHistoryEntry[]> {
    const historyKey = `${this.ERROR_HISTORY_PREFIX}recent`;
    const history = await globalCache.get<ErrorHistoryEntry[]>(historyKey);
    
    if (!history) {
      return [];
    }

    return history.slice(0, limit);
  }

  /**
   * Get error trends
   */
  static async getErrorTrends(
    errorCode: string,
    hours = 24
  ): Promise<ErrorTrend> {
    const now = Date.now();
    const currentHour = Math.floor(now / (1000 * 60 * 60));
    const trend: ErrorTrend = {
      code: errorCode,
      hourly: [],
      total: 0,
      average: 0,
      trend: 'stable',
    };

    // Collect hourly data
    for (let i = hours - 1; i >= 0; i--) {
      const hour = currentHour - i;
      const count = await this.getErrorCountForHour(errorCode, hour);
      trend.hourly.push({ hour, count });
      trend.total += count;
    }

    // Calculate average
    trend.average = trend.total / hours;

    // Determine trend
    const recentAvg = trend.hourly.slice(-6).reduce((sum, h) => sum + h.count, 0) / 6;
    const oldAvg = trend.hourly.slice(0, 6).reduce((sum, h) => sum + h.count, 0) / 6;

    if (recentAvg > oldAvg * 1.5) {
      trend.trend = 'increasing';
    } else if (recentAvg < oldAvg * 0.5) {
      trend.trend = 'decreasing';
    }

    return trend;
  }

  /**
   * Generate error report
   */
  static async generateErrorReport(
    period: 'daily' | 'weekly' | 'monthly' = 'daily'
  ): Promise<ErrorReport> {
    const now = new Date();
    let startTime: Date;

    switch (period) {
      case 'daily':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'weekly':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    const stats = await this.getErrorStats(startTime, now);
    const criticalErrors = await this.getCriticalErrors(startTime, now);
    const errorSpikes = await this.getErrorSpikes(startTime, now);

    return {
      period,
      startTime,
      endTime: now,
      stats,
      criticalErrors,
      errorSpikes,
      recommendations: this.generateRecommendations(stats, criticalErrors),
    };
  }

  /**
   * Private helper methods
   */
  private static async incrementErrorCount(code: string, hour: number): Promise<void> {
    const statsKey = `${this.ERROR_STATS_PREFIX}${hour}`;
    const stats = await globalCache.get<HourlyErrorStats>(statsKey) || {
      total: 0,
      byCode: {},
    };

    stats.total++;
    stats.byCode[code] = (stats.byCode[code] || 0) + 1;

    await globalCache.set(statsKey, stats, this.AGGREGATION_WINDOW);
  }

  private static async addToErrorHistory(error: BaseError): Promise<void> {
    const historyKey = `${this.ERROR_HISTORY_PREFIX}recent`;
    const history = await globalCache.get<ErrorHistoryEntry[]>(historyKey) || [];

    const entry: ErrorHistoryEntry = {
      timestamp: new Date(),
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      isOperational: error.isOperational,
    };

    history.unshift(entry);
    
    // Keep only recent entries
    if (history.length > this.MAX_HISTORY_SIZE) {
      history.pop();
    }

    await globalCache.set(historyKey, history, this.AGGREGATION_WINDOW);
  }

  private static async checkErrorSpike(code: string): Promise<void> {
    const trend = await this.getErrorTrends(code, 3);
    
    if (trend.trend === 'increasing' && trend.average > 10) {
      // Log spike detection
      console.warn(`Error spike detected for ${code}: ${trend.total} errors in last 3 hours`);
      
      // TODO: Send alert notification
    }
  }

  private static async getHourlyStats(hour: number): Promise<HourlyErrorStats> {
    const statsKey = `${this.ERROR_STATS_PREFIX}${hour}`;
    return await globalCache.get<HourlyErrorStats>(statsKey) || {
      total: 0,
      byCode: {},
    };
  }

  private static async getErrorCountForHour(code: string, hour: number): Promise<number> {
    const stats = await this.getHourlyStats(hour);
    return stats.byCode[code] || 0;
  }

  private static async getCriticalErrors(
    _startTime: Date,
    _endTime: Date
  ): Promise<CriticalError[]> {
    const criticalCodes = [
      ErrorCode.DATABASE_ERROR,
      ErrorCode.PAYMENT_FAILED,
      ErrorCode.EXTERNAL_SERVICE_ERROR,
    ];

    const criticalErrors: CriticalError[] = [];

    for (const code of criticalCodes) {
      const trend = await this.getErrorTrends(code, 24);
      if (trend.total > 0) {
        criticalErrors.push({
          code,
          count: trend.total,
          trend: trend.trend,
          lastOccurrence: new Date(), // TODO: Track actual last occurrence
        });
      }
    }

    return criticalErrors;
  }

  private static async getErrorSpikes(
    _startTime: Date,
    _endTime: Date
  ): Promise<ErrorSpike[]> {
    // TODO: Implement spike detection logic
    return [];
  }

  private static generateRecommendations(
    stats: ErrorStatistics,
    criticalErrors: CriticalError[]
  ): string[] {
    const recommendations: string[] = [];

    // Check error rate
    if (stats.errorRate > 100) {
      recommendations.push('High error rate detected. Consider scaling resources or investigating root cause.');
    }

    // Check for specific error patterns
    for (const { code, count } of stats.topErrors) {
      if (code === ErrorCode.RATE_LIMIT_EXCEEDED && count > 1000) {
        recommendations.push('High rate limit errors. Consider increasing rate limits or implementing request queuing.');
      }
      if (code === ErrorCode.DATABASE_ERROR && count > 100) {
        recommendations.push('Database errors detected. Check database health and connection pool settings.');
      }
    }

    // Check critical errors
    if (criticalErrors.length > 0) {
      recommendations.push('Critical errors detected. Immediate investigation recommended.');
    }

    return recommendations;
  }
}

/**
 * Type definitions
 */
interface HourlyErrorStats {
  total: number;
  byCode: Record<string, number>;
}

export interface ErrorStatistics {
  totalErrors: number;
  errorsByCode: Record<string, number>;
  errorsByHour: Record<number, number>;
  topErrors: Array<{ code: string; count: number }>;
  errorRate: number;
}

export interface ErrorHistoryEntry {
  timestamp: Date;
  code: string;
  message: string;
  statusCode: number;
  isOperational: boolean;
}

export interface ErrorTrend {
  code: string;
  hourly: Array<{ hour: number; count: number }>;
  total: number;
  average: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface CriticalError {
  code: string;
  count: number;
  trend: string;
  lastOccurrence: Date;
}

export interface ErrorSpike {
  code: string;
  startTime: Date;
  peakCount: number;
  duration: number;
}

export interface ErrorReport {
  period: 'daily' | 'weekly' | 'monthly';
  startTime: Date;
  endTime: Date;
  stats: ErrorStatistics;
  criticalErrors: CriticalError[];
  errorSpikes: ErrorSpike[];
  recommendations: string[];
}