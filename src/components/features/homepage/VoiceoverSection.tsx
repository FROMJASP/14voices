'use client';

import React, { useEffect, useState } from 'react';
import { getVoiceovers } from '@/lib/api';
import type { TransformedVoiceover } from '@/types/voiceover';

// Import directly for immediate rendering
import { OptimizedVoiceoverGrid } from '@/components/domains/voiceover';

interface VoiceoverSectionProps {
  initialVoiceovers?: TransformedVoiceover[];
  title?: string;
}

export function VoiceoverSection({
  initialVoiceovers,
  title = 'Onze Stemacteurs',
}: VoiceoverSectionProps) {
  const [voiceovers, setVoiceovers] = useState<TransformedVoiceover[]>(initialVoiceovers || []);
  const [loading, setLoading] = useState(!initialVoiceovers || initialVoiceovers.length === 0);

  useEffect(() => {
    // If we don't have voiceovers from SSR, fetch them client-side
    if (!initialVoiceovers || initialVoiceovers.length === 0) {
      getVoiceovers()
        .then((data) => {
          setVoiceovers(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Failed to fetch voiceovers:', error);
          setLoading(false);
        });
    }
  }, [initialVoiceovers]);

  // Don't show loading state if we have initial data from SSR
  if (loading && (!initialVoiceovers || initialVoiceovers.length === 0)) {
    return (
      <section id="voiceovers" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              {title}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Only show skeleton if truly loading with no data */}
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[3/4] bg-muted rounded-lg" />
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (voiceovers.length === 0) {
    return null;
  }

  return (
    <section id="voiceovers" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <OptimizedVoiceoverGrid voiceovers={voiceovers} title={title} />
      </div>
    </section>
  );
}
