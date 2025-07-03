'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

interface NavItem {
  label: string;
  href?: string;
  type: string;
  isAnchor?: boolean;
  newTab?: boolean;
  subItems?: NavItem[];
}

interface NavigationBarEnhancedProps {
  navItems: NavItem[];
  hasBanner?: boolean;
}

export function NavigationBarEnhanced({ navItems, hasBanner = false }: NavigationBarEnhancedProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const { handleAnchorClick, isActive } = useSmoothScroll({
    offset: 100,
    duration: 800,
  });

  useEffect(() => {
    const handleScroll = () => {
      // If there's a banner, we're scrolled when we pass it
      // Otherwise, we're scrolled after 10px
      const scrollThreshold = hasBanner ? 60 : 10;
      setIsScrolled(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasBanner]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    if (item.isAnchor) {
      handleAnchorClick(e);
    }
    setIsMobileMenuOpen(false);
  };

  const isLinkActive = (item: NavItem) => {
    if (item.isAnchor && pathname === '/') {
      const sectionId = item.href?.substring(2) || '';
      return isActive(sectionId);
    }
    return pathname === item.href;
  };

  const renderNavItem = (item: NavItem, index: number, isMobile = false) => {
    if (item.type === 'dropdown' && item.subItems) {
      return (
        <div key={index} className="relative group">
          <button
            className={cn(
              'flex items-center gap-1 font-medium transition-all duration-200',
              isMobile
                ? 'w-full text-left px-4 py-3 rounded-lg text-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                : 'text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 px-1'
            )}
            onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
          >
            {item.label}
            <ChevronDown
              className={cn(
                'w-4 h-4 transition-transform duration-200',
                openDropdown === item.label && 'rotate-180'
              )}
            />
          </button>

          {/* Desktop Dropdown */}
          {!isMobile && (
            <AnimatePresence>
              {openDropdown === item.label && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden z-50"
                >
                  {item.subItems.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      href={subItem.href || '#'}
                      target={subItem.newTab ? '_blank' : undefined}
                      onClick={(e) => handleNavClick(e, subItem)}
                      className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Mobile Dropdown */}
          {isMobile && openDropdown === item.label && (
            <div className="ml-4 mt-2 space-y-1">
              {item.subItems.map((subItem, subIndex) => (
                <Link
                  key={subIndex}
                  href={subItem.href || '#'}
                  target={subItem.newTab ? '_blank' : undefined}
                  onClick={(e) => handleNavClick(e, subItem)}
                  className="block px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  {subItem.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={index}
        href={item.href || '#'}
        target={item.newTab ? '_blank' : undefined}
        onClick={(e) => handleNavClick(e, item)}
        className={cn(
          'relative font-medium transition-all duration-200 group px-1',
          isMobile ? 'block px-4 py-3 rounded-lg text-lg' : '',
          isLinkActive(item)
            ? 'text-purple-600 dark:text-purple-400'
            : 'text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400',
          isMobile && 'hover:bg-slate-100 dark:hover:bg-slate-800'
        )}
      >
        <span className="relative">
          {item.label}
          {!isMobile && (
            <>
              {/* Hover effect - shimmer */}
              <span
                className={cn(
                  'absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                  'bg-gradient-to-r from-transparent via-purple-400/20 to-transparent',
                  'blur-sm'
                )}
              />
              {/* Active indicator */}
              <span
                className={cn(
                  'absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300',
                  isLinkActive(item) ? 'w-full' : 'w-0 group-hover:w-full'
                )}
              />
            </>
          )}
        </span>
      </Link>
    );
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-lg'
            : hasBanner
              ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md'
              : 'bg-transparent',
          // Rounded corners when not scrolled
          !isScrolled && 'rounded-t-2xl overflow-hidden'
        )}
        style={{
          borderTopLeftRadius: isScrolled ? '0' : '1rem',
          borderTopRightRadius: isScrolled ? '0' : '1rem',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-white dark:bg-slate-900 p-2 rounded-full">
                  <Image
                    src="/favicon.svg"
                    alt="14voices"
                    width={28}
                    height={28}
                    className="w-7 h-7"
                  />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                14voices
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item, index) => renderNavItem(item, index))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Border beam effect when scrolled */}
        {isScrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-600 to-transparent opacity-50" />
        )}
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white dark:bg-slate-900 shadow-xl z-50 md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2"
                  >
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-full">
                      <Image
                        src="/favicon.svg"
                        alt="14voices"
                        width={20}
                        height={20}
                        className="w-5 h-5 invert"
                      />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      14voices
                    </span>
                  </Link>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
                    aria-label="Close mobile menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-6 space-y-2">
                    {navItems.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {renderNavItem(item, index, true)}
                      </motion.div>
                    ))}
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
