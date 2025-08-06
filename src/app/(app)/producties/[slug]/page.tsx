'use client';

import { ProductionDetailNew } from '@/components/domains/production';
import { useParams, useRouter } from 'next/navigation';

const productionSlugs = [
  'videoproductie',
  'e-learning',
  'radiospots',
  'tv-commercial',
  'web-commercial',
  'voice-response',
];

export default function ProductionPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const productionIndex = productionSlugs.indexOf(slug);

  if (productionIndex === -1) {
    router.push('/');
    return null;
  }

  return <ProductionDetailNew productionIndex={productionIndex} />;
}
