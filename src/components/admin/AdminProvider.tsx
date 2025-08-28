'use client';

import { ReactNode } from 'react';
import AccountWrapper from './AccountWrapper';

interface AdminProviderProps {
  children: ReactNode;
}

export default function AdminProvider({ children }: AdminProviderProps) {
  return (
    <>
      <AccountWrapper />
      {children}
    </>
  );
}
