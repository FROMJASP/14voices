'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search, Instagram, Twitter, Linkedin, Facebook, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Add font options
import {
  Instrument_Serif,
  Inter,
  Poppins,
  DM_Sans,
  Manrope,
  Plus_Jakarta_Sans,
  Outfit,
} from 'next/font/google';

const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const poppins = Poppins({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

const dmSans = DM_Sans({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
});

const manrope = Manrope({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

const outfit = Outfit({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

const menuItems = [
  { label: 'Home', href: '/' },
  { label: 'Voiceovers', href: '#voiceovers' },
  { label: 'Prijzen', href: '#prijzen' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
];

export default function NavbarMockup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // This would normally be handled by a theme provider
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div
      className={`min-h-screen ${isDarkMode ? 'dark' : ''} ${instrumentSerif.variable} ${inter.variable} ${poppins.variable} ${dmSans.variable} ${manrope.variable} ${plusJakarta.variable} ${outfit.variable}`}
    >
      <style jsx global>{`
        .font-instrument-serif {
          font-family: var(--font-instrument-serif);
          letter-spacing: 0.02em;
        }
        .font-inter {
          font-family: var(--font-inter);
        }
        .font-poppins {
          font-family: var(--font-poppins);
        }
        .font-dm-sans {
          font-family: var(--font-dm-sans);
        }
        .font-manrope {
          font-family: var(--font-manrope);
        }
        .font-plus-jakarta {
          font-family: var(--font-plus-jakarta);
        }
        .font-outfit {
          font-family: var(--font-outfit);
        }
      `}</style>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        {/* Announcement Banner - Non-sticky */}
        <div className="group transition-all duration-300 bg-[#fcf9f5] dark:bg-card/50 hover:bg-foreground dark:hover:bg-[#fcf9f5] cursor-pointer">
          <div className="py-2 px-4 text-center">
            <p
              className={`text-lg md:text-xl font-instrument-serif text-foreground group-hover:text-background dark:group-hover:text-black transition-colors duration-300`}
            >
              <span className="text-sm">🚀</span>{' '}
              <span className="text-primary italic dark:group-hover:text-primary">
                14 Nieuwe Stemmen
              </span>
              . Beluister hier wat ze voor jou kunnen betekenen!
            </p>
          </div>
        </div>

        {/* Main Navbar */}
        <div className={`sticky top-0 z-50 ${isScrolled ? 'pt-6' : ''}`}>
          <nav
            className={`transition-all duration-300 ${
              isScrolled
                ? 'mx-auto max-w-5xl rounded-2xl bg-card/95 backdrop-blur-xl shadow-lg border border-border'
                : 'bg-card/80 backdrop-blur-xl border-b border-border'
            }`}
          >
            <div className={`${isScrolled ? 'px-6' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
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

                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 dark:hover:bg-muted transition-all cursor-pointer hover:scale-105"
                    aria-label="Toggle theme"
                  >
                    {isDarkMode ? '☀️' : '🌙'}
                  </button>
                  <Link
                    href="/login"
                    className="text-foreground/80 hover:text-foreground dark:text-foreground/70 dark:hover:text-foreground font-medium transition-all cursor-pointer hover:scale-105"
                  >
                    Login
                  </Link>
                  <Link
                    href="/demo"
                    className="relative inline-flex items-center bg-white dark:bg-card text-foreground px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-pointer group"
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
                className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-card shadow-xl z-50 lg:hidden flex flex-col"
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

                {/* Search Bar */}
                <div className="p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Zoek stemmen, talen, of functies..."
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-muted text-foreground placeholder-muted-foreground border-border border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* User Section */}
                <div className="px-4 pb-4 border-b border-border">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="p-2 rounded-full bg-muted">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Inloggen / Registreren</p>
                      <p className="text-sm text-muted-foreground">Toegang tot je account</p>
                    </div>
                  </Link>
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
                      className="block w-full text-center bg-white dark:bg-card text-foreground px-6 py-3 rounded-lg font-medium border border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-pointer"
                    >
                      Hoe het werkt?
                    </Link>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border">
                  {/* Social Links */}
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <a
                      href="#"
                      className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                  </div>

                  {/* Theme Toggle */}
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-all cursor-pointer hover:scale-[1.02]"
                  >
                    {isDarkMode ? '☀️' : '🌙'}
                    <span className="font-medium text-foreground">
                      {isDarkMode ? 'Light Mode' : 'Dark Mode'}
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
                <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
                  <div className="p-6">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Zoek stemmen, talen, of functies..."
                        className="w-full pl-12 pr-12 py-4 text-lg bg-muted/50 text-foreground placeholder-muted-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
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
                      <p className="text-sm text-muted-foreground mb-3">Populaire zoekopdrachten</p>
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
                            className="px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 text-foreground rounded-full transition-colors cursor-pointer"
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

        {/* Content */}
        <div className="pt-20 px-8 text-center text-foreground">
          <h2 className="text-4xl font-bold mb-4">Transparent Glass Navbar</h2>
          <p className="text-muted-foreground mb-8">
            Clean design with enhanced mobile menu and search functionality
          </p>

          {/* Navbar Font Variations */}
          <div className="max-w-4xl mx-auto mt-16 mb-16">
            <h3 className="text-2xl font-bold mb-8">Navbar Font Options</h3>
            <div className="space-y-8">
              {/* Current Font - Default */}
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Current Font (Default System Font)
                </p>
                <nav className="flex items-center gap-8">
                  {menuItems.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      className="text-foreground/80 hover:text-foreground font-medium transition-all"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Inter Font */}
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
                <p className="text-sm text-muted-foreground mb-4">Inter - Clean & Modern</p>
                <nav className="flex items-center gap-8">
                  {menuItems.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      className="font-inter text-foreground/80 hover:text-foreground font-medium transition-all"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Poppins Font */}
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
                <p className="text-sm text-muted-foreground mb-4">Poppins - Friendly & Rounded</p>
                <nav className="flex items-center gap-8">
                  {menuItems.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      className="font-poppins text-foreground/80 hover:text-foreground font-medium transition-all"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* DM Sans Font */}
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
                <p className="text-sm text-muted-foreground mb-4">
                  DM Sans - Geometric & Professional
                </p>
                <nav className="flex items-center gap-8">
                  {menuItems.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      className="font-dm-sans text-foreground/80 hover:text-foreground font-medium transition-all"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Manrope Font */}
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Manrope - Balanced & Contemporary
                </p>
                <nav className="flex items-center gap-8">
                  {menuItems.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      className="font-manrope text-foreground/80 hover:text-foreground font-medium transition-all"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Plus Jakarta Sans Font */}
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Plus Jakarta Sans - Modern & Elegant
                </p>
                <nav className="flex items-center gap-8">
                  {menuItems.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      className="font-plus-jakarta text-foreground/80 hover:text-foreground font-medium transition-all"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Outfit Font */}
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
                <p className="text-sm text-muted-foreground mb-4">Outfit - Bold & Distinctive</p>
                <nav className="flex items-center gap-8">
                  {menuItems.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      className="font-outfit text-foreground/80 hover:text-foreground font-medium transition-all"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Mixed Fonts Example */}
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Mixed Example: Plus Jakarta for Nav + Instrument Serif for Logo
                </p>
                <div className="flex items-center justify-between">
                  <div className="font-instrument-serif">
                    <span className="text-4xl text-primary font-normal">Fourteen</span>{' '}
                    <span className="text-3xl text-foreground italic font-light">Voices</span>
                  </div>
                  <nav className="flex items-center gap-8">
                    {menuItems.map((item, index) => (
                      <a
                        key={index}
                        href={item.href}
                        className="font-plus-jakarta text-foreground/80 hover:text-foreground font-medium transition-all"
                      >
                        {item.label}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>

          {/* Demo content */}
          <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🎙️', title: 'Premium Voices', desc: 'High-quality AI voices' },
              { icon: '⚡', title: 'Fast Delivery', desc: 'Get your audio in minutes' },
              { icon: '🌍', title: 'Multi-language', desc: '50+ languages supported' },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
