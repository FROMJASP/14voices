import { GlobalLayout } from '@/components/common/layout';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import globalCache from '@/lib/cache';
import type { InfoNavbarData } from '@/components/common/layout/header/info-navbar';

async function getInfoNavbarData(): Promise<InfoNavbarData> {
  const cacheKey = 'site-settings:info-navbar';
  const cacheTTL = 1000 * 60 * 30; // 30 minutes cache

  return await globalCache.wrap(
    cacheKey,
    async () => {
      const defaultInfoNavbarData: InfoNavbarData = {
        enabled: true,
        whatsappNumber: '+31 6 12345678',
        email: 'casting@14voices.com',
        quickLinks: [
          { label: 'Veelgestelde vragen', url: '/veelgestelde-vragen' },
          { label: 'Blog', url: '/blog' },
        ],
      };

      try {
        const payload = await getPayload({ config: configPromise });
        const siteSettings = await payload.findGlobal({
          slug: 'site-settings',
        });

        // @ts-expect-error - infoNavbar types will be available after schema regeneration
        if (siteSettings?.infoNavbar) {
          // @ts-expect-error - infoNavbar types will be available after schema regeneration
          const { infoNavbar } = siteSettings;
          return {
            enabled: infoNavbar.enabled !== false,
            whatsappNumber: infoNavbar.whatsappNumber || defaultInfoNavbarData.whatsappNumber,
            email: infoNavbar.email || defaultInfoNavbarData.email,
            quickLinks: infoNavbar.quickLinks || defaultInfoNavbarData.quickLinks,
          };
        }
      } catch (error) {
        console.error('Failed to fetch site settings:', error);
      }

      return defaultInfoNavbarData;
    },
    cacheTTL
  );
}

export default async function WithGlobalLayout({ children }: { children: React.ReactNode }) {
  const infoNavbarData = await getInfoNavbarData();

  return <GlobalLayout infoNavbarData={infoNavbarData}>{children}</GlobalLayout>;
}
