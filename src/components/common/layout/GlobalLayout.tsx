'use client';

import { Navigation } from '@/components/common/layout/header/navigation';
import { Footer } from './footer';
import {
  AnnouncementBar,
  type AnnouncementBarData,
} from '@/components/common/layout/header/announcement-bar';
import { ClientFaviconUpdater } from '@/components/common/layout/ClientFaviconUpdater';

interface GlobalLayoutProps {
  children: React.ReactNode;
  showBanner?: boolean;
  bannerData?: AnnouncementBarData;
}

export function GlobalLayout({ children, showBanner = true, bannerData }: GlobalLayoutProps) {
  return (
    <>
      {/* Client-side favicon updater with cache-busting */}
      <ClientFaviconUpdater />

      {/* Simple, clean layout with navbar, optional banner, content, and footer */}
      <div className="min-h-screen flex flex-col">
        {/* Banner */}
        {showBanner && bannerData && <AnnouncementBar data={bannerData} />}

        {/* Navigation */}
        <Navigation />

        {/* Main content area */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
