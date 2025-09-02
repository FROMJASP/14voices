'use client';

import { useEffect } from 'react';
import { useAuth } from '@payloadcms/ui';

export default function UserDataPreloader() {
  const { refreshCookie } = useAuth();

  useEffect(() => {
    // Force refresh auth cookie with proper depth on mount
    // This ensures avatar relationship is populated
    const refreshAuth = async () => {
      try {
        await refreshCookie();
      } catch (error) {
        console.debug('UserDataPreloader: Could not refresh auth', error);
      }
    };

    refreshAuth();
  }, [refreshCookie]);

  return null;
}
