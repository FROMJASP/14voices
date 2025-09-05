'use client';

import React from 'react';
import { VariantProvider } from '../fields/VariantProvider';

/**
 * Wrapper component for the Pages edit view that provides variant context
 * This ensures all fields have access to the current variant selections
 */
export const PagesEditWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <VariantProvider>
      {children}
    </VariantProvider>
  );
};