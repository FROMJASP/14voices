'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X } from 'lucide-react';
import { Instrument_Serif, Bricolage_Grotesque } from 'next/font/google';
import type { MenuItem } from './Navigation.types';

const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
});

const bricolageGrotesque = Bricolage_Grotesque({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bricolage',
});

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
}

export function MobileMenu({ isOpen, onClose, menuItems }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[98] lg:hidden"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white dark:bg-background shadow-xl z-[99] lg:hidden flex flex-col ${instrumentSerif.variable} ${bricolageGrotesque.variable}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-border">
              <Link href="/" onClick={onClose} className="group">
                <span className="font-instrument-serif">
                  <span className="text-3xl text-primary font-normal">Fourteen</span>{' '}
                  <span className="text-2xl text-foreground italic font-light">Voices</span>
                </span>
              </Link>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-muted transition-all"
                aria-label="Close mobile menu"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-white" />
              </button>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-1">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="font-bricolage block px-4 py-3 rounded-lg text-base font-semibold leading-6 text-[var(--text)] hover:text-[var(--foreground)] dark:text-[var(--text)] dark:hover:text-[var(--foreground)] hover:bg-gray-100 dark:hover:bg-muted transition-all cursor-pointer"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="px-6 py-4">
                <Link
                  href="/demo"
                  onClick={onClose}
                  className="font-bricolage block w-full text-center bg-primary text-gray-900 dark:text-black px-6 py-3 rounded-md text-base font-medium transition-all border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 cursor-pointer"
                >
                  Hoe het werkt?
                </Link>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-border">
              {/* Login Button */}
              <Link
                href="/login"
                onClick={onClose}
                className="font-bricolage block w-full text-center bg-gray-100 hover:bg-gray-200 dark:bg-muted dark:hover:bg-muted/80 text-[var(--foreground)] px-6 py-3 rounded-lg text-base font-medium transition-all cursor-pointer"
              >
                Login
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
