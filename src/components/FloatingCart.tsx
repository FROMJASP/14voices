'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, ChevronRight, Sparkles, Package, Clock, Shield } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { useVoiceover } from '@/contexts/VoiceoverContext';
import Image from 'next/image';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

interface CartItem {
  id: string;
  name: string;
  price: number;
  details?: string[];
}

interface FloatingCartProps {
  items: CartItem[];
  total: number;
  onCheckout: () => void;
  productionName?: string;
  wordCount?: string;
  region?: string;
  extras?: string[];
}

export function FloatingCart({
  items,
  total,
  onCheckout,
  productionName,
  wordCount,
  region,
  extras,
}: FloatingCartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { selectedVoiceover } = useVoiceover();

  useEffect(() => {
    // Show cart when items are added
    if (items.length > 0 || total > 0) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [items, total]);

  const itemCount = items.length + (selectedVoiceover ? 1 : 0);

  return (
    <>
      {/* Floating Cart Button */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className={`fixed bottom-6 right-6 z-50 ${plusJakarta.variable} font-plus-jakarta`}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="bg-primary text-black rounded-full shadow-2xl p-4 flex items-center gap-3 hover:shadow-3xl transition-all duration-300"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-black text-white text-xs rounded-full flex items-center justify-center font-bold"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </div>
              <div className="pr-2">
                <p className="text-xs font-medium">Totaalprijs</p>
                <p className="text-lg font-bold">€{total}</p>
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className={`fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-card shadow-2xl z-50 ${plusJakarta.variable} font-plus-jakarta`}
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-6 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-title">Jouw selectie</h2>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 hover:bg-accent rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {/* Production Type */}
                  {productionName && (
                    <div className="bg-[#fcf9f5] dark:bg-accent rounded-xl p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-title flex items-center gap-2">
                            <Package className="w-4 h-4 text-primary" />
                            Productiesoort
                          </h3>
                          <p className="text-normal mt-1">{productionName}</p>
                          {wordCount && <p className="text-sm text-muted mt-1">{wordCount}</p>}
                          {region && <p className="text-sm text-muted">Uitzendgebied: {region}</p>}
                        </div>
                        <p className="font-semibold text-title">
                          €{items.find((item) => item.name === productionName)?.price || 0}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Selected Voiceover */}
                  {selectedVoiceover && (
                    <div className="bg-[#fcf9f5] dark:bg-accent rounded-xl p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {selectedVoiceover.profilePhoto ? (
                            <Image
                              src={selectedVoiceover.profilePhoto}
                              alt={selectedVoiceover.name}
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                              <Sparkles className="w-6 h-6 text-primary" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-title">Stemacteur</h3>
                            <p className="text-normal">{selectedVoiceover.name}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted">Inclusief</p>
                      </div>
                    </div>
                  )}

                  {/* Extras */}
                  {extras && extras.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-title">Extra opties</h3>
                      {extras.map((extra, index) => {
                        const item = items.find((i) => i.name === extra);
                        return (
                          <div key={index} className="flex items-center justify-between py-2">
                            <p className="text-normal">{extra}</p>
                            <p className="font-medium text-title">+€{item?.price || 0}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Benefits */}
                  <div className="mt-8 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-normal">Levering binnen 48 uur</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-normal">100% tevredenheidsgarantie</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-normal">Professionele kwaliteit</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-title">Totaalprijs</span>
                    <span className="text-2xl font-bold text-title">€{total}</span>
                  </div>

                  <button
                    onClick={onCheckout}
                    className="w-full bg-primary text-black font-semibold py-4 rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    Doorgaan naar checkout
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center text-sm text-muted hover:text-normal transition-colors"
                  >
                    Verder winkelen
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
