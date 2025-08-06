import { Resend } from 'resend';
import { EmailTestParams } from '../types';
import { EmailPreviewService } from './EmailPreviewService';

export class EmailTestService {
  private resend: Resend;

  constructor(
    private emailPreviewService: EmailPreviewService,
    resendApiKey?: string
  ) {
    this.resend = new Resend(resendApiKey || process.env.RESEND_API_KEY);
  }

  async sendTestEmail(
    params: EmailTestParams,
    recipientEmail: string
  ): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const { templateId, subject = 'Email Preview', testData } = params;

      // Generate preview HTML
      const html = await this.emailPreviewService.generatePreview({
        templateId,
        recipientEmail,
        data: testData,
      });

      // Send test email
      const result = await this.resend.emails.send({
        from: `Test Email <noreply@14voices.com>`,
        to: recipientEmail,
        subject: `[TEST] ${subject}`,
        html,
        text: 'This is a test email from the email template editor.',
        tags: [
          { name: 'test', value: 'test' },
          { name: 'preview', value: 'preview' },
        ],
      });

      if (result.error) {
        return {
          success: false,
          error: result.error.message,
        };
      }

      return {
        success: true,
        id: result.data?.id,
      };
    } catch (error) {
      console.error('Test email error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send test email',
      };
    }
  }
}
