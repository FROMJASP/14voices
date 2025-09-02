'use client';

import React, { useState, useCallback, lazy, Suspense, memo } from 'react';
import { usePathname } from 'next/navigation';
import { UnifiedPriceCalculatorOptimized } from '@/components/domains/pricing';
import { HeroSection } from './HeroSection';
import FAQSection from './FAQSection'; // Uses default export (client wrapper)
import type { HomepageSettings } from '@/lib/homepage-settings';
import { LoadingSpinner } from '@/components/common/ui';
import type { TransformedVoiceover } from '@/types/voiceover';
import { OptimizedVoiceoverGrid } from '@/components/domains/voiceover';

// Lazy load heavy components that are only shown conditionally
const ProductionDrawerOptimized = lazy(() =>
  import('@/components/domains/production').then((module) => ({
    default: module.ProductionDrawer,
  }))
);

const ProductionOrderPage = lazy(() =>
  import('@/components/domains/production/ProductionOrderPage').then((module) => ({
    default: module.ProductionOrderPage,
  }))
);

const productionSlugs = [
  'videoproductie',
  'e-learning',
  'radiospot',
  'tv-commercial',
  'web-commercial',
  'voice-response',
];

interface HomepageWithDrawerProps {
  voiceovers: (TransformedVoiceover & {
    tags: string[];
    color: string;
    beschikbaar: boolean;
    availabilityText: string;
  })[];
  heroSettings: HomepageSettings;
}

// Memoized loading fallback component
const DrawerLoadingFallback = memo(() => (
  <div className="flex items-center justify-center p-8">
    <LoadingSpinner />
    <span className="ml-2 text-muted-foreground">Loading...</span>
  </div>
));

DrawerLoadingFallback.displayName = 'DrawerLoadingFallback';

// Memoized main content to prevent re-renders when drawer state changes
const MainContent = memo(
  ({ heroSettings, voiceovers }: { heroSettings: HomepageSettings; voiceovers: any[] }) => {
    return (
      <div>
        <HeroSection heroSettings={heroSettings} />
        <section id="voiceovers" className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Onze Stemacteurs
              </h2>
            </div>
            <OptimizedVoiceoverGrid voiceovers={voiceovers} />
          </div>
        </section>
        <UnifiedPriceCalculatorOptimized />
        <FAQSection />
      </div>
    );
  }
);

MainContent.displayName = 'MainContent';

export const HomepageWithDrawerOptimized = memo(function HomepageWithDrawer({
  voiceovers,
  heroSettings,
}: HomepageWithDrawerProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedProduction, setSelectedProduction] = useState<string | null>(null);
  const pathname = usePathname();

  // Check if we're on an order page on initial load - memoized
  React.useEffect(() => {
    const match = pathname.match(/^\/order\/(.+)$/);
    if (match && productionSlugs.includes(match[1])) {
      setSelectedProduction(match[1]);
      setIsDrawerOpen(true);
    }
  }, [pathname]);

  // Memoized drawer close handler
  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    // Small delay to let animation complete before clearing selection
    setTimeout(() => {
      setSelectedProduction(null);
    }, 300);
  }, []);

  // Memoized production index calculation
  const productionIndex = React.useMemo(
    () => (selectedProduction ? productionSlugs.indexOf(selectedProduction) : -1),
    [selectedProduction]
  );

  return (
    <>
      <MainContent heroSettings={heroSettings} voiceovers={voiceovers} />

      {/* Only render production drawer when needed */}
      {isDrawerOpen && (
        <Suspense fallback={<DrawerLoadingFallback />}>
          <ProductionDrawerOptimized
            isOpen={isDrawerOpen}
            onClose={handleCloseDrawer}
            productionSlug={selectedProduction}
          >
            {selectedProduction && productionIndex !== -1 && (
              <Suspense fallback={<DrawerLoadingFallback />}>
                <ProductionOrderPage
                  productionIndex={productionIndex}
                  voiceovers={voiceovers}
                  hideCloseButton={true}
                />
              </Suspense>
            )}
          </ProductionDrawerOptimized>
        </Suspense>
      )}
    </>
  );
});
