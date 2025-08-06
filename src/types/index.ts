// Central export point for all types

// Shared types
export * from './shared';

// Payload generated types
export * from '@/payload-types';

// Domain types (also available through domains)
export type {
  EmailStats,
  TemplateStats,
  EmailAnalytics,
  DateRange as EmailDateRange,
  EmailLogStatus,
  EmailPreviewParams,
  EmailTestParams,
} from '@/domains/email';

export type {
  Script,
  AccessLogEntry,
  ScriptAccess,
  Booking,
  BookingStatus,
  BookingCreateParams,
  BookingUpdateParams,
} from '@/domains/booking';

export type {
  Invoice,
  InvoiceItem,
  PaymentDetails,
  InvoiceStatus,
  InvoiceCreateParams,
  InvoiceUpdateParams,
  InvoiceStats,
  PaymentCreateParams,
} from '@/domains/billing';
