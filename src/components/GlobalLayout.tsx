import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { BannerBlock } from './BannerBlock';

interface GlobalLayoutProps {
  children: React.ReactNode;
  showBanner?: boolean;
}

export async function GlobalLayout({ children, showBanner = true }: GlobalLayoutProps) {
  // Simple static banner block data
  const bannerData = {
    banner: {
      enabled: true,
      message: '🚀 **14 Nieuwe Stemmen**. Beluister hier wat ze voor jou kunnen betekenen!',
      linkType: 'custom' as const,
      linkUrl: '/voiceovers',
      dismissible: true,
    },
  };

  return (
    <>
      {/* Simple, clean layout with navbar, optional banner, content, and footer */}
      <div className="min-h-screen flex flex-col">
        {/* Banner */}
        {showBanner && <BannerBlock banner={bannerData.banner} />}

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
