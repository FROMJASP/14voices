'use client';

import { ProductionDetailNew } from '@/components/features/production';
import { useParams } from 'next/navigation';

export default function ProductionPage() {
  const params = useParams();
  const slug = params.slug as string;

  return <ProductionDetailNew productionSlug={slug} />;
}
