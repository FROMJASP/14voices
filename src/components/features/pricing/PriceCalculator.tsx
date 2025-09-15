'use client';

import React, { useState, useCallback } from 'react';
import { Bricolage_Grotesque } from 'next/font/google';
import { useVoiceoverSelectionStore, useCartStore, useCheckoutStore } from '@/stores';
import { PriceCalculatorHeader } from './PriceCalculatorHeader';
import { PriceCalculatorContent } from './PriceCalculatorContent';
import { PriceCalculatorFooter } from './PriceCalculatorFooter';
import { PriceCalculatorSummary } from './PriceCalculatorSummary';
import { createCartItems, productionData } from './utils';
import type { CartFormData } from './types';

const bricolageGrotesque = Bricolage_Grotesque({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bricolage',
});

/**
 * Optimized unified price calculator component
 * Handles production selection, price calculation, and cart management
 */
export const UnifiedPriceCalculatorOptimized = React.memo(() => {
  const selectedVoiceover = useVoiceoverSelectionStore((state) => state.selectedVoiceover);
  const setProductionName = useCheckoutStore((state) => state.setProductionName);
  const setWordCount = useCheckoutStore((state) => state.setWordCount);
  const setRegion = useCheckoutStore((state) => state.setRegion);
  const setExtras = useCheckoutStore((state) => state.setExtras);
  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);

  const [showCalculator, setShowCalculator] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const handleProductionClick = useCallback(() => {
    setShowCalculator(true);
  }, []);

  const clearCart = useCartStore((state) => state.clearCart);
  const resetProductionConfig = useCheckoutStore((state) => state.resetProductionConfig);

  const handleReset = useCallback(() => {
    setShowCalculator(false);
    resetProductionConfig();
    clearCart();
  }, [resetProductionConfig, clearCart]);

  const handleAddToCart = useCallback(
    (data: CartFormData) => {
      const production = productionData[data.productionIndex];

      // Update checkout configuration
      setProductionName(production.name);
      setWordCount(data.selectedWords || '');
      setRegion(data.selectedRegion || '');
      setExtras(Array.from(data.selectedOptions));

      // Create cart items and add them
      const items = createCartItems(
        production,
        data.selectedWords || '',
        data.selectedOptions,
        data.selectedRegion
      );

      // Clear cart before adding new items
      clearCart();
      items.forEach((item) => addItem(item));

      // Show success message
      alert('Product toegevoegd aan winkelwagen! Kies nu een stem.');
    },
    [setProductionName, setWordCount, setRegion, setExtras, clearCart, addItem]
  );

  const handleProductionChange = useCallback(() => {
    // Handle production changes if needed
  }, []);

  const handleCartClose = useCallback(() => {
    setShowCart(false);
  }, []);

  const handleContinue = useCallback(() => {
    // Navigate to checkout or next step
    window.location.href = selectedVoiceover ? '/checkout' : '/stemmen';
  }, [selectedVoiceover]);

  return (
    <section
      id="price-calculator"
      className={`${bricolageGrotesque.variable} w-full bg-background text-foreground py-20`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <PriceCalculatorHeader />

        <PriceCalculatorContent
          showCalculator={showCalculator}
          onProductionClick={handleProductionClick}
          onReset={handleReset}
          onAddToCart={handleAddToCart}
          onProductionChange={handleProductionChange}
        />

        <PriceCalculatorFooter />
      </div>

      {/* Cart Summary */}
      <PriceCalculatorSummary
        isOpen={showCart}
        onClose={handleCartClose}
        cartItems={cartItems}
        selectedVoiceover={selectedVoiceover ? { name: selectedVoiceover.name } : undefined}
        onContinue={handleContinue}
      />
    </section>
  );
});

UnifiedPriceCalculatorOptimized.displayName = 'UnifiedPriceCalculatorOptimized';
