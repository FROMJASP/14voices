import { GlobalLayout } from '@/components/common/layout';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import globalCache from '@/lib/cache';
import type { InfoNavbarData } from '@/components/common/layout/header/info-navbar';

async function getInfoNavbarData(): Promise<InfoNavbarData> {
  const cacheKey = 'site-settings:top-bar';
  const cacheTTL = 1000 * 60 * 30; // 30 minutes cache

  const defaultInfoNavbarData: InfoNavbarData = {
    enabled: true,
    whatsappNumber: '+31 6 12345678',
    email: 'casting@14voices.com',
    quickLinks: [
      { label: 'Veelgestelde vragen', url: '/#faq' },
      { label: 'Blog', url: '/blog' },
    ],
    whatsappTooltip: {
      enabled: true,
      title: 'Stuur ons een WhatsApp',
      message:
        'We zijn vaak in de studio aan het werk. Stuur ons eerst een WhatsApp-bericht, dan kunnen we je zo snel mogelijk terugbellen.',
    },
  };

  // During build time with fake database URL, return defaults
  if (process.env.DATABASE_URL?.includes('fake:fake@fake')) {
    return defaultInfoNavbarData;
  }

  return await globalCache.wrap(
    cacheKey,
    async () => {
      try {
        const payload = await getPayload({ config: configPromise });
        const siteSettings = await payload.findGlobal({
          slug: 'site-settings',
        });

        // @ts-expect-error - topBar types will be available after schema regeneration
        if (siteSettings?.topBar) {
          // @ts-expect-error - topBar types will be available after schema regeneration
          const { topBar } = siteSettings;

          // Build the whatsappTooltip data
          let whatsappTooltip: InfoNavbarData['whatsappTooltip'] = undefined;
          if (topBar.whatsappTooltip) {
            whatsappTooltip = {
              enabled: topBar.whatsappTooltip.enabled !== false,
              title: topBar.whatsappTooltip.title || defaultInfoNavbarData.whatsappTooltip?.title,
              message:
                topBar.whatsappTooltip.message || defaultInfoNavbarData.whatsappTooltip?.message,
            };

            // Handle image - can be either a Media object with ID or an object with url
            if (topBar.whatsappTooltip.image) {
              if (
                typeof topBar.whatsappTooltip.image === 'number' ||
                topBar.whatsappTooltip.image.id
              ) {
                // It's a Payload media reference
                whatsappTooltip.image = topBar.whatsappTooltip.image;
              } else if (topBar.whatsappTooltip.image.url) {
                // It's already resolved with url
                whatsappTooltip.image = {
                  url: topBar.whatsappTooltip.image.url,
                  alt: topBar.whatsappTooltip.image.alt || '',
                };
              }
            }
          }

          const result = {
            enabled: topBar.enabled !== false,
            whatsappNumber: topBar.whatsappNumber || defaultInfoNavbarData.whatsappNumber,
            email: topBar.email || defaultInfoNavbarData.email,
            quickLinks:
              topBar.quickLinks && topBar.quickLinks.length > 0
                ? topBar.quickLinks
                : defaultInfoNavbarData.quickLinks,
            whatsappTooltip: whatsappTooltip || defaultInfoNavbarData.whatsappTooltip,
          };

          return result;
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
