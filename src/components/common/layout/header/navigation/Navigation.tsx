'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Instrument_Serif, Bricolage_Grotesque } from 'next/font/google';
import { useCart } from '@/contexts/CartContext';
import { ThemeToggle } from './ThemeToggle';
import { MobileMenu } from './MobileMenu';
import { NavigationItem } from './NavigationItem';
import type { NavigationProps, MenuItem } from './Navigation.types';

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
const defaultMenuItems: MenuItem[] = [
  {
    label: 'Voice-overs',
    url: '#voiceovers',
    hasDropdown: true,
  },
  { label: 'Prijzen', url: '/prijzen' },
];

export function Navigation({
  menuItems = defaultMenuItems,
  navigationSettings = {
    loginText: 'Login',
    loginUrl: '/login',
    ctaButtonText: 'Mijn omgeving',
    ctaButtonUrl: '/dashboard',
  },
  infoNavbarData,
  className = '',
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cart = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Simple body scroll lock and page blur effect
  useEffect(() => {
    const body = document.body;

    if (isOpen) {
      // Prevent scrolling and blur the page content
      body.style.overflow = 'hidden';
      body.classList.add('mobile-menu-open');
    } else {
      // Restore scrolling and remove blur
      body.style.overflow = '';
      body.classList.remove('mobile-menu-open');
    }

    // Cleanup on unmount
    return () => {
      body.style.overflow = '';
      body.classList.remove('mobile-menu-open');
    };
  }, [isOpen]);

  if (!mounted) return null;

  // Use navigation settings or fallback to defaults
  const items = navigationSettings?.mainMenuItems || menuItems;
  const loginText = navigationSettings?.loginText || 'Login';
  const loginUrl = navigationSettings?.loginUrl || '/login';

  return (
    <>
      <style jsx global>{`
        .font-instrument-serif {
          font-family: var(--font-instrument-serif);
          letter-spacing: -0.02em;
        }
        .font-bricolage {
          font-family: var(--font-bricolage), 'Bricolage Grotesque', sans-serif;
        }
      `}</style>

      {/* Main Navigation */}
      <nav
        className={`sticky top-0 z-[50] ${instrumentSerif.variable} ${bricolageGrotesque.variable} ${className}`}
        style={{
          backgroundColor: 'var(--background)',
          height: '64px', // Exact mockup height
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '64px', // Exact mockup height
            }}
          >
            {/* Left: Logo + Navigation Menu */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* Logo */}
              <Link
                href="/"
                className="font-instrument-serif"
                style={{
                  textDecoration: 'none',
                  fontSize: '32px',
                  fontWeight: '400',
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                FourteenVoices
              </Link>

              {/* Navigation Menu - Desktop */}
              <div
                className="hidden lg:flex"
                style={{
                  alignItems: 'center',
                  gap: '20px',
                  marginLeft: '48px',
                }}
              >
                {items.map((item, index) => (
                  <NavigationItem key={index} item={item} />
                ))}
              </div>
            </div>

            {/* Right: Actions */}
            <div
              className="hidden lg:flex"
              style={{
                alignItems: 'center',
                gap: '20px', // Exact mockup gap
              }}
            >
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Shopping Cart */}
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px',
                  color: 'var(--text-primary)',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {cart.cartItemCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '-2px',
                      backgroundColor: 'var(--primary)',
                      color: 'black',
                      fontSize: '10px',
                      fontWeight: '600',
                      padding: '2px 5px',
                      borderRadius: '8px',
                      minWidth: '16px',
                      textAlign: 'center',
                    }}
                  >
                    {cart.cartItemCount}
                  </span>
                )}
              </button>

              {/* Login Link */}
              <Link
                href={loginUrl}
                style={{
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '15px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
              >
                {loginText}
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex lg:hidden" style={{ alignItems: 'center', gap: '12px' }}>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px',
                  color: 'var(--text-primary)',
                  position: 'relative',
                }}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {cart.cartItemCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '-2px',
                      backgroundColor: 'var(--primary)',
                      color: 'black',
                      fontSize: '10px',
                      fontWeight: '600',
                      padding: '2px 5px',
                      borderRadius: '8px',
                      minWidth: '16px',
                      textAlign: 'center',
                    }}
                  >
                    {cart.cartItemCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px',
                  color: 'var(--text-primary)',
                }}
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        menuItems={items}
        infoNavbarData={infoNavbarData}
        navigationSettings={navigationSettings}
      />
    </>
  );
}
