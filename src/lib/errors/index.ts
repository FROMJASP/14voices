// Base error classes
export { BaseError, ErrorCode, HttpStatus } from './base';

// Domain-specific errors
export {
  // Voiceover errors
  VoiceoverError,
  VoiceoverNotFoundError,
  VoiceoverUnavailableError,
  
  // Booking errors
  BookingError,
  BookingNotFoundError,
  BookingAlreadyExistsError,
  BookingFailedError,
  
  // Payment errors
  PaymentError,
  PaymentFailedError,
  PaymentProcessingError,
  InvalidPaymentMethodError,
  
  // Email errors
  EmailError,
  EmailSendFailedError,
  EmailTemplateNotFoundError,
  
  // File upload errors
  FileUploadError,
  FileUploadFailedError,
  FileTooLargeError,
  InvalidFileTypeError,
  
  // Infrastructure errors
  DatabaseError,
  CacheError,
  ExternalServiceError,
} from './domain-errors';

// API errors
export {
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  RateLimitError,
  ServiceUnavailableError,
  formatApiError,
  createErrorResponse,
  withErrorHandler,
} from './api-errors';

// Error logging
export {
  logger,
  LogLevel,
  logError,
  logPerformance,
  logApiRequest,
  logApiResponse,
} from './logger';

// Type exports
export type { ApiErrorResponse } from './api-errors';
export type { LogContext, Logger } from './logger';