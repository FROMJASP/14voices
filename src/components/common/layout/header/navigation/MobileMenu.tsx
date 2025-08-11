'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, ChevronDown, Mail } from 'lucide-react';
import { Instrument_Serif, Bricolage_Grotesque } from 'next/font/google';
import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import type { MenuItem } from './Navigation.types';
import type { InfoNavbarData } from '../info-navbar/InfoNavbar.types';

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
  infoNavbarData?: InfoNavbarData;
  navigationSettings?: {
    loginText?: string;
    loginUrl?: string;
    ctaButtonText?: string;
    ctaButtonUrl?: string;
  };
}

export function MobileMenu({
  isOpen,
  onClose,
  menuItems,
  infoNavbarData,
  navigationSettings = {
    loginText: 'Login',
    loginUrl: '/login',
    ctaButtonText: 'Mijn omgeving',
    ctaButtonUrl: '/dashboard',
  },
}: MobileMenuProps) {
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const toggleDropdown = (index: number) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

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
            onTouchMove={(e) => {
              // Prevent touch scrolling on backdrop
              e.preventDefault();
            }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] lg:hidden"
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              touchAction: 'none', // Prevent all touch interactions
            }}
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed top-0 right-0 bottom-0 w-full max-w-sm sm:max-w-md bg-white dark:bg-background shadow-xl z-[101] lg:hidden flex flex-col ${instrumentSerif.variable} ${bricolageGrotesque.variable}`}
            style={{
              top: 0,
              right: 0,
              bottom: 0,
              height: '100vh',
              overflow: 'hidden', // Changed from overflowY to overflow to prevent any scrolling on the container
            }}
            onTouchMove={(e) => {
              // Allow touch events within the menu (they'll be handled by the scrollable content)
              e.stopPropagation();
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-border">
              <Link href="/" onClick={onClose} className="group">
                <span
                  className="font-instrument-serif"
                  style={{
                    textDecoration: 'none',
                    fontSize: '28px',
                    fontWeight: '400',
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  FourteenVoices
                </span>
              </Link>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-muted transition-all"
                  aria-label="Close mobile menu"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-white" />
                </button>
              </div>
            </div>

            {/* Navigation Items */}
            <div
              className="flex-1 overflow-y-auto"
              style={{
                maxHeight: 'calc(100vh - 140px)',
                WebkitOverflowScrolling: 'touch', // Enable smooth scrolling on iOS
              }}
            >
              {/* Main Navigation - FIRST */}
              <div className="p-4">
                <h3 className="font-bricolage text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Navigatie
                </h3>
                <div className="space-y-1">
                  {menuItems.map((item, index) => {
                    const hasDropdown = item.hasDropdown;
                    const isExpanded = expandedItem === index;

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        {hasDropdown ? (
                          <div>
                            <button
                              onClick={() => toggleDropdown(index)}
                              className="font-bricolage w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium text-foreground hover:bg-muted transition-all cursor-pointer"
                            >
                              <span>{item.label}</span>
                              <ChevronDown
                                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              />
                            </button>
                            {isExpanded && (
                              <div className="mt-1 ml-4 space-y-1">
                                <div className="px-4 py-2 text-sm text-muted-foreground">
                                  Dropdown items will be configured later
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <Link
                            href={item.url}
                            onClick={onClose}
                            target={item.openInNewTab ? '_blank' : undefined}
                            rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                            className="font-bricolage block px-4 py-3 rounded-lg text-base font-medium text-foreground hover:bg-muted transition-all cursor-pointer"
                          >
                            {item.label}
                          </Link>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Contact Info - SECOND */}
              {infoNavbarData?.enabled &&
                (infoNavbarData.whatsappNumber || infoNavbarData.email) && (
                  <div className="p-4 border-t border-gray-200 dark:border-border">
                    <h3 className="font-bricolage text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Contact
                    </h3>
                    <div className="space-y-2">
                      {infoNavbarData.whatsappNumber && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <Link
                            href={`https://wa.me/${infoNavbarData.whatsappNumber.replace(/[^\d+]/g, '').replace('+', '')}`}
                            onClick={onClose}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bricolage flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="flex-shrink-0"
                            >
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            <span>{infoNavbarData.whatsappNumber}</span>
                          </Link>
                        </motion.div>
                      )}
                      {infoNavbarData.email && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 }}
                        >
                          <Link
                            href={`mailto:${infoNavbarData.email}`}
                            onClick={onClose}
                            className="font-bricolage flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
                          >
                            <Mail className="w-4 h-4 flex-shrink-0" />
                            <span>{infoNavbarData.email}</span>
                          </Link>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}

              {/* Overige links (formerly Snelle links) - THIRD */}
              {infoNavbarData?.enabled &&
                infoNavbarData.quickLinks &&
                infoNavbarData.quickLinks.length > 0 && (
                  <div className="p-4 border-t border-gray-200 dark:border-border">
                    <h3 className="font-bricolage text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Overige links
                    </h3>
                    <div className="space-y-1">
                      {infoNavbarData.quickLinks.map((link, index) => (
                        <motion.div
                          key={`quick-${index}`}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            href={link.url}
                            onClick={onClose}
                            target={link.openInNewTab ? '_blank' : undefined}
                            rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                            className="font-bricolage block px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
                          >
                            {link.label}
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-border">
              {/* Login Button */}
              {navigationSettings.loginText && navigationSettings.loginUrl && (
                <Link
                  href={navigationSettings.loginUrl}
                  onClick={onClose}
                  className="font-bricolage block w-full text-center bg-gray-100 hover:bg-gray-200 dark:bg-muted dark:hover:bg-muted/80 text-[var(--foreground)] px-6 py-3 rounded-lg text-base font-medium transition-all cursor-pointer"
                >
                  {navigationSettings.loginText}
                </Link>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
