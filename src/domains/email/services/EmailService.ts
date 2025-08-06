import { Payload } from 'payload';
import { EmailRepository } from '../repositories/EmailRepository';
import { EmailAnalyticsService } from './EmailAnalyticsService';
import { EmailPreviewService } from './EmailPreviewService';
import { EmailTestService } from './EmailTestService';
import { DateRange, EmailAnalytics, EmailPreviewParams, EmailTestParams } from '../types';

export class EmailService {
  private repository: EmailRepository;
  private analyticsService: EmailAnalyticsService;
  private previewService: EmailPreviewService;
  private testService: EmailTestService;

  constructor(payload: Payload, resendApiKey?: string) {
    this.repository = new EmailRepository(payload);
    this.analyticsService = new EmailAnalyticsService(this.repository);
    this.previewService = new EmailPreviewService(this.repository);
    this.testService = new EmailTestService(this.previewService, resendApiKey);
  }

  // Analytics
  async getAnalytics(range: DateRange = '7d'): Promise<EmailAnalytics> {
    return this.analyticsService.getAnalytics(range);
  }

  // Preview
  async generatePreview(params: EmailPreviewParams): Promise<string> {
    return this.previewService.generatePreview(params);
  }

  // Test
  async sendTestEmail(params: EmailTestParams, recipientEmail: string) {
    return this.testService.sendTestEmail(params, recipientEmail);
  }

  // Direct repository access for complex operations
  get repo() {
    return this.repository;
  }
}
