import { Metadata } from 'next';
import { getPayload } from 'payload';
import config from '@payload-config';

export async function generateMetadata(): Promise<Metadata> {
  // During build time with fake database URL, return default metadata
  if (process.env.DATABASE_URL?.includes('fake:fake@fake')) {
    return {
      title: '14voices - Professionele Voice-overs',
      description: 'Professionele voice-overs voor elk project. Van commercials tot bedrijfsfilms.',
    };
  }

  try {
    const payload = await getPayload({ config });
    const siteSettings = await payload.findGlobal({
      slug: 'site-settings',
    });

    const icons: Metadata['icons'] = {};

    // Dynamic favicon from CMS with cache busting
    if (
      siteSettings?.favicon &&
      typeof siteSettings.favicon === 'object' &&
      'url' in siteSettings.favicon
    ) {
      // Add cache busting with timestamp
      const timestamp = Date.now();
      const faviconUrl = siteSettings.favicon.url;

      // For blob URLs, we can't add query params, so we'll use the URL as-is
      // The blob URL itself changes when a new file is uploaded
      const iconUrl =
        faviconUrl?.startsWith('blob:') || faviconUrl?.includes('.vercel-storage.com')
          ? faviconUrl
          : `${faviconUrl}?v=${timestamp}`;

      icons.icon = [
        { url: iconUrl, sizes: '32x32', type: 'image/x-icon' },
        { url: iconUrl, sizes: '16x16', type: 'image/x-icon' },
      ];
      icons.shortcut = iconUrl;
      icons.apple = iconUrl;
    }

    return {
      title: siteSettings?.siteName || '14voices - Professionele Voice-overs',
      description:
        siteSettings?.defaultSeo?.description ||
        'Professionele voice-overs voor elk project. Van commercials tot bedrijfsfilms.',
      icons,
      metadataBase: new URL(siteSettings?.siteUrl || 'https://14voices.com'),
      openGraph: {
        siteName: siteSettings?.openGraph?.siteName || siteSettings?.siteName || '14voices',
        type: (siteSettings?.openGraph?.type as 'website' | 'article') || 'website',
        locale: siteSettings?.language || 'nl',
      },
      twitter: {
        card:
          (siteSettings?.twitterCard?.cardType as 'summary' | 'summary_large_image') ||
          'summary_large_image',
        creator: siteSettings?.twitterCard?.handle ?? undefined,
      },
    };
  } catch (error) {
    console.error('Error fetching site settings:', error);

    return {
      title: '14voices - Professionele Voice-overs',
      description: 'Professionele voice-overs voor elk project. Van commercials tot bedrijfsfilms.',
    };
  }
}
