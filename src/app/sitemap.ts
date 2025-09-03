import { MetadataRoute } from 'next';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://14voices.com';

  // Static routes with high priority
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/voiceovers`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  try {
    // Skip during build with fake database
    if (process.env.DATABASE_URL?.includes('fake:fake@fake')) {
      return staticRoutes;
    }

    const payload = await getPayload({ config: configPromise });

    // Get all published pages
    const pages = await payload.find({
      collection: 'pages',
      where: {
        status: {
          equals: 'published',
        },
      },
      limit: 100,
    });

    // Get all active voiceovers
    const voiceovers = await payload.find({
      collection: 'voiceovers',
      where: {
        status: {
          equals: 'active',
        },
      },
      limit: 200,
    });

    // Generate page URLs
    const pageUrls: MetadataRoute.Sitemap = pages.docs
      .filter((page: any) => page.slug !== 'home')
      .map((page: any) => ({
        url: `${baseUrl}/${page.slug}`,
        lastModified: new Date(page.updatedAt || page.createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));

    // Generate voiceover URLs
    const voiceoverUrls: MetadataRoute.Sitemap = voiceovers.docs.map((voiceover: any) => ({
      url: `${baseUrl}/voiceovers/${voiceover.slug}`,
      lastModified: new Date(voiceover.updatedAt || voiceover.createdAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    return [...staticRoutes, ...pageUrls, ...voiceoverUrls];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticRoutes;
  }
}
