'use client';

import { ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { CartPreview } from '@/components/CartPreview';

interface CartItem {
  id: string;
  name: string;
  price: number;
  details?: string[];
}

interface CartButtonProps {
  cartItemCount: number;
  cartItems: CartItem[];
  cartTotal: number;
  productionName?: string;
  wordCount?: string;
  region?: string;
  extras?: string[];
  selectedVoiceover?: {
    name: string;
    profilePhoto?: string;
  };
}

export function CartButton({
  cartItemCount,
  cartItems,
  cartTotal,
  productionName,
  wordCount,
  region,
  extras,
  selectedVoiceover,
}: CartButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
    return undefined;
  }, [isOpen]);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Desktop version */}
      <div ref={containerRef} className="relative">
        <button
          onClick={handleClick}
          className="relative p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-white/90 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-muted transition-all cursor-pointer"
          aria-label="Open cart"
        >
          <ShoppingCart className="w-5 h-5" />
          {cartItemCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-black text-xs rounded-full flex items-center justify-center font-bold"
            >
              {cartItemCount}
            </motion.span>
          )}
        </button>

        {/* Desktop cart preview */}
        {!isMobile && (
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full right-0 mt-2 w-80 bg-background border border-border rounded-xl shadow-2xl z-[200]"
              >
                <CartPreview
                  items={cartItems}
                  total={cartTotal}
                  productionName={productionName}
                  wordCount={wordCount}
                  region={region}
                  extras={extras}
                  selectedVoiceover={selectedVoiceover}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Mobile modal */}
      {isMobile && (
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/20 z-[98]"
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                className="fixed bottom-4 left-4 right-4 z-[99] bg-background border border-border rounded-xl shadow-2xl"
              >
                <CartPreview
                  items={cartItems}
                  total={cartTotal}
                  productionName={productionName}
                  wordCount={wordCount}
                  region={region}
                  extras={extras}
                  selectedVoiceover={selectedVoiceover}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}
    </>
  );
}
