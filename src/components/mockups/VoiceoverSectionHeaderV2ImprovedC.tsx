// Voiceover Section Header V2 Improved C: Integrated Filter Sidebar
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LayoutGrid, ChevronDown, Check } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

interface VoiceoverSectionHeaderV2ImprovedCProps {
  allTags: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function VoiceoverSectionHeaderV2ImprovedC({
  allTags,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: VoiceoverSectionHeaderV2ImprovedCProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className={`${plusJakarta.variable} font-plus-jakarta mb-16`}>
      <div className="grid lg:grid-cols-[1.5fr,1fr] gap-8 lg:gap-12 items-start">
        {/* Left: Title and Search */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl md:text-8xl font-black leading-[0.85] mb-8"
          >
            <span className="text-gray-900 dark:text-white">Vind de</span>
            <motion.span
              className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
              initial={{ backgroundPosition: '0%' }}
              animate={{ backgroundPosition: '100%' }}
              transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
              style={{ backgroundSize: '200% 200%' }}
            >
              perfecte stem
            </motion.span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed"
          >
            Professionele stemmen die jouw merk tot leven brengen
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative max-w-xl"
          >
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Zoek op naam, stijl of taal..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-14 pr-5 py-5 bg-white dark:bg-gray-800/50 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 text-gray-900 dark:text-white placeholder-gray-400 shadow-lg hover:shadow-xl transition-all"
            />
            <div className="absolute inset-y-0 right-0 pr-5 flex items-center">
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded">
                <span>⌘</span>K
              </kbd>
            </div>
          </motion.div>
        </div>

        {/* Right: Filter Panel */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <LayoutGrid className="w-5 h-5" />
              Categorieën
            </h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronDown
                className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          <div className={`space-y-1 ${!showFilters ? 'hidden lg:block' : ''}`}>
            <button
              onClick={() => onCategoryChange('Alle')}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-between group ${
                selectedCategory === 'Alle'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <span>Alle stemmen</span>
              <span
                className={`text-sm ${selectedCategory === 'Alle' ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}
              >
                24
              </span>
            </button>

            {allTags.slice(0, 8).map((tag, index) => (
              <motion.button
                key={tag}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                onClick={() => onCategoryChange(tag)}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-between group ${
                  selectedCategory === tag
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  {selectedCategory === tag && <Check className="w-4 h-4" />}
                  {tag}
                </span>
                <span
                  className={`text-sm ${selectedCategory === tag ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  {Math.floor(Math.random() * 8) + 1}
                </span>
              </motion.button>
            ))}

            {allTags.length > 8 && (
              <button
                onClick={() => setShowFilters(true)}
                className="w-full text-left px-4 py-3 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl font-medium transition-colors"
              >
                Toon alle {allTags.length} categorieën →
              </button>
            )}
          </div>

          {/* Filter Stats */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Totaal stemmen</span>
              <span className="font-bold text-gray-900 dark:text-white">24</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile Filter Expansion */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden mt-6 overflow-hidden"
          >
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 space-y-2">
              {allTags.slice(8).map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    onCategoryChange(tag);
                    setShowFilters(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
                    selectedCategory === tag
                      ? 'bg-purple-600 text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
