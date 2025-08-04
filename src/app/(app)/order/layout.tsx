import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ClientFaviconUpdater } from '@/components/ClientFaviconUpdater';

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
