// Application-wide constants

export const APP_NAME = '14voices';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://14voices.com';

// Email configuration
export const EMAIL_FROM_DEFAULT = 'noreply@14voices.com';
export const EMAIL_FROM_NAME = '14voices';
export const EMAIL_REPLY_TO = 'support@14voices.com';

// API configuration
export const API_RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
};

// File upload limits
export const UPLOAD_LIMITS = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: {
    audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
    document: ['application/pdf', 'application/msword', 'text/plain'],
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
};

// Pagination defaults
export const PAGINATION = {
  defaultLimit: 20,
  maxLimit: 100,
};

// Cache TTL (in seconds)
export const CACHE_TTL = {
  short: 900, // 15 minutes
  medium: 1800, // 30 minutes
  long: 3600, // 1 hour
  day: 86400, // 24 hours
};

// Feature flags
export const FEATURES = {
  emailMarketing: true,
  advancedAnalytics: true,
  maintenanceMode: false,
};
