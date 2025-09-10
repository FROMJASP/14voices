import { BaseError, ErrorCode, HttpStatus } from './base';

/**
 * Voiceover domain errors
 */
export class VoiceoverError extends BaseError {
  constructor(message: string, code: ErrorCode, statusCode: HttpStatus, details?: unknown) {
    super(message, code, statusCode, true, details);
  }
}

export class VoiceoverNotFoundError extends VoiceoverError {
  constructor(identifier: string) {
    super(
      `Voiceover not found: ${identifier}`,
      ErrorCode.VOICEOVER_NOT_FOUND,
      HttpStatus.NOT_FOUND,
      { identifier }
    );
  }

  getUserMessage(): string {
    return 'The requested voiceover could not be found.';
  }
}

export class VoiceoverUnavailableError extends VoiceoverError {
  constructor(voiceoverId: string, reason: string) {
    super(
      `Voiceover ${voiceoverId} is unavailable: ${reason}`,
      ErrorCode.VOICEOVER_UNAVAILABLE,
      HttpStatus.CONFLICT,
      { voiceoverId, reason }
    );
  }

  getUserMessage(): string {
    return 'This voiceover is currently unavailable for booking.';
  }
}

/**
 * Booking domain errors
 */
export class BookingError extends BaseError {
  constructor(message: string, code: ErrorCode, statusCode: HttpStatus, details?: unknown) {
    super(message, code, statusCode, true, details);
  }
}

export class BookingNotFoundError extends BookingError {
  constructor(bookingId: string) {
    super(`Booking not found: ${bookingId}`, ErrorCode.BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND, {
      bookingId,
    });
  }

  getUserMessage(): string {
    return 'The requested booking could not be found.';
  }
}

export class BookingAlreadyExistsError extends BookingError {
  constructor(productionId: string, voiceoverId: string) {
    super(
      `Booking already exists for production ${productionId} and voiceover ${voiceoverId}`,
      ErrorCode.BOOKING_ALREADY_EXISTS,
      HttpStatus.CONFLICT,
      { productionId, voiceoverId }
    );
  }

  getUserMessage(): string {
    return 'This voiceover has already been booked for this production.';
  }
}

export class BookingFailedError extends BookingError {
  constructor(reason: string, details?: unknown) {
    super(`Booking failed: ${reason}`, ErrorCode.BOOKING_FAILED, HttpStatus.BAD_REQUEST, details);
  }

  getUserMessage(): string {
    return 'Unable to complete the booking. Please try again or contact support.';
  }
}

/**
 * Payment domain errors
 */
export class PaymentError extends BaseError {
  constructor(message: string, code: ErrorCode, statusCode: HttpStatus, details?: unknown) {
    super(message, code, statusCode, true, details);
  }
}

export class PaymentFailedError extends PaymentError {
  constructor(reason: string, paymentMethodId?: string) {
    super(`Payment failed: ${reason}`, ErrorCode.PAYMENT_FAILED, HttpStatus.PAYMENT_REQUIRED, {
      reason,
      paymentMethodId,
    });
  }

  getUserMessage(): string {
    return 'Payment could not be processed. Please check your payment details and try again.';
  }
}

export class PaymentProcessingError extends PaymentError {
  constructor(paymentId: string, stage: string) {
    super(
      `Payment processing error at stage ${stage}`,
      ErrorCode.PAYMENT_PROCESSING,
      HttpStatus.UNPROCESSABLE_ENTITY,
      { paymentId, stage }
    );
  }

  getUserMessage(): string {
    return 'There was an issue processing your payment. Please wait a moment and try again.';
  }
}

export class InvalidPaymentMethodError extends PaymentError {
  constructor(method: string) {
    super(
      `Invalid payment method: ${method}`,
      ErrorCode.INVALID_PAYMENT_METHOD,
      HttpStatus.BAD_REQUEST,
      { method }
    );
  }

  getUserMessage(): string {
    return 'The selected payment method is not valid.';
  }
}

/**
 * Email domain errors
 */
