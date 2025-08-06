import { Payload } from 'payload';
import { InvoiceRepository } from '../repositories/InvoiceRepository';
import { InvoiceService } from './InvoiceService';
import {
  Invoice,
  InvoiceCreateParams,
  InvoiceUpdateParams,
  InvoiceStats,
  PaymentCreateParams,
} from '../types';

export class BillingService {
  private invoiceRepository: InvoiceRepository;
  private invoiceService: InvoiceService;

  constructor(payload: Payload) {
    this.invoiceRepository = new InvoiceRepository(payload);
    this.invoiceService = new InvoiceService(this.invoiceRepository);
  }

  // Invoice operations
  async getInvoice(invoiceId: string, userId: string, userRole: string): Promise<Invoice | null> {
    return this.invoiceService.getInvoice(invoiceId, userId, userRole);
  }

  async getUserInvoices(userId: string, userRole: string): Promise<Invoice[]> {
    return this.invoiceService.getUserInvoices(userId, userRole);
  }

  async createInvoice(data: InvoiceCreateParams): Promise<Invoice> {
    return this.invoiceService.createInvoice(data);
  }

  async updateInvoice(
    invoiceId: string,
    data: InvoiceUpdateParams,
    userId: string,
    userRole: string
  ): Promise<Invoice> {
    return this.invoiceService.updateInvoice(invoiceId, data, userId, userRole);
  }

  async deleteInvoice(invoiceId: string, userRole: string): Promise<void> {
    return this.invoiceService.deleteInvoice(invoiceId, userRole);
  }

  async sendInvoice(invoiceId: string, userRole: string): Promise<Invoice> {
    return this.invoiceService.sendInvoice(invoiceId, userRole);
  }

  async markInvoiceAsPaid(payment: PaymentCreateParams, userRole: string): Promise<Invoice> {
    return this.invoiceService.markAsPaid(payment, userRole);
  }

  // Stats and reporting
  async getInvoiceStats(userId?: string, userRole: string = 'customer'): Promise<InvoiceStats> {
    return this.invoiceService.getInvoiceStats(userId, userRole);
  }

  async getOverdueInvoices(): Promise<Invoice[]> {
    return this.invoiceService.getOverdueInvoices();
  }

  async updateOverdueStatuses(): Promise<number> {
    return this.invoiceService.updateOverdueStatuses();
  }

  // Direct repository access for complex operations
  get invoiceRepo() {
    return this.invoiceRepository;
  }
}
