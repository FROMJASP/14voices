import { GlobalLayout } from '@/components/common/layout';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import globalCache from '@/lib/cache';
import type { AnnouncementBarData } from '@/components/common/layout/header/announcement-bar';

async function getBannerData(): Promise<AnnouncementBarData> {
  const cacheKey = 'site-settings:banner';
  const cacheTTL = 1000 * 60 * 30; // 30 minutes cache

  return await globalCache.wrap(
    cacheKey,
    async () => {
      const defaultBannerData: AnnouncementBarData = {
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

        if (siteSettings?.banner) {
          const { banner } = siteSettings;
          const bannerData: AnnouncementBarData = {
            enabled: banner.enabled || false,
            message: banner.message || '',
            linkType: banner.linkType || 'none',
            linkUrl: banner.linkUrl || '',
            dismissible: banner.dismissible !== false,
            style: banner.style || 'gradient',
          };

          // Handle page relationship for linkUrl
          if (banner.linkType === 'page' && banner.linkPage) {
            const pageId =
              typeof banner.linkPage === 'object' ? banner.linkPage.id : banner.linkPage;
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
    },
    cacheTTL
  );
}

export default async function WithGlobalLayout({ children }: { children: React.ReactNode }) {
  const bannerData = await getBannerData();

  return <GlobalLayout bannerData={bannerData}>{children}</GlobalLayout>;
}
