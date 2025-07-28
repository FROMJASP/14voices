'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  details?: string[];
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

  return (
    <CartContext.Provider
      value={{
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
