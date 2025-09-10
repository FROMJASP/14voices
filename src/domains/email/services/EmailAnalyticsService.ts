import { EmailRepository } from '../repositories/EmailRepository';
import { DateRange, EmailAnalytics, TemplateStats, EmailStats } from '../types';
import type { EmailLog } from '@/payload-types';

export class EmailAnalyticsService {
  constructor(private emailRepository: EmailRepository) {}

  getDateRange(range: DateRange): Date {
    const now = new Date();
    const milliseconds = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
    };

    return new Date(now.getTime() - milliseconds[range]);
  }

  async getAnalytics(range: DateRange = '7d'): Promise<EmailAnalytics> {
    const startDate = this.getDateRange(range);
    const emailLogs = await this.emailRepository.getEmailLogs(startDate);

    // Calculate overall stats
    const overall = this.calculateOverallStats(emailLogs);

    // Calculate stats by template
    const byTemplate = this.calculateTemplateStats(emailLogs);

    return { overall, byTemplate };
  }

  private calculateOverallStats(emailLogs: { totalDocs: number; docs: EmailLog[] }): EmailStats {
    const totalSent = emailLogs.totalDocs;
    const totalDelivered = emailLogs.docs.filter((log) =>
      ['delivered', 'opened', 'clicked'].includes(log.status)
    ).length;
    const totalOpened = emailLogs.docs.filter((log) =>
      ['opened', 'clicked'].includes(log.status)
    ).length;
    const totalClicked = emailLogs.docs.filter((log) => log.status === 'clicked').length;
    const totalBounced = emailLogs.docs.filter((log) => log.status === 'bounced').length;

    return {
      totalSent,
      totalDelivered,
      totalOpened,
      totalClicked,
      totalBounced,
      openRate: totalSent > 0 ? (totalOpened / totalSent) * 100 : 0,
      clickRate: totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0,
      bounceRate: totalSent > 0 ? (totalBounced / totalSent) * 100 : 0,
    };
  }

  private calculateTemplateStats(emailLogs: { docs: EmailLog[] }): TemplateStats[] {
    const templateMap = new Map<string, Omit<TemplateStats, 'openRate' | 'clickRate'>>();

    emailLogs.docs.forEach((log) => {
      const templateId =
        typeof log.template === 'number'
          ? String(log.template)
          : log.template && typeof log.template === 'object' && log.template.id
            ? String(log.template.id)
            : 'unknown';
      const templateName =
        typeof log.template === 'object' && log.template?.name
          ? log.template.name
          : 'Unknown Template';

      if (!templateMap.has(templateId)) {
        templateMap.set(templateId, {
          templateName,
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
        });
      }

      const stats = templateMap.get(templateId)!;
      stats.sent++;

      if (['delivered', 'opened', 'clicked'].includes(log.status)) {
        stats.delivered++;
      }
      if (['opened', 'clicked'].includes(log.status)) {
        stats.opened++;
      }
      if (log.status === 'clicked') {
        stats.clicked++;
      }
    });

    return Array.from(templateMap.values()).map((stats) => ({
      ...stats,
      openRate: stats.sent > 0 ? (stats.opened / stats.sent) * 100 : 0,
      clickRate: stats.opened > 0 ? (stats.clicked / stats.opened) * 100 : 0,
    }));
  }
}
