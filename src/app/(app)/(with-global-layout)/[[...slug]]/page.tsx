import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { PageRenderer } from '@/components/common/widgets';
import type { Page } from '@/payload-types';
import { headers } from 'next/headers';

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Enable Incremental Static Regeneration (ISR) for better performance
export const revalidate = 60; // Revalidate every minute for fresher content
export const dynamicParams = true;
export const fetchCache = 'force-cache'; // Force cache for better performance

// Pre-generate static paths for common pages
export async function generateStaticParams() {
  // During build with fake database, skip generation
  if (process.env.DATABASE_URL?.includes('fake:fake@fake')) {
    return [];
  }

  try {
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

    // Generate paths for all pages
    return pages.docs.map((page) => ({
      slug: page.slug === 'home' ? [] : page.slug.split('/'),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps) {
  // During build time with fake database URL, return default metadata
  if (process.env.DATABASE_URL?.includes('fake:fake@fake')) {
    return {
      title: '14voices - Professionele Voice-overs',
      description: 'Professionele voice-overs voor elk project. Van commercials tot bedrijfsfilms.',
    };
  }

  const { slug: slugArray } = await params;
  const slug = slugArray?.join('/') || 'home';
  const payload = await getPayload({ config: configPromise });

  const pages = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: slug,
      },
      status: {
        equals: 'published',
      },
    },
    limit: 1,
  });

  const page = pages.docs[0] as Page | undefined;

  if (!page) {
    return {};
  }

  const title = page.meta?.title || page.title;
  const description = page.meta?.description || '';
  const image =
    page.meta?.image && typeof page.meta.image === 'object' ? page.meta.image.url : undefined;

  return {
    title,
    description,
    openGraph: {
      title: page.openGraph?.title || title,
      description: page.openGraph?.description || description,
      images: image ? [{ url: image }] : [],
      type: page.openGraph?.type || 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.openGraph?.title || title,
      description: page.openGraph?.description || description,
      images: image ? [image] : [],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug: slugArray } = await params;
  const slug = slugArray?.join('/') || 'home';
  const payload = await getPayload({ config: configPromise });

  // Check if we're in Payload's live preview iframe
  const headersList = await headers();
  const isLivePreview = headersList.get('x-payload-live-preview') === 'true';

  let page: Page | undefined;

  // For live preview, always fetch draft by slug
  if (isLivePreview) {
    const pages = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
      depth: 2,
      draft: true, // Always fetch draft for live preview
    });

    page = pages.docs[0] as Page | undefined;
  }

  // Otherwise, fetch by slug
  if (!page) {
    const pages = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: slug,
        },
        ...(!isLivePreview && {
          status: {
            equals: 'published',
          },
        }),
      },
      limit: 1,
      depth: 2,
      draft: isLivePreview,
    });

    page = pages.docs[0] as Page | undefined;
  }

  if (!page) {
    notFound();
  }

  // Helper to convert null values to undefined recursively
  function nullToUndefined<T>(obj: T): T {
    if (obj === null) return undefined as unknown as T;
    if (obj === undefined) return obj;
    if (typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) {
      return obj.map(nullToUndefined) as unknown as T;
    }

    const result: Record<string, unknown> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = nullToUndefined(obj[key]);
      }
    }
    return result as T;
  }

  // Transform the page to ensure no null values
  const transformedPage = {
    ...nullToUndefined(page),
    sections:
      page.sections === null
        ? undefined
        : page.sections?.map((section) => nullToUndefined(section)),
  } as Page & { content?: unknown; sections?: any[] };

  // Always fetch voiceovers for homepage for better caching
  let voiceovers = null;
  if (slug === 'home' || slug === 'blog') {
    // Fetch voiceovers with caching for better performance
    const voiceoverResults = await payload.find({
      collection: 'voiceovers',
      where: {
        status: {
          in: ['active', 'more-voices'],
        },
      },
      depth: 2,
      limit: 100,
    });

    voiceovers = voiceoverResults.docs;
  }

  // Fetch site settings to get brand color
  let brandColor = '#6366f1';
  try {
    const siteSettings = await payload.findGlobal({
      slug: 'site-settings',
      depth: 0,
    });
    brandColor = (siteSettings as any)?.branding?.brandColor || brandColor;
  } catch (error) {
    console.error('Failed to fetch site settings:', error);
  }

  // No Suspense needed - data is already loaded server-side with ISR
  return <PageRenderer page={transformedPage} voiceovers={voiceovers} brandColor={brandColor} />;
}
