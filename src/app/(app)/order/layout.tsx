import { Navbar } from '@/components/layout';
import { Footer } from '@/components/layout';
import { ClientFaviconUpdater } from '@/components/providers';

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Client-side favicon updater with cache-busting */}
      <ClientFaviconUpdater />

      {/* Simple layout without banner for order pages */}
      <div className="min-h-screen flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Main content area */}
        <main className="flex-1 bg-background">{children}</main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
