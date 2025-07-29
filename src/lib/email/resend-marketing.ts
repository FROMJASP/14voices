import { Resend } from 'resend';

export interface CreateAudienceOptions {
  name: string;
}

export interface CreateContactOptions {
  email: string;
  firstName?: string;
  lastName?: string;
  unsubscribed?: boolean;
  audienceId: string;
}

export interface UpdateContactOptions {
  id: string;
  audienceId: string;
  firstName?: string;
  lastName?: string;
  unsubscribed?: boolean;
}

export interface SendBroadcastOptions {
  audienceId: string;
  from: string;
  subject: string;
  html?: string;
  text?: string;
  markdown?: string;
  replyTo?: string;
  scheduledAt?: string;
}

export interface BroadcastAnalytics {
  broadcastId: string;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  complained: number;
}

export class ResendMarketingService {
  resend: Resend;

  constructor(apiKey?: string) {
    this.resend = new Resend(apiKey || process.env.RESEND_API_KEY);
  }

  async createAudience(options: CreateAudienceOptions) {
    try {
      const response = await this.resend.audiences.create({
        name: options.name,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      console.error('Failed to create audience:', error);
      throw error;
    }
  }

  async listAudiences() {
    try {
      const response = await this.resend.audiences.list();

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      console.error('Failed to list audiences:', error);
      throw error;
    }
  }

  async getAudience(audienceId: string) {
    try {
      const response = await this.resend.audiences.get(audienceId);

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      console.error('Failed to get audience:', error);
      throw error;
    }
  }

  async removeAudience(audienceId: string) {
    try {
      const response = await this.resend.audiences.remove(audienceId);

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      console.error('Failed to remove audience:', error);
      throw error;
    }
  }

  async createContact(options: CreateContactOptions) {
    try {
      const response = await this.resend.contacts.create({
        email: options.email,
        firstName: options.firstName,
        lastName: options.lastName,
        unsubscribed: options.unsubscribed || false,
        audienceId: options.audienceId,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      console.error('Failed to create contact:', error);
      throw error;
    }
  }

  async updateContact(options: UpdateContactOptions) {
    try {
      const response = await this.resend.contacts.update({
        id: options.id,
        audienceId: options.audienceId,
        firstName: options.firstName,
        lastName: options.lastName,
        unsubscribed: options.unsubscribed,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      console.error('Failed to update contact:', error);
      throw error;
    }
  }

  async listContacts(audienceId: string) {
    try {
      const response = await this.resend.contacts.list({
        audienceId,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      console.error('Failed to list contacts:', error);
      throw error;
    }
  }

  async getContact(contactId: string, audienceId: string) {
    try {
      const response = await this.resend.contacts.get({ id: contactId, audienceId });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      console.error('Failed to get contact:', error);
      throw error;
    }
  }

  async removeContact(options: { id: string; audienceId: string }) {
    try {
      const response = await this.resend.contacts.remove({
        id: options.id,
        audienceId: options.audienceId,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      console.error('Failed to remove contact:', error);
      throw error;
    }
  }

  async sendBroadcast(options: SendBroadcastOptions) {
    try {
      // First create the broadcast - build the payload conditionally
      const createPayload: {
        audienceId: string;
        from: string;
        subject: string;
        html?: string;
        text?: string;
        replyTo?: string;
      } = {
        audienceId: options.audienceId,
        from: options.from,
        subject: options.subject,
      };

      // Add content - at least one is required
      if (options.html) {
        createPayload.html = options.html;
      }
      if (options.text) {
        createPayload.text = options.text;
      }
      if (options.replyTo) {
        createPayload.replyTo = options.replyTo;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const createResponse = await this.resend.broadcasts.create(createPayload as any);

      if (createResponse.error) {
        throw new Error(createResponse.error.message);
      }

      if (!createResponse.data?.id) {
        throw new Error('No broadcast ID returned');
      }

      // Then send it
      const sendOptions = options.scheduledAt ? { scheduledAt: options.scheduledAt } : undefined;
      const sendResponse = await this.resend.broadcasts.send(createResponse.data.id, sendOptions);

      if (sendResponse.error) {
        throw new Error(sendResponse.error.message);
      }

      return sendResponse.data;
    } catch (error) {
      console.error('Failed to send broadcast:', error);
      throw error;
    }
  }

  async getBroadcast(broadcastId: string) {
    try {
      const response = await this.resend.broadcasts.get(broadcastId);

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      console.error('Failed to get broadcast:', error);
      throw error;
    }
  }

  async listBroadcasts() {
    try {
      const response = await this.resend.broadcasts.list();

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      console.error('Failed to list broadcasts:', error);
      throw error;
    }
  }

  async importContactsBulk(
    audienceId: string,
    contacts: Array<{
      email: string;
      firstName?: string;
      lastName?: string;
      unsubscribed?: boolean;
    }>
  ) {
    const results = {
      success: [] as Array<{ id: string }>,
      failed: [] as { email: string; error: string }[],
    };

    for (const contact of contacts) {
      try {
        const result = await this.createContact({
          ...contact,
          audienceId,
        });
        if (result && result.id) {
          results.success.push(result);
        } else {
          throw new Error('No contact ID returned');
        }
      } catch (error) {
        results.failed.push({
          email: contact.email,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }

  async exportContacts(audienceId: string) {
    try {
      const contacts = await this.listContacts(audienceId);

      if (!contacts || !contacts.data) {
        throw new Error('No contacts data available');
      }

      const csvData = [
        ['Email', 'First Name', 'Last Name', 'Subscribed', 'Created At'].join(','),
        ...contacts.data.map((contact) =>
          [
            contact.email,
            contact.first_name || '',
            contact.last_name || '',
            !contact.unsubscribed,
            contact.created_at,
          ].join(',')
        ),
      ].join('\n');

      return {
        csv: csvData,
        count: contacts.data.length,
      };
    } catch (error) {
      console.error('Failed to export contacts:', error);
      throw error;
    }
  }
}

export const resendMarketing = new ResendMarketingService();
