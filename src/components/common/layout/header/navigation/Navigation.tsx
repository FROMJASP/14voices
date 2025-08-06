'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Instrument_Serif, Bricolage_Grotesque } from 'next/font/google';
import { useCart } from '@/contexts/CartContext';
import { CartButton } from '@/components/domains/cart';
import { Logo } from '../logo';
import { ThemeToggle } from './ThemeToggle';
import { MobileMenu } from './MobileMenu';
import type { NavigationProps } from './Navigation.types';

// Font configurations
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

// Default navigation items
const defaultMenuItems = [
  { label: 'Voiceovers', href: '#voiceovers' },
  { label: 'Prijzen', href: '#prijzen' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
];

export function Navigation({ menuItems = defaultMenuItems, className = '' }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cart = useCart();

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
      `}</style>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-[100] bg-white dark:bg-background transition-all duration-300 ${
          isScrolled ? 'border-b border-gray-200 dark:border-border shadow-sm' : ''
        } ${instrumentSerif.variable} ${bricolageGrotesque.variable} ${className}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Logo />

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
              <ThemeToggle />

              {/* Cart Icon */}
              <CartButton {...cart} />

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
              <ThemeToggle />
              <CartButton {...cart} />
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

      {/* Mobile Menu */}
      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} menuItems={menuItems} />
    </>
  );
}
