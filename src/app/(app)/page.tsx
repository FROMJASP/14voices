import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { PageRenderer } from '@/components/PageRenderer';
import type { Page } from '@/payload-types';
import { UnifiedHero } from '@/components/unified';
import {
  StemmenSection,
  PrijzenSection,
  BlogSection,
  ContactSection,
} from '@/components/sections/HomepageSections';
import { PriceCalculator } from '@/components/PriceCalculator';
import { VoiceoverShowcase } from '@/components/VoiceoverShowcase';
import { VoiceoverProvider } from '@/contexts/VoiceoverContext';

export async function generateMetadata() {
  const payload = await getPayload({ config: configPromise });

  const pages = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'home',
      },
      status: {
        equals: 'published',
      },
    },
    limit: 1,
  });

  const page = pages.docs[0] as Page | undefined;

  if (!page) {
    return {
      title: '14voices',
      description: 'Professional voice-over services',
    };
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

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise });

  const pages = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'home',
      },
      status: {
        equals: 'published',
      },
    },
    limit: 1,
    depth: 2,
  });

  const page = pages.docs[0] as Page | undefined;

  // If no home page exists, show our beautiful landing page
  if (!page) {
    return (
      <VoiceoverProvider>
        <UnifiedHero variant="page" />
        <VoiceoverShowcase />
        <PriceCalculator />
        <StemmenSection />
        <PrijzenSection />
        <BlogSection />
        <ContactSection />
      </VoiceoverProvider>
    );
  }

  return (
    <VoiceoverProvider>
      <PageRenderer page={page} />
      <VoiceoverShowcase />
      <PriceCalculator />
    </VoiceoverProvider>
  );
}
