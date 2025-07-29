import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ClientFaviconUpdater } from '@/components/ClientFaviconUpdater';
import { VoiceoverProvider } from '@/contexts/VoiceoverContext';

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
        <main className="flex-1">
          <VoiceoverProvider>{children}</VoiceoverProvider>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
