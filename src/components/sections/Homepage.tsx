'use client';

import React, { useState, useCallback, lazy, Suspense, memo } from 'react';
import { usePathname } from 'next/navigation';
import { VoiceoverProvider } from '@/contexts/VoiceoverContext';
import { VoiceoverSearchFieldDesignOptimized } from '@/components/features/voiceover/VoiceoverSearchField';
import { UnifiedPriceCalculatorOptimized } from '@/components/features/pricing';
import { LoadingSpinner } from '@/components/ui';
import type { TransformedVoiceover } from '@/types/voiceover';

// Lazy load heavy components that are only shown conditionally
const ProductionDrawerOptimized = lazy(() =>
  import('@/components/features/production').then((module) => ({
    default: module.ProductionDrawerOptimized,
  }))
);

const ProductionOrderPage = lazy(() =>
  import('@/components/features/production/ProductionOrderPage').then((module) => ({
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
  ({ voiceovers }: { voiceovers: HomepageWithDrawerProps['voiceovers'] }) => (
    <div>
      <VoiceoverSearchFieldDesignOptimized voiceovers={voiceovers} />
      <UnifiedPriceCalculatorOptimized />
    </div>
  )
);

MainContent.displayName = 'MainContent';

export const HomepageWithDrawerOptimized = memo(function HomepageWithDrawer({
  voiceovers,
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
    <VoiceoverProvider>
      <MainContent voiceovers={voiceovers} />

      {/* Only render drawer when needed */}
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
    </VoiceoverProvider>
  );
});
