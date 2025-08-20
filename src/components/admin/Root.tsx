'use client';

import React from 'react';
import SafeDynamicFavicon from './DynamicFavicon';
import { ErrorBoundary } from './ErrorBoundary';
import LastPassCleanup from './LastPassCleanup';
import AccountWrapper from './AccountWrapper';
import { ClientConfigProvider } from './ClientConfigProvider';

const Root: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary>
      <ClientConfigProvider>
        <SafeDynamicFavicon />
        <LastPassCleanup />
        <AccountWrapper />
        {children}
      </ClientConfigProvider>
    </ErrorBoundary>
  );
};

export default Root;
