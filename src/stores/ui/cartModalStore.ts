import { createStore } from '../lib/createStore';

interface CartModalState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggleOpen: () => void;
}

export const useCartModalStore = createStore<CartModalState>('cartModal', (set) => ({
  isOpen: false,

  setIsOpen: (isOpen) => {
    set((state) => {
      state.isOpen = isOpen;
    });
  },

  toggleOpen: () => {
    set((state) => {
      state.isOpen = !state.isOpen;
    });
  },
}));
