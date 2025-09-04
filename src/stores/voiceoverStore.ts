import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TransformedVoiceover } from '@/types/voiceover';

interface VoiceoverStore {
  voiceovers: TransformedVoiceover[];
  lastFetched: number | null;
  isStale: () => boolean;
  setVoiceovers: (voiceovers: TransformedVoiceover[]) => void;
  clearCache: () => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useVoiceoverStore = create<VoiceoverStore>()(
  persist(
    (set, get) => ({
      voiceovers: [],
      lastFetched: null,

      isStale: () => {
        const { lastFetched } = get();
        if (!lastFetched) return true;
        return Date.now() - lastFetched > CACHE_DURATION;
      },

      setVoiceovers: (voiceovers) =>
        set({
          voiceovers,
          lastFetched: Date.now(),
        }),

      clearCache: () =>
        set({
          voiceovers: [],
          lastFetched: null,
        }),
    }),
    {
      name: 'voiceover-cache',
      partialize: (state) => ({
        voiceovers: state.voiceovers,
        lastFetched: state.lastFetched,
      }),
    }
  )
);
