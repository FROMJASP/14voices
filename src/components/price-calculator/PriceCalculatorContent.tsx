'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ProductionGridSimple } from '../ProductionGridSimple';
import { PriceCalculatorFormOptimized } from './PriceCalculatorFormOptimized';
import type { CartFormData } from './types';

interface PriceCalculatorContentProps {
  /**
   * Whether to show the calculator form or production grid
   */
  showCalculator: boolean;
  /**
   * Handler for when a production is clicked from the grid
   */
  onProductionClick: () => void;
  /**
   * Handler for resetting the calculator state
   */
  onReset: () => void;
  /**
   * Handler for adding items to cart
   */
  onAddToCart: (data: CartFormData) => void;
  /**
   * Handler for production changes
   */
  onProductionChange: () => void;
}

/**
 * Main content area for the price calculator
 * Handles the transition between production selection and price calculation
 */
export const PriceCalculatorContent = React.memo<PriceCalculatorContentProps>(({
  showCalculator,
  onProductionClick,
  onReset,
  onAddToCart,
  onProductionChange,
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      {!showCalculator ? (
        <ProductionGridSimple onProductionClick={onProductionClick} />
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <PriceCalculatorFormOptimized
            onProductionChange={onProductionChange}
            onReset={onReset}
            onAddToCart={onAddToCart}
          />
        </motion.div>
      )}
    </div>
  );
});

PriceCalculatorContent.displayName = 'PriceCalculatorContent';