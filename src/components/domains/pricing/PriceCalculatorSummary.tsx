'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, X, User } from 'lucide-react';
import type { CartItem } from './utils';

interface PriceCalculatorSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  selectedVoiceover?: {
    name: string;
    price?: number;
  };
  onContinue?: () => void;
}

export function PriceCalculatorSummary({
  isOpen,
  onClose,
  cartItems,
  selectedVoiceover,
  onContinue,
}: PriceCalculatorSummaryProps) {
  // Calculate total
  const productionTotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const voiceoverPrice = selectedVoiceover?.price || 0;
  const total = productionTotal + voiceoverPrice;

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-6">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Winkelwagen</h2>
            </div>
            <button onClick={onClose} className="rounded-lg p-2 hover:bg-accent transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Je winkelwagen is leeg</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Production items */}
                <div>
                  <h3 className="font-semibold mb-3">Productie</h3>
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start justify-between p-3 rounded-lg bg-accent/50"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.details.length > 0 && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.details.join(', ')}
                            </p>
                          )}
                        </div>
                        <p className="font-semibold text-primary">€{item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected voiceover */}
                {selectedVoiceover && (
                  <div>
                    <h3 className="font-semibold mb-3">Geselecteerde stem</h3>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-primary" />
                        <p className="font-medium">{selectedVoiceover.name}</p>
                      </div>
                      {voiceoverPrice > 0 && (
                        <p className="font-semibold text-primary">€{voiceoverPrice}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>Totaal</span>
                    <span className="text-2xl text-primary">€{total}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-border p-6">
              <button
                onClick={onContinue}
                className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-xl font-semibold hover:bg-primary/90 transition-all"
              >
                {selectedVoiceover ? 'Ga verder naar checkout' : 'Kies een stem'}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
