'use client';

import { Navigation } from '@/components/common/layout/header/navigation';
import { Footer, ClientFaviconUpdater } from '@/components/common/layout';

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Client-side favicon updater with cache-busting */}
      <ClientFaviconUpdater />

      {/* Simple layout without banner for order pages */}
      <div className="min-h-screen flex flex-col">
        {/* Navigation */}
        <Navigation />

        {/* Main content area */}
        <main className="flex-1 bg-background">{children}</main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
