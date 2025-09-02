import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { PageRenderer, PreviewLoading } from '@/components/common/widgets';
import type { Page } from '@/payload-types';
import { Suspense } from 'react';
import { headers } from 'next/headers';

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Disable static generation for self-hosted deployments
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

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

  // Fetch voiceovers if this is the homepage
  let voiceovers = null;
  if (slug === 'home') {
    // Fetch voiceovers directly from Payload during SSR
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

  return (
    <Suspense fallback={<PreviewLoading />}>
      <PageRenderer page={transformedPage} voiceovers={voiceovers} />
    </Suspense>
  );
}
