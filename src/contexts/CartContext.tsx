'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  details: string[];
}

interface SelectedVoiceover {
  name: string;
  profilePhoto?: string;
}

interface CartContextType {
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartItemCount: number;
  setCartItemCount: (count: number) => void;
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
  cartTotal: number;
  setCartTotal: (total: number) => void;
  productionName?: string;
  setProductionName: (name: string | undefined) => void;
  wordCount?: string;
  setWordCount: (count: string | undefined) => void;
  region?: string;
  setRegion: (region: string | undefined) => void;
  extras?: string[];
  setExtras: (extras: string[] | undefined) => void;
  selectedVoiceover?: SelectedVoiceover;
  setSelectedVoiceover: (voiceover: SelectedVoiceover | undefined) => void;
  // Optimized actions
  clearCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [productionName, setProductionName] = useState<string | undefined>();
  const [wordCount, setWordCount] = useState<string | undefined>();
  const [region, setRegion] = useState<string | undefined>();
  const [extras, setExtras] = useState<string[] | undefined>();
  const [selectedVoiceover, setSelectedVoiceover] = useState<SelectedVoiceover | undefined>();

  // Memoized optimized actions to prevent re-renders
  const clearCart = useCallback(() => {
    setCartItems([]);
    setCartItemCount(0);
    setCartTotal(0);
    setProductionName(undefined);
    setWordCount(undefined);
    setRegion(undefined);
    setExtras(undefined);
    setSelectedVoiceover(undefined);
  }, []);

  const addItem = useCallback((item: CartItem) => {
    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      if (existingItem) {
        return prev; // Item already exists
      }
      const newItems = [...prev, item];
      setCartItemCount(newItems.length);
      setCartTotal(newItems.reduce((sum, i) => sum + i.price, 0));
      return newItems;
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setCartItems((prev) => {
      const newItems = prev.filter((item) => item.id !== itemId);
      setCartItemCount(newItems.length);
      setCartTotal(newItems.reduce((sum, item) => sum + item.price, 0));
      return newItems;
    });
  }, []);

  const updateItemQuantity = useCallback(
    (itemId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(itemId);
        return;
      }
      setCartItems((prev) => {
        const newItems = prev.map((item) =>
          item.id === itemId ? { ...item, price: item.price * quantity } : item
        );
        setCartTotal(newItems.reduce((sum, item) => sum + item.price, 0));
        return newItems;
      });
    },
    [removeItem]
  );

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      isCartOpen,
      setIsCartOpen,
      cartItemCount,
      setCartItemCount,
      cartItems,
      setCartItems,
      cartTotal,
      setCartTotal,
      productionName,
      setProductionName,
      wordCount,
      setWordCount,
      region,
      setRegion,
      extras,
      setExtras,
      selectedVoiceover,
      setSelectedVoiceover,
      // Optimized actions
      clearCart,
      addItem,
      removeItem,
      updateItemQuantity,
    }),
    [
      isCartOpen,
      cartItemCount,
      cartItems,
      cartTotal,
      productionName,
      wordCount,
      region,
      extras,
      selectedVoiceover,
      clearCart,
      addItem,
      removeItem,
      updateItemQuantity,
    ]
  );

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Performance-optimized hooks for specific cart features
export function useCartState() {
  const { isCartOpen, cartItemCount, cartTotal } = useCart();
  return useMemo(
    () => ({ isCartOpen, cartItemCount, cartTotal }),
    [isCartOpen, cartItemCount, cartTotal]
  );
}

export function useCartActions() {
  const { setIsCartOpen, clearCart, addItem, removeItem, updateItemQuantity } = useCart();
  return useMemo(
    () => ({
      setIsCartOpen,
      clearCart,
      addItem,
      removeItem,
      updateItemQuantity,
    }),
    [setIsCartOpen, clearCart, addItem, removeItem, updateItemQuantity]
  );
}
