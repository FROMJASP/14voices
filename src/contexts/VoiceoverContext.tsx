'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SelectedVoiceover {
  id: string;
  name: string;
  profilePhoto?: string;
  styleTags: string[];
}

interface VoiceoverContextType {
  selectedVoiceover: SelectedVoiceover | null;
  setSelectedVoiceover: (voiceover: SelectedVoiceover | null) => void;
  clearSelection: () => void;
}

const VoiceoverContext = createContext<VoiceoverContextType | undefined>(undefined);

export function VoiceoverProvider({
  children,
  initialVoiceover,
}: {
  children: ReactNode;
  initialVoiceover?: SelectedVoiceover;
}) {
  const [selectedVoiceover, setSelectedVoiceover] = useState<SelectedVoiceover | null>(
    initialVoiceover || null
  );

  const clearSelection = () => {
    setSelectedVoiceover(null);
  };

  return (
    <VoiceoverContext.Provider
      value={{
        selectedVoiceover,
        setSelectedVoiceover,
        clearSelection,
      }}
    >
      {children}
    </VoiceoverContext.Provider>
  );
}

export function useVoiceover() {
  const context = useContext(VoiceoverContext);
  if (context === undefined) {
    throw new Error('useVoiceover must be used within a VoiceoverProvider');
  }
  return context;
}

// Utility functions for scrolling
export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const yOffset = -20; // Small offset for better positioning
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
};

export const scrollToVoiceovers = () => scrollToSection('voiceover-showcase');
export const scrollToPriceCalculator = () => scrollToSection('price-calculator');
