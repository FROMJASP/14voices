'use client';

import { ReactNode } from 'react';
import AccountWrapper from './AccountWrapper';
import UserDataPreloader from './UserDataPreloader';

interface AdminProviderProps {
  children: ReactNode;
}

export default function AdminProvider({ children }: AdminProviderProps) {
  return (
    <>
      <UserDataPreloader />
      <AccountWrapper />
      {children}
    </>
  );
}
