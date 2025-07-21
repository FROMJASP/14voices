'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Instrument_Serif, Plus_Jakarta_Sans } from 'next/font/google';

const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
});

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
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
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

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
        .font-plus-jakarta {
          font-family: var(--font-plus-jakarta), 'Plus Jakarta Sans', sans-serif;
        }
        /* Remove any gradient overlays or shadows */
        .sticky::before,
        .sticky::after {
          display: none !important;
        }
      `}</style>

      {/* Main Navbar */}
      <div
        className={`sticky top-0 z-50 ${isScrolled ? 'pt-6' : 'mt-6'} ${instrumentSerif.variable} ${plusJakarta.variable} transition-all duration-500 ease-in-out`}
        style={{ boxShadow: 'none' }}
      >
        <nav
          className={`relative transition-all duration-500 ease-in-out bg-white dark:bg-gray-950 ${
            isScrolled ? 'mx-auto max-w-5xl rounded-2xl shadow-lg' : 'shadow-none'
          }`}
          style={{
            backdropFilter: 'none',
            filter: 'none',
          }}
        >
          {/* Border overlay that fades in/out */}
          <div
            className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500 ease-in-out ${
              isScrolled ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              border: '1px solid rgb(var(--border) / var(--tw-border-opacity))',
            }}
          />
          <div
            className={`transition-all duration-500 ease-in-out ${isScrolled ? 'px-6' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}
          >
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="group">
                <span className="font-instrument-serif">
                  <span className="text-4xl text-primary font-normal">Fourteen</span>{' '}
                  <span className="text-3xl text-foreground italic font-light">Voices</span>
                </span>
              </Link>

              {/* Desktop Menu */}
              <div className="hidden lg:flex items-center gap-8">
                {menuItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="text-foreground/80 hover:text-foreground dark:text-foreground/70 dark:hover:text-foreground font-medium transition-all relative group cursor-pointer hover:scale-105"
                    style={{ fontFamily: 'var(--font-plus-jakarta)' }}
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary dark:bg-primary group-hover:w-full transition-all duration-300"></span>
                  </Link>
                ))}
              </div>

              {/* Actions */}
              <div className="hidden lg:flex items-center gap-4">
                {/* Search */}
                <button
                  onClick={() => setShowSearch(true)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors hover:bg-muted/50 cursor-pointer"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 dark:hover:bg-muted transition-all cursor-pointer hover:scale-105"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? '☀️' : '🌙'}
                </button>

                {/* Login */}
                <Link
                  href="/login"
                  className="text-foreground/80 hover:text-foreground dark:text-foreground/70 dark:hover:text-foreground font-medium transition-all cursor-pointer hover:scale-105"
                  style={{ fontFamily: 'var(--font-plus-jakarta)' }}
                >
                  Login
                </Link>

                {/* CTA Button */}
                <Link
                  href="/demo"
                  className="relative inline-flex items-center bg-white dark:bg-card text-foreground px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-pointer group"
                  style={{ fontFamily: 'var(--font-plus-jakarta)' }}
                >
                  <span className="font-medium">Hoe het werkt?</span>
                </Link>
              </div>

              {/* Mobile Actions */}
              <div className="lg:hidden flex items-center gap-2">
                <button
                  onClick={() => setShowSearch(true)}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all cursor-pointer"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-2 text-foreground hover:bg-muted/50 rounded-lg transition-all cursor-pointer"
                >
                  {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>

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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white dark:bg-gray-950 shadow-xl z-50 lg:hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <Link href="/" onClick={() => setIsOpen(false)} className="group">
                  <span className="font-instrument-serif">
                    <span className="text-3xl text-primary font-normal">Fourteen</span>{' '}
                    <span className="text-2xl text-foreground italic font-light">Voices</span>
                  </span>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  aria-label="Close mobile menu"
                >
                  <X className="w-6 h-6" />
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
                        className="block px-4 py-3 rounded-lg text-lg font-medium text-foreground hover:bg-muted transition-all cursor-pointer hover:scale-[1.02]"
                        style={{ fontFamily: 'var(--font-plus-jakarta)' }}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="px-8 py-4">
                  <Link
                    href="/demo"
                    onClick={() => setIsOpen(false)}
                    className="font-plus-jakarta block w-full text-center bg-white dark:bg-card text-foreground px-6 py-3 rounded-lg font-medium border border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-pointer"
                  >
                    Hoe het werkt?
                  </Link>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-border">
                {/* Theme Toggle */}
                <button
                  onClick={() => {
                    setTheme(theme === 'dark' ? 'light' : 'dark');
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-all cursor-pointer hover:scale-[1.02]"
                >
                  {theme === 'dark' ? '☀️' : '🌙'}
                  <span className="font-plus-jakarta font-medium text-foreground">
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {showSearch && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowSearch(false);
                setSearchQuery('');
              }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            />

            {/* Search Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-[70]"
            >
              <div className="bg-white dark:bg-gray-950 border border-border rounded-xl shadow-2xl overflow-hidden">
                <div className="p-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Zoek stemmen, talen, of functies..."
                      className="font-plus-jakarta w-full pl-12 pr-12 py-4 text-lg bg-muted/50 text-foreground placeholder-muted-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        setShowSearch(false);
                        setSearchQuery('');
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Search Suggestions */}
                  <div className="mt-4 space-y-2">
                    <p className="font-plus-jakarta text-sm text-muted-foreground mb-3">
                      Populaire zoekopdrachten
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Nederlandse stemmen',
                        'Commerciële voice-overs',
                        'AI stemmen',
                        'Snelle levering',
                      ].map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => setSearchQuery(suggestion)}
                          className="font-plus-jakarta px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 text-foreground rounded-full transition-colors cursor-pointer"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
