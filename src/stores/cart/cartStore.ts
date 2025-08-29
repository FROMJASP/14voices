import { createStore } from '../lib/createStore';

interface CartItem {
  id: string;
  name: string;
  price: number;
  details: string[];
}

interface CartState {
  items: CartItem[];
  itemCount: number;
  total: number;

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;

  // Computed
  getItemById: (itemId: string) => CartItem | undefined;
}

export const useCartStore = createStore<CartState>(
  'cart',
  (set, get) => ({
    items: [],
    itemCount: 0,
    total: 0,

    addItem: (item) => {
      set((state) => {
        const existingItem = state.items.find((i) => i.id === item.id);
        if (existingItem) {
          return; // Item already exists
        }
        state.items.push(item);
        state.itemCount = state.items.length;
        state.total = state.items.reduce((sum, i) => sum + i.price, 0);
      });
    },

    removeItem: (itemId) => {
      set((state) => {
        state.items = state.items.filter((item) => item.id !== itemId);
        state.itemCount = state.items.length;
        state.total = state.items.reduce((sum, item) => sum + item.price, 0);
      });
    },

    updateItemQuantity: (itemId, quantity) => {
      if (quantity <= 0) {
        get().removeItem(itemId);
        return;
      }
      set((state) => {
        const item = state.items.find((i) => i.id === itemId);
        if (item) {
          // Note: This is simplified - in real app might need quantity field
          item.price = item.price * quantity;
          state.total = state.items.reduce((sum, item) => sum + item.price, 0);
        }
      });
    },

    clearCart: () => {
      set((state) => {
        state.items = [];
        state.itemCount = 0;
        state.total = 0;
      });
    },

    getItemById: (itemId) => {
      return get().items.find((item) => item.id === itemId);
    },
  }),
  {
    persist: true,
  }
);
