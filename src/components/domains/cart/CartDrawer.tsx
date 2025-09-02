'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShoppingCart,
  Package,
  Clock,
  Shield,
  Sparkles,
  User,
  ChevronRight,
} from 'lucide-react';
import { Bricolage_Grotesque } from 'next/font/google';
import { useVoiceoverStore } from '@/stores';
import Image from 'next/image';

const bricolageGrotesque = Bricolage_Grotesque({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bricolage',
});

interface CartItem {
  id: string;
  name: string;
  price: number;
  details?: string[];
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onCheckout: () => void;
  productionName?: string;
  wordCount?: string;
  region?: string;
  extras?: string[];
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  total,
  onCheckout,
  productionName,
  wordCount,
  region,
  extras,
}: CartDrawerProps) {
  const selectedVoiceover = useVoiceoverStore((state) => state.selectedVoiceover);
  const [mounted, setMounted] = useState(false);

  // Debug logging
  useEffect(() => {
    if (isOpen) {
      console.log('CartDrawer opened with:', {
        items,
        total,
        productionName,
        wordCount,
        region,
        extras,
        selectedVoiceover,
      });
    }
  }, [isOpen, items, total, productionName, wordCount, region, extras, selectedVoiceover]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Remove body scroll lock - allow interaction with site

  if (!mounted) return null;

  const drawerContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Semi-transparent backdrop - click to close but don't block interaction */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40"
            style={{ pointerEvents: 'auto' }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-card shadow-2xl z-[60] ${bricolageGrotesque.variable} font-bricolage overflow-hidden`}
            style={{ height: '100vh' }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-title">Jouw selectie</h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                    aria-label="Sluit winkelwagen"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Empty state */}
                {!productionName && (!items || items.length === 0) && !selectedVoiceover && (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Package className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Je winkelwagen is leeg
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Selecteer een productiesoort om te beginnen
                    </p>
                  </div>
                )}

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

                {/* Additional word/version costs */}
                {items
                  .filter((item) => item.id === 'words' || item.id === 'region')
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-3 border-b border-border"
                    >
                      <p className="text-normal">{item.name}</p>
                      <p className="font-medium text-title">+€{item.price}</p>
                    </div>
                  ))}

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
                            <User className="w-6 h-6 text-primary" />
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

                {/* Current Total Summary - Always show if there's a total */}
                {total > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Huidige selectie
                      </span>
                      <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        €{total}
                      </span>
                    </div>
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
                  onClick={onClose}
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
  );

  return createPortal(drawerContent, document.body);
}

// Floating Cart Button Component
export function FloatingCartButton({
  itemCount,
  total,
  onClick,
}: {
  itemCount: number;
  total: number;
  onClick: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(itemCount > 0 || total > 0);
  }, [itemCount, total]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className={`fixed bottom-6 right-6 z-40 ${bricolageGrotesque.variable} font-bricolage`}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
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
  );
}
