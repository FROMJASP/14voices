'use client';

import React, { useEffect } from 'react';
import { getClientServerUrl } from '@/lib/client-config';

export function ClientConfigProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Override fetch to use the correct base URL for relative paths
    if (typeof window !== 'undefined') {
      const originalFetch = window.fetch;
      const serverUrl = getClientServerUrl();

      window.fetch = async (input, init) => {
        if (typeof input === 'string' && input.startsWith('/api/')) {
          // Replace relative API paths with absolute URLs
          input = `${serverUrl}${input}`;
        }

        return originalFetch(input, init);
      };
    }
  }, []);

  return <>{children}</>;
}
