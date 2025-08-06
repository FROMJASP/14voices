import { Payload } from 'payload';
import { Invoice, InvoiceCreateParams, InvoiceUpdateParams, InvoiceStatus } from '../types';

export class InvoiceRepository {
  constructor(private payload: Payload) {}

  async getInvoice(id: string): Promise<Invoice | null> {
    try {
      const invoice = await this.payload.findByID({
        collection: 'invoices',
        id,
        depth: 2,
      });
      return invoice as unknown as Invoice;
    } catch (error) {
      return null;
    }
  }

  async getInvoiceByNumber(invoiceNumber: string): Promise<Invoice | null> {
    const response = await this.payload.find({
      collection: 'invoices',
      where: {
        invoiceNumber: { equals: invoiceNumber },
      },
      depth: 2,
      limit: 1,
    });

    return (response.docs[0] as unknown as Invoice) || null;
  }

  async getUserInvoices(userId: string, role: string = 'customer'): Promise<Invoice[]> {
    const where =
      role === 'admin'
        ? {}
        : {
            or: [{ client: { equals: userId } }, { provider: { equals: userId } }],
          };

    const response = await this.payload.find({
      collection: 'invoices',
      where,
      depth: 2,
      sort: '-createdAt',
    });

    return response.docs as unknown as Invoice[];
  }

  async createInvoice(data: InvoiceCreateParams & { invoiceNumber: string }): Promise<Invoice> {
    // Calculate totals
    const items = data.items.map((item) => ({
      ...item,
      total: item.quantity * item.unitPrice,
    }));

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = data.tax || 0;
    const total = subtotal + tax;

    const invoice = await this.payload.create({
      collection: 'invoices',
      data: {
        ...data,
        items,
        subtotal,
        tax,
        total,
        status: 'draft' as InvoiceStatus,
        issueDate: new Date().toISOString(),
        currency: data.currency || 'EUR',
      },
    });

    return invoice as unknown as Invoice;
  }

  async updateInvoice(id: string, data: InvoiceUpdateParams): Promise<Invoice> {
    let updateData: any = { ...data };

    // Recalculate totals if items are updated
    if (data.items) {
      const items = data.items.map((item) => ({
        ...item,
        total: item.quantity * item.unitPrice,
      }));

      const subtotal = items.reduce((sum, item) => sum + item.total, 0);
      const tax = data.tax || 0;
      const total = subtotal + tax;

      updateData = {
        ...updateData,
        items,
        subtotal,
        tax,
        total,
      };
    }

    const invoice = await this.payload.update({
      collection: 'invoices',
      id,
      data: updateData,
    });

    return invoice as unknown as Invoice;
  }

  async deleteInvoice(id: string): Promise<void> {
    await this.payload.delete({
      collection: 'invoices',
      id,
    });
  }

  async getInvoicesByStatus(status: InvoiceStatus): Promise<Invoice[]> {
    const response = await this.payload.find({
      collection: 'invoices',
      where: {
        status: { equals: status },
      },
      depth: 2,
    });

    return response.docs as unknown as Invoice[];
  }

  async getOverdueInvoices(): Promise<Invoice[]> {
    const today = new Date().toISOString();

    const response = await this.payload.find({
      collection: 'invoices',
      where: {
        and: [
          { status: { not_equals: 'paid' } },
          { status: { not_equals: 'cancelled' } },
          { dueDate: { less_than: today } },
        ],
      },
      depth: 2,
    });

    return response.docs as unknown as Invoice[];
  }

  async getNextInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `INV-${year}-`;

    const response = await this.payload.find({
      collection: 'invoices',
      where: {
        invoiceNumber: { contains: prefix },
      },
      sort: '-invoiceNumber',
      limit: 1,
    });

    if (response.docs.length === 0) {
      return `${prefix}001`;
    }

    const lastInvoice = response.docs[0];
    const lastNumber = parseInt(lastInvoice.invoiceNumber.split('-').pop() || '0', 10);
    const nextNumber = (lastNumber + 1).toString().padStart(3, '0');

    return `${prefix}${nextNumber}`;
  }
}
