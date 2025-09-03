// Cache configuration for optimal performance
export const cacheConfig = {
  // Page cache settings
  pages: {
    home: {
      revalidate: 60, // 1 minute for home page
      staleWhileRevalidate: 300, // 5 minutes
    },
    voiceover: {
      revalidate: 120, // 2 minutes for voiceover pages
      staleWhileRevalidate: 600, // 10 minutes
    },
    static: {
      revalidate: 3600, // 1 hour for static pages
      staleWhileRevalidate: 7200, // 2 hours
    },
  },

  // API cache settings
  api: {
    voiceovers: {
      clientCache: 60, // 1 minute client cache
      serverCache: 300, // 5 minutes server cache
      cdnCache: 900, // 15 minutes CDN cache
    },
    navigation: {
      clientCache: 300, // 5 minutes
      serverCache: 1800, // 30 minutes
      cdnCache: 3600, // 1 hour
    },
  },

  // Image optimization settings
  images: {
    quality: 85,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

// Helper function to generate cache headers
export function getCacheHeaders(type: 'page' | 'api', resource: string) {
  if (type === 'api') {
    const apiConfig = cacheConfig.api;
    const settings = (apiConfig as any)[resource] || apiConfig.voiceovers;

    return {
      'Cache-Control': `public, max-age=${settings.clientCache}, s-maxage=${settings.serverCache}, stale-while-revalidate=${settings.serverCache * 2}`,
      'CDN-Cache-Control': `max-age=${settings.cdnCache}`,
    };
  }

  const pageConfig = cacheConfig.pages;
  const settings = (pageConfig as any)[resource] || pageConfig.static;

  return {
    'Cache-Control': `public, s-maxage=${settings.revalidate}, stale-while-revalidate=${settings.staleWhileRevalidate}`,
  };
}
