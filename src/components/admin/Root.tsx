'use client'

import React from 'react'
import SafeDynamicFavicon from './DynamicFavicon'
import { ErrorBoundary } from './ErrorBoundary'
import LastPassCleanup from './LastPassCleanup'

const Root: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary>
      <SafeDynamicFavicon />
      <LastPassCleanup />
      {children}
    </ErrorBoundary>
  )
}

export default Root