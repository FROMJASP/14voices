'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Instrument_Serif, Bricolage_Grotesque } from 'next/font/google';
import { useCart } from '@/contexts/CartContext';
import { CartButton } from '@/components/features/cart';

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

const defaultMenuItems = [
  { label: 'Voiceovers', href: '#voiceovers' },
  { label: 'Prijzen', href: '#prijzen' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
];

interface NavbarProps {
  menuItems?: typeof defaultMenuItems;
}

export function Navbar({ menuItems = defaultMenuItems }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const {
    cartItemCount,
    cartItems,
    cartTotal,
    productionName,
    wordCount,
    region,
    extras,
    selectedVoiceover,
  } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <>
      <style jsx global>{`
        .font-instrument-serif {
          font-family: var(--font-instrument-serif);
          letter-spacing: 0.02em;
        }
        .font-bricolage {
          font-family: var(--font-bricolage), 'Bricolage Grotesque', sans-serif;
        }
        /* Remove any gradient overlays or shadows */
        .sticky::before,
        .sticky::after {
          display: none !important;
        }
      `}</style>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-[100] bg-white dark:bg-background transition-all duration-300 ${isScrolled ? 'border-b border-gray-200 dark:border-border shadow-sm' : ''} ${instrumentSerif.variable} ${bricolageGrotesque.variable}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="group flex-shrink-0">
              <span className="font-instrument-serif">
                <span className="text-4xl text-primary font-normal">Fourteen</span>{' '}
                <span className="text-3xl text-foreground italic font-light">Voices</span>
              </span>
            </Link>

            {/* Center Navigation */}
            <div className="hidden lg:flex items-center justify-center flex-1 max-w-2xl mx-16">
              <nav className="flex items-center gap-12">
                {menuItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="font-bricolage text-base font-semibold leading-6 text-[var(--text)] hover:text-[var(--foreground)] dark:text-[var(--text)] dark:hover:text-[var(--foreground)] transition-all relative group cursor-pointer"
                  >
                    <span className="relative z-10">{item.label}</span>
                    <span className="absolute inset-x-0 -bottom-1 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Actions */}
            <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
              {/* Theme Toggle */}
              <button
                onClick={(e) => {
                  const newTheme = theme === 'dark' ? 'light' : 'dark';

                  // Check if browser supports View Transitions API
                  if (!document.startViewTransition) {
                    setTheme(newTheme);
                    return;
                  }

                  // Add transitioning class for performance optimizations
                  document.body.classList.add('transitioning');

                  // Get cursor position for dynamic animation origin
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
                  const y = ((rect.top + rect.height / 2) / window.innerHeight) * 100;

                  // Set CSS variables for animation origin
                  document.documentElement.style.setProperty('--transition-origin-x', `${x}%`);
                  document.documentElement.style.setProperty('--transition-origin-y', `${y}%`);

                  // Use View Transitions API for smooth theme change
                  const transition = document.startViewTransition(() => {
                    setTheme(newTheme);
                  });

                  // Clean up after transition
                  transition.finished.finally(() => {
                    document.body.classList.remove('transitioning');
                    document.documentElement.style.removeProperty('--transition-origin-x');
                    document.documentElement.style.removeProperty('--transition-origin-y');
                  });
                }}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-white/90 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-muted transition-all cursor-pointer"
                aria-label="Toggle theme"
              >
                <span className="text-base">{theme === 'dark' ? '☀️' : '🌙'}</span>
              </button>

              {/* Cart Icon with Preview */}
              <CartButton
                cartItemCount={cartItemCount}
                cartItems={cartItems}
                cartTotal={cartTotal}
                productionName={productionName}
                wordCount={wordCount}
                region={region}
                extras={extras}
                selectedVoiceover={selectedVoiceover}
              />

              {/* Login */}
              <Link
                href="/login"
                className="font-bricolage text-base text-[var(--text)] hover:text-[var(--foreground)] dark:text-[var(--text)] dark:hover:text-[var(--foreground)] font-medium transition-all cursor-pointer px-4 py-2"
              >
                Login
              </Link>

              {/* CTA Button */}
              <Link
                href="/demo"
                className="font-bricolage relative inline-flex items-center bg-primary text-gray-900 dark:text-black px-5 py-2.5 rounded-md text-base font-medium transition-all border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 cursor-pointer"
              >
                Hoe het werkt?
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={(e) => {
                  const newTheme = theme === 'dark' ? 'light' : 'dark';

                  // Check if browser supports View Transitions API
                  if (!document.startViewTransition) {
                    setTheme(newTheme);
                    return;
                  }

                  // Add transitioning class for performance optimizations
                  document.body.classList.add('transitioning');

                  // Get cursor position for dynamic animation origin
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
                  const y = ((rect.top + rect.height / 2) / window.innerHeight) * 100;

                  // Set CSS variables for animation origin
                  document.documentElement.style.setProperty('--transition-origin-x', `${x}%`);
                  document.documentElement.style.setProperty('--transition-origin-y', `${y}%`);

                  // Use View Transitions API for smooth theme change
                  const transition = document.startViewTransition(() => {
                    setTheme(newTheme);
                  });

                  // Clean up after transition
                  transition.finished.finally(() => {
                    document.body.classList.remove('transitioning');
                    document.documentElement.style.removeProperty('--transition-origin-x');
                    document.documentElement.style.removeProperty('--transition-origin-y');
                  });
                }}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-white/90 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-muted transition-all cursor-pointer"
                aria-label="Toggle theme"
              >
                <span className="text-base">{theme === 'dark' ? '☀️' : '🌙'}</span>
              </button>

              {/* Cart Icon Mobile with Preview */}
              <CartButton
                cartItemCount={cartItemCount}
                cartItems={cartItems}
                cartTotal={cartTotal}
                productionName={productionName}
                wordCount={wordCount}
                region={region}
                extras={extras}
                selectedVoiceover={selectedVoiceover}
              />

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[98] lg:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white dark:bg-background shadow-xl z-[99] lg:hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-border">
                <Link href="/" onClick={() => setIsOpen(false)} className="group">
                  <span className="font-instrument-serif">
                    <span className="text-3xl text-primary font-normal">Fourteen</span>{' '}
                    <span className="text-2xl text-foreground italic font-light">Voices</span>
                  </span>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
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
                        onClick={() => setIsOpen(false)}
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
                    onClick={() => setIsOpen(false)}
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
                  onClick={() => setIsOpen(false)}
                  className="font-bricolage block w-full text-center bg-gray-100 hover:bg-gray-200 dark:bg-muted dark:hover:bg-muted/80 text-[var(--foreground)] px-6 py-3 rounded-lg text-base font-medium transition-all cursor-pointer"
                >
                  Login
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
