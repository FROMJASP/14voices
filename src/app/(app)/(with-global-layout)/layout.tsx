import { GlobalLayout } from '@/components/common/layout';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import globalCache from '@/lib/cache';
import type { InfoNavbarData } from '@/components/common/layout/header/info-navbar';
import type { LogoSettings } from '@/components/common/layout/header/logo';

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

        if (siteSettings?.topBar) {
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
              if (typeof topBar.whatsappTooltip.image === 'number') {
                // It's a Payload media reference ID
                whatsappTooltip.image = topBar.whatsappTooltip.image;
              } else if (topBar.whatsappTooltip.image.url) {
                // It's already resolved with url
                whatsappTooltip.image = {
                  url:
                    topBar.whatsappTooltip.image.url === null
                      ? undefined
                      : topBar.whatsappTooltip.image.url,
                  alt: topBar.whatsappTooltip.image.alt || '',
                };
              }
            }
          }

          const result: InfoNavbarData = {
            enabled: topBar.enabled !== false,
            whatsappNumber: topBar.whatsappNumber || defaultInfoNavbarData.whatsappNumber,
            email: topBar.email || defaultInfoNavbarData.email,
            quickLinks:
              topBar.quickLinks && topBar.quickLinks.length > 0
                ? topBar.quickLinks.map((link: any) => ({
                    label: link.label,
                    url: link.url,
                    openInNewTab: link.openInNewTab === null ? undefined : link.openInNewTab,
                  }))
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

async function getLogoSettings(): Promise<LogoSettings> {
  const cacheKey = 'site-settings:logo';
  const cacheTTL = 1000 * 60 * 30; // 30 minutes cache

  const defaultLogoSettings: LogoSettings = {
    logoType: 'text',
    logoText: 'FourteenVoices',
    logoFont: 'instrument-serif',
  };

  // During build time with fake database URL, return defaults
  if (process.env.DATABASE_URL?.includes('fake:fake@fake')) {
    return defaultLogoSettings;
  }

  return await globalCache.wrap(
    cacheKey,
    async () => {
      try {
        const payload = await getPayload({ config: configPromise });
        const siteSettings = await payload.findGlobal({
          slug: 'site-settings',
        });

        if (siteSettings?.branding) {
          const { branding } = siteSettings;

          const result: LogoSettings = {
            logoType: branding.logoType || defaultLogoSettings.logoType,
            logoText: branding.logoText || defaultLogoSettings.logoText,
            logoFont: defaultLogoSettings.logoFont, // logoFont not available in current schema
          };

          // Handle logoImage
          if (branding.logoImage) {
            if (typeof branding.logoImage !== 'number' && branding.logoImage.url) {
              result.logoImage = {
                url: branding.logoImage.url === null ? undefined : branding.logoImage.url,
                alt: branding.logoImage.alt || '',
                width: branding.logoImage.width === null ? undefined : branding.logoImage.width,
                height: branding.logoImage.height === null ? undefined : branding.logoImage.height,
              };
            }
          }

          // Handle logoImageDark
          if (branding.logoImageDark) {
            if (typeof branding.logoImageDark !== 'number' && branding.logoImageDark.url) {
              result.logoImageDark = {
                url: branding.logoImageDark.url === null ? undefined : branding.logoImageDark.url,
                alt: branding.logoImageDark.alt || '',
                width:
                  branding.logoImageDark.width === null ? undefined : branding.logoImageDark.width,
                height:
                  branding.logoImageDark.height === null
                    ? undefined
                    : branding.logoImageDark.height,
              };
            }
          }

          return result;
        }
      } catch (error) {
        console.error('Failed to fetch logo settings:', error);
      }

      return defaultLogoSettings;
    },
    cacheTTL
  );
}

export default async function WithGlobalLayout({ children }: { children: React.ReactNode }) {
  const [infoNavbarData, logoSettings] = await Promise.all([
    getInfoNavbarData(),
    getLogoSettings(),
  ]);

  return (
    <GlobalLayout infoNavbarData={infoNavbarData} logoSettings={logoSettings}>
      {children}
    </GlobalLayout>
  );
}
