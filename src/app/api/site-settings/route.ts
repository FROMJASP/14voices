import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { createApiHandler } from '@/lib/api/handlers';
import globalCache from '@/lib/cache';

export const GET = createApiHandler(
  async () => {
    return await globalCache.wrap(
      'site-settings:global',
      async () => {
        const payload = await getPayload({ config: configPromise });

        const siteSettings = await payload.findGlobal({
          slug: 'site-settings',
          depth: 2,
        });

        return siteSettings;
      },
      60000 // 1 minute
    );
  },
  {
    cache: {
      enabled: true,
      ttl: 60000, // 1 minute
      key: () => 'site-settings:api',
      invalidatePatterns: ['site-settings:*'],
    },
    rateLimit: {
      requests: 100,
      window: 60,
    },
  }
);
