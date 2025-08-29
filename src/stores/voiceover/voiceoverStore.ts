import { createStore } from '../lib/createStore';

interface SelectedVoiceover {
  id: string;
  name: string;
  profilePhoto?: string;
  styleTags: string[];
}

interface VoiceoverState {
  selectedVoiceover: SelectedVoiceover | null;
  setSelectedVoiceover: (voiceover: SelectedVoiceover | null) => void;
  clearSelection: () => void;
}

export const useVoiceoverStore = createStore<VoiceoverState>('voiceover', (set) => ({
  selectedVoiceover: null,

  setSelectedVoiceover: (voiceover) => {
    set((state) => {
      state.selectedVoiceover = voiceover;
    });
  },

  clearSelection: () => {
    set((state) => {
      state.selectedVoiceover = null;
    });
  },
}));

// Utility functions for scrolling (kept separate as they don't need state)
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
