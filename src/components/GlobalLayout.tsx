import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { BannerBlock } from './BannerBlock';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

interface GlobalLayoutProps {
  children: React.ReactNode;
  showBanner?: boolean;
}

export async function GlobalLayout({ children, showBanner = true }: GlobalLayoutProps) {
  // Fetch banner settings from Payload
  const payload = await getPayload({ config: configPromise });
  
  let bannerData = {
    enabled: false,
    message: '',
    linkType: 'none' as const,
    linkUrl: '',
    dismissible: true,
    style: 'gradient' as const,
  };

  try {
    const siteSettings = await payload.findGlobal({
      slug: 'site-settings',
    });

    console.log('Site settings fetched:', { banner: siteSettings?.banner });

    if (siteSettings?.banner) {
      const { banner } = siteSettings;
      bannerData = {
        enabled: banner.enabled || false,
        message: banner.message || '',
        linkType: banner.linkType || 'none',
        linkUrl: banner.linkUrl || '',
        dismissible: banner.dismissible !== false,
        style: banner.style || 'gradient',
      };
      
      console.log('Banner data processed:', bannerData);

      // Handle page relationship for linkUrl
      if (banner.linkType === 'page' && banner.linkPage) {
        const pageId = typeof banner.linkPage === 'object' ? banner.linkPage.id : banner.linkPage;
        const page = await payload.findByID({
          collection: 'pages',
          id: pageId,
        });
        if (page) {
          bannerData.linkUrl = `/${page.slug}`;
        }
      }
    }
  } catch (error) {
    console.error('Failed to fetch site settings:', error);
  }

  return (
    <>
      {/* Simple, clean layout with navbar, optional banner, content, and footer */}
      <div className="min-h-screen flex flex-col">
        {/* Banner */}
        {showBanner && <BannerBlock banner={bannerData} />}

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
