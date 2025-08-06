'use client';

import { AnnouncementBar } from './announcement-bar';
import { Navigation } from './navigation';
import type { AnnouncementBarData } from './announcement-bar';
import type { MenuItem } from './navigation';

interface HeaderProps {
  announcementBar?: AnnouncementBarData;
  navigationItems?: MenuItem[];
  className?: string;
}

export function Header({ announcementBar, navigationItems, className = '' }: HeaderProps) {
  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] ${className}`}>
      {announcementBar && <AnnouncementBar data={announcementBar} />}
      <Navigation menuItems={navigationItems} />
    </header>
  );
}
