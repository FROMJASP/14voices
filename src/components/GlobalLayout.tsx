import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { BannerBlock } from './BannerBlock';
import { ClientFaviconUpdater } from './ClientFaviconUpdater';

export interface BannerData {
  enabled: boolean;
  message: string;
  linkType: 'none' | 'custom' | 'page';
  linkUrl: string;
  dismissible: boolean;
  style: 'gradient' | 'solid' | 'subtle';
}

interface GlobalLayoutProps {
  children: React.ReactNode;
  showBanner?: boolean;
  bannerData?: BannerData;
}

export function GlobalLayout({ children, showBanner = true, bannerData }: GlobalLayoutProps) {
  const defaultBannerData: BannerData = {
    enabled: false,
    message: '',
    linkType: 'none',
    linkUrl: '',
    dismissible: true,
    style: 'gradient',
  };

  return (
    <>
      {/* Client-side favicon updater with cache-busting */}
      <ClientFaviconUpdater />

      {/* Simple, clean layout with navbar, optional banner, content, and footer */}
      <div className="min-h-screen flex flex-col">
        {/* Banner */}
        {showBanner && <BannerBlock banner={bannerData || defaultBannerData} />}

        {/* Navbar */}
        <Navbar />

        {/* Main content area */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}