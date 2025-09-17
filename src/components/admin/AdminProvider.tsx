'use client';

import { ReactNode } from 'react';
import AccountWrapperSimple from './AccountWrapperSimple';
import UserDataPreloader from './UserDataPreloader';
import LocaleFieldSwapper from './LocaleFieldSwapper';

interface AdminProviderProps {
  children: ReactNode;
}

export default function AdminProvider({ children }: AdminProviderProps) {
  return (
    <>
      <UserDataPreloader />
      <AccountWrapperSimple />
      <LocaleFieldSwapper />
      {children}
    </>
  );
}
