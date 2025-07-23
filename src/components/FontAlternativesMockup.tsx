'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Instrument_Serif, Inter, Outfit, DM_Sans, Manrope, Sora, Space_Grotesk } from 'next/font/google';

const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
});

const inter = Inter({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const outfit = Outfit({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

const dmSans = DM_Sans({
  weight: ['400', '500', '600'],
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

const sora = Sora({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sora',
});

const spaceGrotesk = Space_Grotesk({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

const menuItems = [
  { label: 'Voiceovers', href: '#voiceovers' },
  { label: 'Prijzen', href: '#prijzen' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
];

interface NavbarMockupProps {
  fontFamily: string;
  fontName: string;
  fontVariable: string;
  description: string;
}

function NavbarMockup({ fontFamily, fontName, fontVariable, description }: NavbarMockupProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  return (
    <div className="mb-16">
      <h3 className="text-2xl font-bold mb-2">{fontName}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      
      <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <nav
          className={`relative bg-white dark:bg-gray-950 transition-all duration-300 ${isScrolled ? 'border-b border-gray-200 dark:border-gray-800 shadow-sm' : ''} ${instrumentSerif.variable} ${fontVariable}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="group">
                <span className="font-instrument-serif">
                  <span className="text-4xl text-primary font-normal">Fourteen</span>{' '}
                  <span className="text-3xl text-gray-900 dark:text-white italic font-light">Voices</span>
                </span>
              </Link>

              {/* Desktop Menu */}
              <div className="hidden lg:flex items-center gap-8">
                {menuItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="text-base text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-medium transition-all relative group cursor-pointer"
                    style={{ fontFamily }}
                  >
                    <span className="relative z-10">{item.label}</span>
                    <span className="absolute inset-x-0 -bottom-1 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </Link>
                ))}
              </div>

              {/* Actions */}
              <div className="hidden lg:flex items-center gap-4">
                {/* Theme Toggle */}
                <button
                  className="p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
                  aria-label="Toggle theme"
                >
                  <span className="text-base">🌙</span>
                </button>

                {/* Login */}
                <Link
                  href="/login"
                  className="text-base text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-medium transition-all cursor-pointer px-4 py-2"
                  style={{ fontFamily }}
                >
                  Login
                </Link>

                {/* CTA Button */}
                <Link
                  href="/demo"
                  className="relative inline-flex items-center bg-primary text-white dark:text-black px-5 py-2.5 rounded-full text-base font-medium transition-all hover:bg-primary/90 hover:shadow-md cursor-pointer"
                  style={{ fontFamily }}
                >
                  Hoe het werkt?
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <button
                  className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Sample content to show font in context */}
        <div className="p-8 bg-gray-50 dark:bg-gray-900/50">
          <h2 className="text-3xl font-semibold mb-4" style={{ fontFamily }}>
            De ideale stem voor jouw project
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl" style={{ fontFamily }}>
            Nederlandse stemacteurs die jouw merk laten spreken. Perfect voor elke productie. 
            Upload je script, kies je stem, en ontvang professionele audio binnen 48 uur.
          </p>
          <div className="flex gap-4 mt-6">
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg font-medium" style={{ fontFamily }}>
              Bekijk stemmen
            </button>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg font-medium" style={{ fontFamily }}>
              Over ons
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FontAlternativesMockup() {
  const fonts = [
    {
      name: 'Inter',
      variable: inter.variable,
      fontFamily: 'var(--font-inter)',
      description: 'Clean, highly readable, perfect for UI. The current choice.',
    },
    {
      name: 'Outfit',
      variable: outfit.variable,
      fontFamily: 'var(--font-outfit)',
      description: 'Modern with geometric touches, slightly more personality than Inter.',
    },
    {
      name: 'DM Sans',
      variable: dmSans.variable,
      fontFamily: 'var(--font-dm-sans)',
      description: 'Geometric and friendly, great balance between professional and approachable.',
    },
    {
      name: 'Manrope',
      variable: manrope.variable,
      fontFamily: 'var(--font-manrope)',
      description: 'Soft and approachable with rounded edges, very readable.',
    },
    {
      name: 'Sora',
      variable: sora.variable,
      fontFamily: 'var(--font-sora)',
      description: 'Futuristic but clean, works well for tech-forward brands.',
    },
    {
      name: 'Space Grotesk',
      variable: spaceGrotesk.variable,
      fontFamily: 'var(--font-space-grotesk)',
      description: 'Unique and technical with interesting quirks, great for standing out.',
    },
  ];

  return (
    <div className={`min-h-screen bg-white dark:bg-gray-950 ${inter.variable} ${outfit.variable} ${dmSans.variable} ${manrope.variable} ${sora.variable} ${spaceGrotesk.variable}`}>
      <style jsx global>{`
        .font-instrument-serif {
          font-family: var(--font-instrument-serif);
          letter-spacing: 0.02em;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Font Alternatives for 14Voices</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Compare different typography options for the navbar and UI elements
          </p>
        </div>

        {fonts.map((font) => (
          <NavbarMockup
            key={font.name}
            fontName={font.name}
            fontFamily={font.fontFamily}
            fontVariable={font.variable}
            description={font.description}
          />
        ))}
      </div>
    </div>
  );
}