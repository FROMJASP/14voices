// Central export point for all types

// Shared types (excluding duplicates from payload-types)
export type {
  PaginationParams,
  PaginatedResponse,
  ApiResponse,
  DateRange,
  Address,
  ContactInfo,
  // Email marketing types that don't conflict with payload collections
  CampaignAnalytics,
  SegmentRules,
} from './shared';

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
