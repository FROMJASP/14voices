import { getPayload } from '@/utilities/payload';

export interface SecurityEvent {
  type:
    | 'auth_failure'
    | 'suspicious_activity'
    | 'rate_limit_exceeded'
    | 'invalid_input'
    | 'file_threat';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  path?: string;
  method?: string;
  details: Record<string, unknown>;
  timestamp: Date;
}

/**
 * Log security events for monitoring and alerting
 */
export async function logSecurityEvent(event: SecurityEvent): Promise<void> {
  try {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[SECURITY EVENT]', JSON.stringify(event, null, 2));
    }

    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Send to Sentry
      if (process.env.SENTRY_DSN) {
        const Sentry = await import('@sentry/nextjs');
        Sentry.captureMessage(`Security Event: ${event.type}`, {
          level: event.severity === 'critical' ? 'error' : 'warning',
          tags: {
            security_event: event.type,
            severity: event.severity,
          },
          extra: { ...event },
        });
      }

      // Store in database for audit trail
      const payload = await getPayload();
      await payload
        .create({
          collection: 'security-logs',
          data: {
            ...event,
            timestamp: event.timestamp.toISOString(),
          },
        })
        .catch((err) => {
          console.error('Failed to store security event:', err);
        });
    }

    // Alert on critical events
    if (event.severity === 'critical') {
      await sendSecurityAlert(event);
    }
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}

/**
 * Send immediate alerts for critical security events
 */
async function sendSecurityAlert(event: SecurityEvent): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.error('Cannot send security alert: RESEND_API_KEY not configured');
    return;
  }

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'security@14voices.com',
      to: process.env.SECURITY_ALERT_EMAIL || 'admin@14voices.com',
      subject: `[CRITICAL] Security Alert: ${event.type}`,
      html: `
        <h2>Critical Security Event Detected</h2>
        <p><strong>Type:</strong> ${event.type}</p>
        <p><strong>Time:</strong> ${event.timestamp.toISOString()}</p>
        <p><strong>IP Address:</strong> ${event.ipAddress || 'Unknown'}</p>
        <p><strong>User ID:</strong> ${event.userId || 'Anonymous'}</p>
        <p><strong>Path:</strong> ${event.path || 'N/A'}</p>
        <h3>Details:</h3>
        <pre>${JSON.stringify(event.details, null, 2)}</pre>
      `,
    });
  } catch (error) {
    console.error('Failed to send security alert:', error);
  }
}

/**
 * Monitor authentication failures
 */
const authFailures = new Map<string, { count: number; lastAttempt: Date }>();

export function trackAuthFailure(identifier: string): void {
  const failures = authFailures.get(identifier) || { count: 0, lastAttempt: new Date() };
  failures.count++;
  failures.lastAttempt = new Date();
  authFailures.set(identifier, failures);

  // Alert on suspicious activity
  if (failures.count >= 5) {
    logSecurityEvent({
      type: 'auth_failure',
      severity: failures.count >= 10 ? 'high' : 'medium',
      ipAddress: identifier,
      details: {
        attemptCount: failures.count,
        message: 'Multiple failed authentication attempts',
      },
      timestamp: new Date(),
    });
  }

  // Clean up old entries periodically
  if (Math.random() < 0.01) {
    // 1% chance
    const oneHourAgo = new Date(Date.now() - 3600000);
    for (const [key, value] of authFailures.entries()) {
      if (value.lastAttempt < oneHourAgo) {
        authFailures.delete(key);
      }
    }
  }
}
