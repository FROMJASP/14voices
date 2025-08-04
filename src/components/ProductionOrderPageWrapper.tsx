'use client';

import { VoiceoverProvider } from '@/contexts/VoiceoverContext';
import { ProductionOrderPage } from '@/components/ProductionOrderPage';
import type { TransformedVoiceover } from '@/types/voiceover';
import { useEffect } from 'react';

interface ProductionOrderPageWrapperProps {
  productionIndex: number;
  voiceovers: TransformedVoiceover[];
  hideCloseButton?: boolean;
}

export function ProductionOrderPageWrapper({
  productionIndex,
  voiceovers,
  hideCloseButton = false,
}: ProductionOrderPageWrapperProps) {
  useEffect(() => {
    console.log('ProductionOrderPageWrapper mounted:', {
      productionIndex,
      voiceoverCount: voiceovers.length,
      hideCloseButton,
      firstVoiceover: voiceovers[0],
    });
  }, [productionIndex, voiceovers, hideCloseButton]);

  // Early return with error message if no voiceovers
  if (!voiceovers || voiceovers.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Geen stemmen beschikbaar</h2>
          <p className="text-muted-foreground">
            Er zijn momenteel geen voice-over artiesten beschikbaar. Probeer het later opnieuw.
          </p>
        </div>
      </div>
    );
  }

  return (
    <VoiceoverProvider>
      <ProductionOrderPage
        productionIndex={productionIndex}
        voiceovers={voiceovers}
        hideCloseButton={hideCloseButton}
      />
    </VoiceoverProvider>
  );
}