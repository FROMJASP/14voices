export interface Invoice {
  id: string;
  invoiceNumber: string;
  client: string | { id: string; email?: string; name?: string };
  provider: string | { id: string; email?: string; name?: string };
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  notes?: string;
  paymentDetails?: PaymentDetails;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  booking?: string | { id: string };
}

export interface PaymentDetails {
  method?: 'bank_transfer' | 'credit_card' | 'paypal' | 'other';
  reference?: string;
  paidDate?: string;
  bankAccount?: {
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
    iban?: string;
    swiftCode?: string;
  };
}

export type InvoiceStatus =
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'paid'
  | 'partially_paid'
  | 'overdue'
  | 'cancelled';

export interface InvoiceCreateParams {
  client: string;
  provider: string;
  dueDate: string;
  items: Omit<InvoiceItem, 'total'>[];
  tax?: number;
  currency?: string;
  notes?: string;
  paymentDetails?: PaymentDetails;
}

export interface InvoiceUpdateParams {
  status?: InvoiceStatus;
  dueDate?: string;
  items?: Omit<InvoiceItem, 'total'>[];
  tax?: number;
  notes?: string;
  paymentDetails?: PaymentDetails;
}

export interface InvoiceStats {
  totalInvoices: number;
  totalRevenue: number;
  paidInvoices: number;
  unpaidInvoices: number;
  overdueInvoices: number;
  averageInvoiceValue: number;
}

export interface PaymentCreateParams {
  invoiceId: string;
  amount: number;
  method: PaymentDetails['method'];
  reference?: string;
  paidDate?: string;
}
