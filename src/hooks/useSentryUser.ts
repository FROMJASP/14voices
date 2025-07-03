import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { User } from '@/payload-types';

/**
 * Hook to set user context in Sentry
 * Use this when user logs in or user data changes
 */
export function useSentryUser(user: User | null) {
  useEffect(() => {
    if (user) {
      Sentry.setUser({
        id: user.id,
        email: user.email,
        username: user.name,
      });
    } else {
      Sentry.setUser(null);
    }
  }, [user]);
}

/**
 * Track custom user actions
 */
export function trackUserAction(action: string, data?: Record<string, unknown>) {
  Sentry.addBreadcrumb({
    message: action,
    category: 'user-action',
    level: 'info',
    data,
  });
}
