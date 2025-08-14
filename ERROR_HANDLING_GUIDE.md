# Error Handling System Guide

This document describes the comprehensive error handling system implemented in the 14voices codebase.

## Overview

The error handling system provides:
- Centralized error classes with proper inheritance
- Domain-specific error types
- Consistent API error responses
- Enhanced error logging and monitoring
- React error boundaries
- Sentry integration for production error tracking
- Error aggregation and reporting

## Error Class Hierarchy

### Base Error Class (`/src/lib/errors/base.ts`)

All errors extend from `BaseError`:

```typescript
class BaseError extends Error {
  code: string;              // Error code (e.g., 'VOICEOVER_NOT_FOUND')
  statusCode: number;        // HTTP status code
  isOperational: boolean;    // true for expected errors, false for bugs
  details?: unknown;         // Additional error context
  timestamp: Date;           // When the error occurred
}
```

### Domain-Specific Errors (`/src/lib/errors/domain-errors.ts`)

#### Voiceover Errors
- `VoiceoverNotFoundError` - When a voiceover doesn't exist
- `VoiceoverUnavailableError` - When a voiceover can't be booked

#### Booking Errors
- `BookingNotFoundError` - When a booking doesn't exist
- `BookingAlreadyExistsError` - Duplicate booking attempt
- `BookingFailedError` - General booking failure

#### Payment Errors
- `PaymentFailedError` - Payment processing failed
- `PaymentProcessingError` - Error during payment flow
- `InvalidPaymentMethodError` - Invalid payment method

#### Email Errors
- `EmailSendFailedError` - Email delivery failed
- `EmailTemplateNotFoundError` - Missing email template

#### File Upload Errors
- `FileUploadFailedError` - Upload operation failed
- `FileTooLargeError` - File exceeds size limit
- `InvalidFileTypeError` - Unsupported file type

#### Infrastructure Errors
- `DatabaseError` - Database operation failed
- `CacheError` - Cache operation failed
- `ExternalServiceError` - Third-party service error

### API Errors (`/src/lib/errors/api-errors.ts`)

- `ValidationError` - Invalid input data
- `UnauthorizedError` - Authentication required
- `ForbiddenError` - Insufficient permissions
- `NotFoundError` - Resource not found
- `RateLimitError` - Too many requests
- `ServiceUnavailableError` - Service temporarily down

## Usage Examples

### In Domain Services

```typescript
import { 
  ValidationError, 
  BookingNotFoundError,
  DatabaseError,
  logger 
} from '@/lib/errors';

class BookingService {
  async getBooking(bookingId: string): Promise<Booking> {
    if (!bookingId) {
      throw new ValidationError('Booking ID is required');
    }

    try {
      logger.debug(`Fetching booking: ${bookingId}`, {
        action: 'get_booking',
        metadata: { bookingId }
      });

      const booking = await this.repository.findById(bookingId);
      
      if (!booking) {
        throw new BookingNotFoundError(bookingId);
      }

      return booking;
    } catch (error) {
      // Re-throw known errors
      if (error instanceof BookingNotFoundError) {
        throw error;
      }

      // Log and wrap unknown errors
      logger.error(`Failed to fetch booking`, error);
      throw new DatabaseError('getBooking', error);
    }
  }
}
```

### In API Routes

```typescript
import { createErrorHandlingApiHandler } from '@/lib/api/error-handler';
import { ValidationError } from '@/lib/errors';

export const GET = createErrorHandlingApiHandler(
  async (req, context) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      throw new ValidationError('ID parameter is required');
    }

    // Your logic here
    return { data: result };
  },
  {
    requireAuth: true,
    rateLimit: { requests: 60, window: 60 }
  }
);
```

### In React Components

```tsx
import { ErrorBoundary } from '@/components/common/error-boundary';

export default function Page() {
  return (
    <ErrorBoundary level="page">
      <YourComponent />
    </ErrorBoundary>
  );
}

// Or use HOC
import { withErrorBoundary } from '@/components/common/error-boundary';

const SafeComponent = withErrorBoundary(YourComponent, {
  level: 'component',
  fallback: <div>Something went wrong</div>
});
```

## Error Logging

### Logger Usage

```typescript
import { logger } from '@/lib/errors/logger';

// Different log levels
logger.debug('Debug message', { metadata: data });
logger.info('Info message', { userId, action: 'user_login' });
logger.warn('Warning message', { threshold: exceeded });
logger.error('Error message', error, { context });
logger.fatal('Fatal error', error, { systemState });

// Performance logging decorator
class Service {
  @logPerformance
  async slowOperation() {
    // Automatically logs execution time
  }
}
```

## Error Monitoring

### Sentry Integration

Errors are automatically sent to Sentry in production with:
- Error context and metadata
- User information (if available)
- Breadcrumbs for debugging
- Custom tags and extra data

### Enhanced Monitoring

```typescript
import { errorMonitoring } from '@/lib/errors/monitoring';

// Capture error with context
errorMonitoring.captureError(error, {
  tags: { feature: 'booking', severity: 'high' },
  extra: { bookingId, userId },
  request: { method: 'POST', url: '/api/bookings' }
});

// Set user context
errorMonitoring.setUserContext({
  id: user.id,
  email: user.email
});

// Add breadcrumbs
errorMonitoring.addBreadcrumb({
  message: 'User clicked checkout',
  category: 'user-action',
  level: 'info'
});
```

## Error Aggregation & Reporting

### Track Error Patterns

```typescript
import { ErrorAggregator } from '@/lib/errors/aggregation';

// Get error statistics
const stats = await ErrorAggregator.getErrorStats(
  new Date('2025-01-01'),
  new Date('2025-01-31')
);

// Get error trends
const trend = await ErrorAggregator.getErrorTrends('DATABASE_ERROR', 24);

// Generate reports
const report = await ErrorAggregator.generateErrorReport('weekly');
```

## API Error Responses

All API errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input provided",
    "statusCode": 400,
    "timestamp": "2025-01-14T12:00:00Z",
    "requestId": "uuid-here",
    "validationErrors": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

## Best Practices

1. **Use Domain-Specific Errors**: Create specific error classes for your domain
2. **Provide Context**: Always include relevant details in error messages
3. **Log at Appropriate Levels**: Use debug/info for expected flows, warn/error for issues
4. **Handle Errors Gracefully**: Catch and handle errors at appropriate levels
5. **User-Friendly Messages**: Override `getUserMessage()` for customer-facing errors
6. **Monitor Critical Paths**: Add extra monitoring for payment, auth, and data operations
7. **Test Error Scenarios**: Include error cases in your tests

## Configuration

### Environment Variables

```env
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
SENTRY_AUTH_TOKEN=your-auth-token
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project

# Error Handling
NODE_ENV=production
NEXT_PUBLIC_APP_ENV=production
```

### Security Considerations

- Sensitive data is automatically redacted from logs
- Stack traces are only shown in development
- Error details are sanitized before sending to Sentry
- User-facing error messages don't expose internal details

## Migration Guide

To migrate existing error handling:

1. Replace generic `throw new Error()` with specific error classes
2. Add try-catch blocks with proper error logging
3. Update API routes to use `createErrorHandlingApiHandler`
4. Wrap React components with ErrorBoundary
5. Add logging to critical operations
6. Test error scenarios thoroughly

## Support

For questions or issues with the error handling system, check:
- Error logs in development console
- Sentry dashboard for production errors
- Error aggregation reports for patterns
- This guide for best practices