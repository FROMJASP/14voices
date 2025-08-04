import { GlobalLayout, type BannerData } from '@/components/GlobalLayout';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

async function getBannerData(): Promise<BannerData> {
  const defaultBannerData: BannerData = {
    enabled: false,
    message: '',
    linkType: 'none',
    linkUrl: '',
    dismissible: true,
    style: 'gradient',
  };

  try {
    const payload = await getPayload({ config: configPromise });
    const siteSettings = await payload.findGlobal({
      slug: 'site-settings',
    });

    console.log('Site settings fetched:', { banner: siteSettings?.banner });

    if (siteSettings?.banner) {
      const { banner } = siteSettings;
      const bannerData: BannerData = {
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

      return bannerData;
    }
  } catch (error) {
    console.error('Failed to fetch site settings:', error);
  }

  return defaultBannerData;
}

export default async function WithGlobalLayout({ children }: { children: React.ReactNode }) {
  const bannerData = await getBannerData();
  
  return (
    <GlobalLayout bannerData={bannerData}>
      {children}
    </GlobalLayout>
  );
}