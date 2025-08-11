'use client';

import { InfoNavbar } from './info-navbar';
import { Navigation } from './navigation';
import type { InfoNavbarProps } from './info-navbar';
import type { NavigationProps } from './navigation';

interface HeaderProps {
  infoNavbar?: InfoNavbarProps['data'];
  navigation?: NavigationProps;
  className?: string;
}

export function Header({ infoNavbar, navigation, className = '' }: HeaderProps) {
  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] ${className}`}>
      {infoNavbar && <InfoNavbar data={infoNavbar} />}
      <Navigation {...navigation} infoNavbarData={infoNavbar} />
    </header>
  );
}
