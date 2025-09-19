import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { transformVoiceoverData } from '@/lib/voiceover-utils';
import type { PayloadVoiceover } from '@/types/voiceover';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ProductionOrderPageWrapper } from '@/components/features/production';

const productionSlugs = [
  'videoproductie',
  'e-learning',
  'radiospot', // Changed back to singular to match production data
  'tv-commercial',
  'web-commercial',
  'voice-response',
];

const productionNames: Record<string, string> = {
  videoproductie: 'Videoproductie',
  'e-learning': 'E-learning',
  radiospot: 'Radiospot', // Changed back to singular
  'tv-commercial': 'TV Commercial',
  'web-commercial': 'Web Commercial',
  'voice-response': 'Voice Response',
};

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ production: string }>;
}): Promise<Metadata> {
  const { production } = await params;
  const productionName = productionNames[production] || production;

  return {
    title: `${productionName} bestellen - 14voices`,
    description: `Bestel professionele ${productionName.toLowerCase()} voice-overs bij 14voices. Kies uit onze talentvolle stemacteurs en configureer je project.`,
  };
}

// Generate static params for better performance
export async function generateStaticParams() {
  return productionSlugs.map((slug) => ({
    production: slug,
  }));
}

// Use ISR for better performance while maintaining dynamic data
export const revalidate = 1800; // 30 minutes
export const dynamic = 'force-static';
export const dynamicParams = false; // Only allow predefined production slugs

export default async function OrderPage({ params }: { params: Promise<{ production: string }> }) {
  const { production } = await params;
  const productionIndex = productionSlugs.indexOf(production);

  // Return 404 if production slug is invalid
  if (productionIndex === -1) {
    notFound();
  }

  const payload = await getPayload({ config: configPromise });

  // Fetch active voiceovers
  const activeResult = await payload.find({
    collection: 'voiceovers',
    where: {
      status: {
        equals: 'active',
      },
    },
    depth: 3,
    limit: 100,
  });

  // Transform the data
  const voiceovers = activeResult.docs.map((voiceover, index) =>
    transformVoiceoverData(voiceover as unknown as PayloadVoiceover, index)
  );

  // Debug logging
  console.log('OrderPage rendering:', {
    production,
    productionIndex,
    voiceoverCount: voiceovers.length,
    firstVoiceover: voiceovers[0]?.name,
  });

  // Render the ProductionOrderPage with VoiceoverProvider wrapper
  return (
    <>
      {/* Debug info */}
      <div className="hidden">
        <pre>
          {JSON.stringify(
            { production, productionIndex, voiceoverCount: voiceovers.length },
            null,
            2
          )}
        </pre>
      </div>
      <ProductionOrderPageWrapper
        productionIndex={productionIndex}
        voiceovers={voiceovers}
        hideCloseButton={false}
      />
    </>
  );
}
