'use client';

import React, { useEffect } from 'react';
import { getClientServerUrl } from '@/lib/client-config';

export function ClientConfigProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Override fetch to use the correct base URL for relative paths
    if (typeof window !== 'undefined') {
      const originalFetch = window.fetch;
      const serverUrl = getClientServerUrl();

      // Create a wrapper function that preserves the original fetch properties
      const fetchWrapper = async (input: RequestInfo | URL, init?: RequestInit) => {
        if (typeof input === 'string' && input.startsWith('/api/')) {
          // Replace relative API paths with absolute URLs
          input = `${serverUrl}${input}`;
        }

        return originalFetch(input, init);
      };

      // Copy all properties from original fetch to maintain TypeScript compatibility
      Object.setPrototypeOf(fetchWrapper, originalFetch);
      Object.getOwnPropertyNames(originalFetch).forEach((prop) => {
        if (prop !== 'length' && prop !== 'name' && prop !== 'prototype') {
          try {
            (fetchWrapper as Record<string, unknown>)[prop] = (
              originalFetch as Record<string, unknown>
            )[prop];
          } catch {
            // Some properties might be read-only
          }
        }
      });

      window.fetch = fetchWrapper as typeof fetch;
    }
  }, []);

  return <>{children}</>;
}
