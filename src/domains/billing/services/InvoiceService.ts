import { InvoiceRepository } from '../repositories/InvoiceRepository';
import {
  Invoice,
  InvoiceCreateParams,
  InvoiceUpdateParams,
  InvoiceStats,
  PaymentCreateParams,
} from '../types';

export class InvoiceService {
  constructor(private invoiceRepository: InvoiceRepository) {}

  async getInvoice(invoiceId: string, userId: string, userRole: string): Promise<Invoice | null> {
    const invoice = await this.invoiceRepository.getInvoice(invoiceId);

    if (!invoice) {
      return null;
    }

    // Check access permissions
    if (userRole !== 'admin') {
      const clientId = typeof invoice.client === 'object' ? invoice.client.id : invoice.client;
      const providerId =
        typeof invoice.provider === 'object' ? invoice.provider.id : invoice.provider;

      if (clientId !== userId && providerId !== userId) {
        throw new Error('Access denied');
      }
    }

    return invoice;
  }

  async getUserInvoices(userId: string, userRole: string): Promise<Invoice[]> {
    return this.invoiceRepository.getUserInvoices(userId, userRole);
  }

  async createInvoice(data: InvoiceCreateParams): Promise<Invoice> {
    // Generate invoice number
    const invoiceNumber = await this.invoiceRepository.getNextInvoiceNumber();

    return this.invoiceRepository.createInvoice({
      ...data,
      invoiceNumber,
    });
  }

  async updateInvoice(
    invoiceId: string,
    data: InvoiceUpdateParams,
    _userId: string,
    userRole: string
  ): Promise<Invoice> {
    // Only admin can update invoices
    if (userRole !== 'admin') {
      throw new Error('Access denied');
    }

    return this.invoiceRepository.updateInvoice(invoiceId, data);
  }

  async deleteInvoice(invoiceId: string, userRole: string): Promise<void> {
    // Only admin can delete invoices
    if (userRole !== 'admin') {
      throw new Error('Access denied');
    }

    await this.invoiceRepository.deleteInvoice(invoiceId);
  }

  async sendInvoice(invoiceId: string, userRole: string): Promise<Invoice> {
    if (userRole !== 'admin') {
      throw new Error('Access denied');
    }

    return this.invoiceRepository.updateInvoice(invoiceId, {
      status: 'sent',
    });
  }

  async markAsPaid(payment: PaymentCreateParams, userRole: string): Promise<Invoice> {
    if (userRole !== 'admin') {
      throw new Error('Access denied');
    }

    const invoice = await this.invoiceRepository.getInvoice(payment.invoiceId);
    if (!invoice) {
      throw new Error('Invoice not found');
    }

    return this.invoiceRepository.updateInvoice(payment.invoiceId, {
      status: 'paid',
      paymentDetails: {
        method: payment.method,
        reference: payment.reference,
        paidDate: payment.paidDate || new Date().toISOString(),
      },
    });
  }

  async getInvoiceStats(userId?: string, userRole: string = 'customer'): Promise<InvoiceStats> {
    const invoices = userId
      ? await this.invoiceRepository.getUserInvoices(userId, userRole)
      : await this.invoiceRepository.getUserInvoices('', 'admin'); // Get all for admin

    const stats: InvoiceStats = {
      totalInvoices: invoices.length,
      totalRevenue: 0,
      paidInvoices: 0,
      unpaidInvoices: 0,
      overdueInvoices: 0,
      averageInvoiceValue: 0,
    };

    const today = new Date();

    invoices.forEach((invoice) => {
      if (invoice.status === 'paid') {
        stats.paidInvoices++;
        stats.totalRevenue += invoice.total;
      } else if (invoice.status !== 'cancelled') {
        stats.unpaidInvoices++;

        const dueDate = new Date(invoice.dueDate);
        if (dueDate < today) {
          stats.overdueInvoices++;
        }
      }
    });

    stats.averageInvoiceValue =
      stats.totalInvoices > 0 ? stats.totalRevenue / stats.paidInvoices : 0;

    return stats;
  }

  async getOverdueInvoices(): Promise<Invoice[]> {
    return this.invoiceRepository.getOverdueInvoices();
  }

  async updateOverdueStatuses(): Promise<number> {
    const overdueInvoices = await this.getOverdueInvoices();
    let updatedCount = 0;

    for (const invoice of overdueInvoices) {
      if (invoice.status === 'sent' || invoice.status === 'viewed') {
        await this.invoiceRepository.updateInvoice(invoice.id, {
          status: 'overdue',
        });
        updatedCount++;
      }
    }

    return updatedCount;
  }
}
