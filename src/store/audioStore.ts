import { create } from 'zustand';

interface AudioState {
  currentlyPlayingId: string | null;
  audioElements: Map<string, HTMLAudioElement>;
  setCurrentlyPlaying: (id: string | null) => void;
  registerAudio: (id: string, audio: HTMLAudioElement) => void;
  unregisterAudio: (id: string) => void;
  pauseAll: () => void;
  pauseOthers: (exceptId: string) => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  currentlyPlayingId: null,
  audioElements: new Map(),

  setCurrentlyPlaying: (id) => set({ currentlyPlayingId: id }),

  registerAudio: (id, audio) => {
    set((state) => {
      const newMap = new Map(state.audioElements);
      newMap.set(id, audio);
      return { audioElements: newMap };
    });
  },

  unregisterAudio: (id) => {
    set((state) => {
      const newMap = new Map(state.audioElements);
      newMap.delete(id);
      return { audioElements: newMap };
    });
  },

  pauseAll: () => {
    const { audioElements } = get();
    audioElements.forEach((audio) => {
      if (!audio.paused) {
        audio.pause();
      }
    });
    set({ currentlyPlayingId: null });
  },

  pauseOthers: (exceptId) => {
    const { audioElements } = get();
    audioElements.forEach((audio, id) => {
      if (id !== exceptId && !audio.paused) {
        audio.pause();
      }
    });
  },
}));
