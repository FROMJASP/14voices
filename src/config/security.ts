/**
 * Security configuration for 14voices application
 * Centralizes all security-related settings and policies
 */

export const securityConfig = {
  // Rate limiting configurations per endpoint
  rateLimits: {
    // Public endpoints
    public: {
      windowMs: 60000, // 1 minute
      max: 60, // requests per window
    },
    // Form submissions
    forms: {
      windowMs: 60000,
      max: 10,
    },
    // Authentication endpoints
    auth: {
      windowMs: 900000, // 15 minutes
      max: 5,
    },
    // Email sending
    email: {
      windowMs: 300000, // 5 minutes
      max: 10,
    },
    // Admin operations
    admin: {
      windowMs: 3600000, // 1 hour
      max: 100,
    },
    // Webhooks (high volume)
    webhooks: {
      windowMs: 60000,
      max: 1000,
    },
  },

  // Content Security Policy
  csp: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://cdn.jsdelivr.net'],
    'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'img-src': ["'self'", 'data:', 'https:', 'blob:'],
    'connect-src': [
      "'self'",
      'https://api.resend.com',
      'https://*.ingest.sentry.io',
      'https://*.ingest.de.sentry.io',
      'wss:',
    ],
    'worker-src': ["'self'", 'blob:'],
    'frame-ancestors': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
  },

  // CORS configuration
  cors: {
    allowedOrigins: [
      process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
      'https://14voices.com',
      'https://www.14voices.com',
    ],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400, // 24 hours
  },

  // Input validation limits
  validation: {
    maxStringLength: 10000,
    maxArrayLength: 1000,
    maxObjectDepth: 10,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
  },

  // Session configuration
  session: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // 1 day
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    httpOnly: true,
  },

  // Password requirements
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
    maxLoginAttempts: 5,
    lockoutDuration: 900000, // 15 minutes
  },

  // API key configuration
  apiKeys: {
    minLength: 32,
    expirationDays: 90,
    rotationWarningDays: 7,
  },

  // Webhook security
  webhooks: {
    signatureHeader: 'x-webhook-signature',
    toleranceSeconds: 300, // 5 minutes
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },

  // Monitoring and logging
  monitoring: {
    logFailedAuth: true,
    logAdminAccess: true,
    logSuspiciousActivity: true,
    alertThreshold: 10, // failed attempts before alert
  },

  // Blocked patterns
  blockedPatterns: {
    userAgents: [/bot/i, /crawler/i, /spider/i, /scraper/i],
    paths: [
      '/.env',
      '/.git',
      '/wp-admin',
      '/wp-login',
      '/.well-known/security.txt',
      '/config',
      '/phpinfo',
      '/.htaccess',
      '/web.config',
    ],
    queryParams: [
      'UNION',
      'SELECT',
      'INSERT',
      'UPDATE',
      'DELETE',
      'DROP',
      '<script',
      'javascript:',
      'onerror=',
      'onload=',
    ],
  },
};

/**
 * Get rate limit configuration for a specific endpoint type
 */
export function getRateLimitConfig(type: keyof typeof securityConfig.rateLimits) {
  return securityConfig.rateLimits[type] || securityConfig.rateLimits.public;
}

/**
 * Build Content Security Policy header string
 */
export function buildCSPHeader(): string {
  return Object.entries(securityConfig.csp)
    .map(([directive, values]) => `${directive} ${values.join(' ')}`)
    .join('; ');
}

/**
 * Check if a path is blocked
 */
export function isBlockedPath(path: string): boolean {
  return securityConfig.blockedPatterns.paths.some((pattern) =>
    path.toLowerCase().includes(pattern.toLowerCase())
  );
}

/**
 * Check if a user agent is blocked
 */
export function isBlockedUserAgent(userAgent: string): boolean {
  return securityConfig.blockedPatterns.userAgents.some((pattern) => pattern.test(userAgent));
}

/**
 * Sanitize user input by removing potentially dangerous patterns
 */
export function sanitizeInput(input: string): string {
  let sanitized = input;

  // Remove SQL injection patterns
  securityConfig.blockedPatterns.queryParams.forEach((pattern) => {
    const regex = new RegExp(pattern, 'gi');
    sanitized = sanitized.replace(regex, '');
  });

  // Limit length
  sanitized = sanitized.slice(0, securityConfig.validation.maxStringLength);

  return sanitized.trim();
}
