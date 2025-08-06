import { Payload } from 'payload';
import { EmailLogStatus } from '../types';

export class EmailRepository {
  constructor(private payload: Payload) {}

  async getEmailLogs(startDate: Date, limit = 10000) {
    return await this.payload.find({
      collection: 'email-logs',
      where: {
        sentAt: {
          greater_than_equal: startDate,
        },
      },
      limit,
      depth: 1,
    });
  }

  async getEmailTemplate(templateId: string) {
    return await this.payload.findByID({
      collection: 'email-templates',
      id: templateId,
      depth: 1,
    });
  }

  async createEmailLog(data: {
    recipient: string;
    template: string;
    status: EmailLogStatus['status'];
    subject?: string;
    sentAt?: Date;
    metadata?: Record<string, any>;
  }) {
    return await this.payload.create({
      collection: 'email-logs',
      data: {
        ...data,
        sentAt: data.sentAt || new Date(),
      },
    });
  }

  async updateEmailLogStatus(logId: string, status: EmailLogStatus['status']) {
    return await this.payload.update({
      collection: 'email-logs',
      id: logId,
      data: { status },
    });
  }

  async getEmailCampaign(campaignId: string) {
    return await this.payload.findByID({
      collection: 'email-campaigns',
      id: campaignId,
      depth: 2,
    });
  }

  async getAudiences(audienceIds: string[]) {
    return await this.payload.find({
      collection: 'audiences',
      where: {
        id: {
          in: audienceIds,
        },
      },
      limit: 100,
    });
  }
}
