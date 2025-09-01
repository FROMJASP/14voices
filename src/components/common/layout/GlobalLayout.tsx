'use client';

import { Navigation } from '@/components/common/layout/header/navigation';
import { Footer } from './footer';
import { InfoNavbar, type InfoNavbarData } from '@/components/common/layout/header/info-navbar';
import { ClientFaviconUpdater } from '@/components/common/layout/ClientFaviconUpdater';
import type { LogoSettings } from '@/components/common/layout/header/logo';

interface GlobalLayoutProps {
  children: React.ReactNode;
  showInfoNavbar?: boolean;
  infoNavbarData?: InfoNavbarData;
  logoSettings?: LogoSettings;
}

export function GlobalLayout({
  children,
  showInfoNavbar = true,
  infoNavbarData,
  logoSettings,
}: GlobalLayoutProps) {
  return (
    <>
      {/* Client-side favicon updater with cache-busting */}
      <ClientFaviconUpdater />

      {/* Simple, clean layout with info navbar, navbar, content, and footer */}
      <div className="min-h-screen flex flex-col">
        {/* Info Navbar */}
        {showInfoNavbar && infoNavbarData && <InfoNavbar data={infoNavbarData} />}

        {/* Navigation */}
        <Navigation infoNavbarData={infoNavbarData} logoSettings={logoSettings} />

        {/* Main content area */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
