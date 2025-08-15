/**
 * Security event logger
 * Logs security events to the SecurityLogs collection
 */

import { getPayload } from 'payload';
import configPromise from '@payload-config';

export type SecurityEventType =
  | 'auth_failure'
  | 'suspicious_activity'
  | 'rate_limit_exceeded'
  | 'invalid_input'
  | 'file_threat';

export type SecuritySeverity = 'low' | 'medium' | 'high' | 'critical';

interface SecurityEventData {
  type: SecurityEventType;
  severity: SecuritySeverity;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  path?: string;
  method?: string;
  details?: Record<string, unknown>;
}

/**
 * Log a security event to the database
 */
export async function logSecurityEvent(event: SecurityEventData): Promise<void> {
  try {
    const payload = await getPayload({ config: configPromise });

    await payload.create({
      collection: 'security-logs',
      data: {
        ...event,
        timestamp: new Date().toISOString(),
        resolved: false,
      },
    });
  } catch (error) {
    // Log to console as fallback
    console.error('[SECURITY_EVENT]', {
      ...event,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Log failed authentication attempt
 */
export async function logAuthFailure(
  email: string,
  ipAddress: string,
  userAgent?: string
): Promise<void> {
  await logSecurityEvent({
    type: 'auth_failure',
    severity: 'medium',
    ipAddress,
    userAgent,
    details: {
      email,
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Log rate limit exceeded
 */
export async function logRateLimitExceeded(
  identifier: string,
  endpoint: string,
  ipAddress?: string
): Promise<void> {
  await logSecurityEvent({
    type: 'rate_limit_exceeded',
    severity: 'low',
    ipAddress,
    path: endpoint,
    details: {
      identifier,
      endpoint,
    },
  });
}

/**
 * Log suspicious activity
 */
export async function logSuspiciousActivity(
  description: string,
  severity: SecuritySeverity,
  request?: {
    path?: string;
    method?: string;
    ipAddress?: string;
    userAgent?: string;
    userId?: string;
  },
  additionalDetails?: Record<string, unknown>
): Promise<void> {
  await logSecurityEvent({
    type: 'suspicious_activity',
    severity,
    userId: request?.userId,
    ipAddress: request?.ipAddress,
    userAgent: request?.userAgent,
    path: request?.path,
    method: request?.method,
    details: {
      description,
      ...additionalDetails,
    },
  });
}

/**
 * Log file threat detection
 */
export async function logFileThreat(
  filename: string,
  threats: string[],
  severity: SecuritySeverity,
  userId?: string,
  ipAddress?: string
): Promise<void> {
  await logSecurityEvent({
    type: 'file_threat',
    severity,
    userId,
    ipAddress,
    details: {
      filename,
      threats,
      blockedAt: new Date().toISOString(),
    },
  });
}

/**
 * Log invalid input attempt
 */
export async function logInvalidInput(
  inputType: string,
  value: string,
  path?: string,
  ipAddress?: string,
  userId?: string
): Promise<void> {
  await logSecurityEvent({
    type: 'invalid_input',
    severity: 'low',
    userId,
    ipAddress,
    path,
    details: {
      inputType,
      value: value.substring(0, 100), // Truncate for security
      detectedPatterns: detectSuspiciousPatterns(value),
    },
  });
}

/**
 * Detect suspicious patterns in input
 */
function detectSuspiciousPatterns(input: string): string[] {
  const patterns: string[] = [];

  if (/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION)\b.*\b(FROM|INTO|WHERE)\b)/i.test(input)) {
    patterns.push('SQL Injection');
  }

  if (/<script[\s\S]*?>[\s\S]*?<\/script>/gi.test(input)) {
    patterns.push('XSS Script Tag');
  }

  if (/javascript:/gi.test(input)) {
    patterns.push('JavaScript Protocol');
  }

  if (/on\w+\s*=/gi.test(input)) {
    patterns.push('Event Handler');
  }

  if (/\.\.[\/\\]/g.test(input)) {
    patterns.push('Path Traversal');
  }

  return patterns;
}
