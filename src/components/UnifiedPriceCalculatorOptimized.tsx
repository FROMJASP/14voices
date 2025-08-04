'use client';

import React, { useState, useCallback } from 'react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { useVoiceover } from '@/contexts/VoiceoverContext';
import { useCart } from '@/contexts/CartContext';
import { PriceCalculatorHeader } from './price-calculator/PriceCalculatorHeader';
import { PriceCalculatorContent } from './price-calculator/PriceCalculatorContent';
import { PriceCalculatorFooter } from './price-calculator/PriceCalculatorFooter';
import { PriceCalculatorSummary } from './price-calculator/PriceCalculatorSummary';
import { createCartItems, productionData } from './price-calculator/utils';
import type { CartFormData } from './price-calculator/types';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

/**
 * Optimized unified price calculator component
 * Handles production selection, price calculation, and cart management
 */
export const UnifiedPriceCalculatorOptimized = React.memo(() => {
  const { selectedVoiceover } = useVoiceover();
  const {
    setProductionName,
    setWordCount,
    setRegion,
    setExtras,
    setCartTotal,
    cartItems,
    setCartItems,
    setCartItemCount,
  } = useCart();

  const [showCalculator, setShowCalculator] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const handleProductionClick = useCallback(() => {
    setShowCalculator(true);
  }, []);

  const handleReset = useCallback(() => {
    setShowCalculator(false);
    setProductionName('');
    setWordCount('');
    setRegion('');
    setExtras([]);
    setCartItems([]);
    setCartItemCount(0);
    setCartTotal(0);
  }, [setProductionName, setWordCount, setRegion, setExtras, setCartItems, setCartItemCount, setCartTotal]);

  const handleAddToCart = useCallback((data: CartFormData) => {
    const production = productionData[data.productionIndex];
    
    // Update cart context
    setProductionName(production.name);
    setWordCount(data.selectedWords || '');
    setRegion(data.selectedRegion || '');
    setExtras(Array.from(data.selectedOptions));
    setCartTotal(data.total);

    // Create cart items
    const items = createCartItems(
      production,
      data.selectedWords || '',
      data.selectedOptions,
      data.selectedRegion
    );
    setCartItems(items);
    setCartItemCount(items.length);

    // Show success message
    alert('Product toegevoegd aan winkelwagen! Kies nu een stem.');
  }, [setProductionName, setWordCount, setRegion, setExtras, setCartTotal, setCartItems, setCartItemCount]);

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
      className={`${plusJakarta.variable} w-full bg-background text-foreground py-20`}
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