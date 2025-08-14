export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageError';
  }
}

export class StorageQuotaError extends StorageError {
  constructor(message: string = 'Storage quota exceeded') {
    super(message);
    this.name = 'StorageQuotaError';
  }
}

export interface StorageErrorInfo {
  message: string;
  code: 'QUOTA_EXCEEDED' | 'STORAGE_ERROR' | 'UNKNOWN_ERROR';
  details?: any;
}

/**
 * Maps storage errors to user-friendly messages
 */
export function mapStorageError(error: any): StorageErrorInfo {
  if (error instanceof StorageQuotaError) {
    return {
      message: 'Opslaglimiet bereikt. Neem contact op met de beheerder.',
      code: 'QUOTA_EXCEEDED',
      details: {
        originalError: error.message,
      },
    };
  }

  if (error instanceof StorageError) {
    return {
      message: 'Er is een fout opgetreden bij het opslaan van het bestand. Probeer het opnieuw.',
      code: 'STORAGE_ERROR',
      details: {
        originalError: error.message,
      },
    };
  }

  // Check for quota/limit errors
  if (error.message?.includes('quota') || error.message?.includes('limit')) {
    return {
      message: 'Opslaglimiet bereikt. Neem contact op met de beheerder.',
      code: 'QUOTA_EXCEEDED',
      details: {
        originalError: error.message,
      },
    };
  }

  // Generic error
  return {
    message:
      'Er is een onverwachte fout opgetreden. Probeer het opnieuw of neem contact op met support.',
    code: 'UNKNOWN_ERROR',
    details: {
      originalError: error.message || String(error),
    },
  };
}

/**
 * Logs storage errors for monitoring
 */
export function logStorageError(
  error: any,
  context: { collection?: string; filename?: string; operation?: string }
) {
  const errorInfo = mapStorageError(error);

  console.error('[Storage Error]', {
    ...errorInfo,
    context,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
}

/**
 * Creates a user-friendly error response
 */
export function createStorageErrorResponse(error: any) {
  const errorInfo = mapStorageError(error);

  return {
    error: true,
    message: errorInfo.message,
    code: errorInfo.code,
    ...(process.env.NODE_ENV === 'development' && { details: errorInfo.details }),
  };
}