export class EmailError extends BaseError {
  constructor(message: string, code: ErrorCode, statusCode: HttpStatus, details?: unknown) {
    super(message, code, statusCode, true, details);
  }
}

export class EmailSendFailedError extends EmailError {
  constructor(recipient: string, reason: string) {
    super(
      `Failed to send email to ${recipient}: ${reason}`,
      ErrorCode.EMAIL_SEND_FAILED,
      HttpStatus.SERVICE_UNAVAILABLE,
      { recipient, reason }
    );
  }

  getUserMessage(): string {
    return 'Unable to send email at this time. Please try again later.';
  }
}

export class EmailTemplateNotFoundError extends EmailError {
  constructor(templateId: string) {
    super(
      `Email template not found: ${templateId}`,
      ErrorCode.EMAIL_TEMPLATE_NOT_FOUND,
      HttpStatus.NOT_FOUND,
      { templateId }
    );
  }

  getUserMessage(): string {
    return 'Email configuration error. Please contact support.';
  }
}

/**
 * File upload errors
 */
export class FileUploadError extends BaseError {
  constructor(message: string, code: ErrorCode, statusCode: HttpStatus, details?: unknown) {
    super(message, code, statusCode, true, details);
  }
}

export class FileUploadFailedError extends FileUploadError {
  constructor(filename: string, reason: string) {
    super(
      `File upload failed for ${filename}: ${reason}`,
      ErrorCode.FILE_UPLOAD_FAILED,
      HttpStatus.BAD_REQUEST,
      { filename, reason }
    );
  }

  getUserMessage(): string {
    return 'File upload failed. Please try again with a different file.';
  }
}

export class FileTooLargeError extends FileUploadError {
  constructor(filename: string, size: number, maxSize: number) {
    super(
      `File ${filename} is too large: ${size} bytes (max: ${maxSize} bytes)`,
      ErrorCode.FILE_TOO_LARGE,
      HttpStatus.PAYLOAD_TOO_LARGE,
      { filename, size, maxSize }
    );
  }

  getUserMessage(): string {
    const maxSizeMB = Math.round((this.details as any).maxSize / 1024 / 1024);
    return `File is too large. Maximum allowed size is ${maxSizeMB}MB.`;
  }
}

export class InvalidFileTypeError extends FileUploadError {
  constructor(filename: string, mimeType: string, allowedTypes: string[]) {
    super(
      `Invalid file type for ${filename}: ${mimeType}`,
      ErrorCode.INVALID_FILE_TYPE,
      HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      { filename, mimeType, allowedTypes }
    );
  }

  getUserMessage(): string {
    const allowed = (this.details as any).allowedTypes.join(', ');
    return `Invalid file type. Allowed types: ${allowed}`;
  }
}

/**
 * Infrastructure errors
 */
export class DatabaseError extends BaseError {
  constructor(operation: string, error: unknown) {
    super(
      `Database operation failed: ${operation}`,
      ErrorCode.DATABASE_ERROR,
      HttpStatus.SERVICE_UNAVAILABLE,
      false,
      { operation, originalError: error }
    );
  }

  getUserMessage(): string {
    return 'A database error occurred. Please try again later.';
  }
}

export class CacheError extends BaseError {
  constructor(operation: string, key: string, error: unknown) {
    super(
      `Cache operation failed: ${operation} on key ${key}`,
      ErrorCode.CACHE_ERROR,
      HttpStatus.SERVICE_UNAVAILABLE,
      true,
      { operation, key, originalError: error }
    );
  }

  getUserMessage(): string {
    return 'A temporary issue occurred. Please try again.';
  }
}

export class ExternalServiceError extends BaseError {
  constructor(service: string, operation: string, error: unknown) {
    super(
      `External service error: ${service} - ${operation}`,
      ErrorCode.EXTERNAL_SERVICE_ERROR,
      HttpStatus.BAD_GATEWAY,
      true,
      { service, operation, originalError: error }
    );
  }

  getUserMessage(): string {
    return 'An external service is temporarily unavailable. Please try again later.';
  }
}
