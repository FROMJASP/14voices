import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { PageRenderer } from '@/components/common/widgets';
import type { Page } from '@/payload-types';

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

// Disable static generation for self-hosted deployments
// This prevents build-time database connection attempts
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

// Commented out for self-hosted deployment
// Uncomment if you want to enable static generation with a database available at build time
// export async function generateStaticParams() {
//   const payload = await getPayload({ config: configPromise });
//
//   const pages = await payload.find({
//     collection: 'pages',
//     where: {
//       status: {
//         equals: 'published',
//       },
//     },
//     limit: 100,
//   });
//
//   return pages.docs
//     .filter((page) => (page as Page).slug !== 'home')
//     .map((page) => ({
//       slug: (page as Page).slug.split('/'),
//     }));
// }

export async function generateMetadata({ params }: PageProps) {
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
    depth: 2,
  });

  const page = pages.docs[0] as Page | undefined;

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

    const result: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = nullToUndefined(obj[key]);
      }
    }
    return result;
  }

  // Transform the page to ensure no null values
  const transformedPage = {
    ...page,
    sections: page.sections ? nullToUndefined(page.sections) : undefined,
    content: page.content ? nullToUndefined(page.content) : undefined,
  };

  return <PageRenderer page={transformedPage as any} />;
}
