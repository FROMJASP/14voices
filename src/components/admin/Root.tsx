'use client';

import React from 'react';
import SafeDynamicFavicon from './DynamicFavicon';
import { ErrorBoundary } from './ErrorBoundary';
import LastPassCleanup from './LastPassCleanup';
import AccountWrapper from './AccountWrapper';

const Root: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary>
      <SafeDynamicFavicon />
      <LastPassCleanup />
      <AccountWrapper />
      {children}
    </ErrorBoundary>
  );
};

export default Root;
