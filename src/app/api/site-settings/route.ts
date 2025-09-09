import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { createApiHandler } from '@/lib/api/handlers';

export const GET = createApiHandler(
  async () => {
    try {
      // Try to get payload instance
      const payload = await getPayload({ config: configPromise });

      // Try to fetch site settings directly first
      try {
        const siteSettings = await payload.findGlobal({
          slug: 'site-settings',
          depth: 2,
        });

        return siteSettings;
      } catch (findError) {
        console.error('Error finding site-settings global:', findError);

        // Return default settings if global doesn't exist
        return {
          siteName: '14voices',
          siteUrl: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
          language: 'nl',
          features: {
            maintenanceMode: false,
            maintenanceTitle: 'We zijn zo terug!',
            maintenanceMessage:
              'We voeren momenteel gepland onderhoud uit. We zijn zo weer online.',
            maintenanceContactLabel: 'Contact nodig?',
            showContactEmail: true,
            enableSearch: true,
            enableBlog: true,
          },
          contact: {
            email: 'casting@14voices.com',
          },
        };
      }
    } catch (error) {
      console.error('Site settings API error:', error);
      throw error;
    }
  },
  {
    cache: {
      enabled: true,
      ttl: 1800000, // 30 minutes
      key: () => 'site-settings:api',
      invalidatePatterns: ['site-settings:*'],
    },
    rateLimit: {
      requests: 100,
      window: 60,
    },
  }
);
