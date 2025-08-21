'use client';

import React from 'react';
import SafeDynamicFavicon from './DynamicFavicon';
import { ErrorBoundary } from './ErrorBoundary';
import LastPassCleanup from './LastPassCleanup';
import AccountWrapper from './AccountWrapper';
import { ClientConfigProvider } from './ClientConfigProvider';
import { UploadHandlersProvider } from '@payloadcms/ui';

const Root: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary>
      <UploadHandlersProvider>
        <ClientConfigProvider>
          <SafeDynamicFavicon />
          <LastPassCleanup />
          <AccountWrapper />
          {children}
        </ClientConfigProvider>
      </UploadHandlersProvider>
    </ErrorBoundary>
  );
};

export default Root;
