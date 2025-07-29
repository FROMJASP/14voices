'use client';

import { useParams, useRouter } from 'next/navigation';
import { ProductionDetailNew } from '@/components/ProductionDetailNew';

const productionSlugs = [
  'videoproductie',
  'e-learning',
  'radiospots',
  'tv-commercial',
  'web-commercial',
  'voice-response',
];

export default function OrderPage() {
  const params = useParams();
  const router = useRouter();
  const production = params.production as string;

  const productionIndex = productionSlugs.indexOf(production);

  if (productionIndex === -1) {
    router.push('/');
    return null;
  }

  return <ProductionDetailNew productionIndex={productionIndex} />;
}
