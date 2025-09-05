'use client';

import React from 'react';
import SafeDynamicFavicon from './DynamicFavicon';
import { ErrorBoundary } from './ErrorBoundary';
import LastPassCleanup from './LastPassCleanup';
import AccountWrapperSimple from './AccountWrapperSimple';
import { ClientConfigProvider } from './ClientConfigProvider';
import NavIconsCSS from './NavIconsCSS';

const Root: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary>
      <ClientConfigProvider>
        <SafeDynamicFavicon />
        <LastPassCleanup />
        <AccountWrapperSimple />
        <NavIconsCSS />
        {children}
      </ClientConfigProvider>
    </ErrorBoundary>
  );
};

export default Root;
