import { createStore } from '../lib/createStore';

type DrawerStep = 'voiceover' | 'production' | 'cart' | 'checkout';

interface SelectedVoiceover {
  id: string;
  name: string;
  slug: string;
  profilePhoto?: string;
  tags?: string[];
  demos?: Array<{
    id: string;
    title: string;
    audioFile: { url: string };
    duration: string;
  }>;
}

interface DrawerState {
  isOpen: boolean;
  step: DrawerStep;
  selectedVoiceover?: SelectedVoiceover;

  // Actions
  openDrawer: (step: DrawerStep, voiceover?: SelectedVoiceover) => void;
  closeDrawer: () => void;
  setStep: (step: DrawerStep) => void;
  nextStep: () => void;
  previousStep: () => void;
}

const stepOrder: DrawerStep[] = ['voiceover', 'production', 'cart', 'checkout'];

export const useDrawerStore = createStore<DrawerState>('drawer', (set, get) => ({
  isOpen: false,
  step: 'voiceover',
  selectedVoiceover: undefined,

  openDrawer: (step, voiceover) => {
    set((state) => {
      state.isOpen = true;
      state.step = step;
      if (voiceover) {
        state.selectedVoiceover = voiceover;
      }
    });
    // Note: Cross-store communication can be handled via events or direct imports if needed
  },

  closeDrawer: () => {
    set((state) => {
      state.isOpen = false;
    });
  },

  setStep: (step) => {
    set((state) => {
      state.step = step;
    });
  },

  nextStep: () => {
    const { step } = get();
    const currentIndex = stepOrder.indexOf(step);
    if (currentIndex < stepOrder.length - 1) {
      set((state) => {
        state.step = stepOrder[currentIndex + 1];
      });
    }
  },

  previousStep: () => {
    const { step } = get();
    const currentIndex = stepOrder.indexOf(step);
    if (currentIndex > 0) {
      set((state) => {
        state.step = stepOrder[currentIndex - 1];
      });
    }
  },
}));
