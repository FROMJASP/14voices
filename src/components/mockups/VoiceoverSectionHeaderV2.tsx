// Voiceover Section Header V2: Split Screen Modern
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

interface VoiceoverSectionHeaderV2Props {
  allTags: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function VoiceoverSectionHeaderV2({
  allTags,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: VoiceoverSectionHeaderV2Props) {
  const [showFilters, setShowFilters] = useState(false);
  const activeFiltersCount = selectedCategory !== 'Alle' ? 1 : 0;

  return (
    <div className={`${plusJakarta.variable} font-plus-jakarta mb-16`}>
      <div className="grid lg:grid-cols-2 gap-8 items-end mb-12">
        {/* Left: Title */}
        <div>
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-6xl md:text-7xl font-black text-gray-900 dark:text-white leading-[0.9]"
          >
            Ontdek de
            <span className="block mt-2">
              perfecte{' '}
              <span className="relative">
                stem
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-30"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                />
              </span>
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-md"
          >
            Professionele voice-overs die jouw verhaal tot leven brengen.
          </motion.p>
        </div>

        {/* Right: Search & Filter */}
        <div className="space-y-4">
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Zoek stemmen..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-14 pr-5 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent font-plus-jakarta text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm"
            />
          </motion.div>

          {/* Filter Button */}
          <motion.button
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between px-5 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-black dark:hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5" />
              <span className="font-semibold">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            <motion.div animate={{ rotate: showFilters ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <X className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Expandable Filter Section */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Filter op stijl</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                <button
                  onClick={() => {
                    onCategoryChange('Alle');
                    setShowFilters(false);
                  }}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                    selectedCategory === 'Alle'
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                      : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  Alle stemmen
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      onCategoryChange(tag);
                      setShowFilters(false);
                    }}
                    className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                      selectedCategory === tag
                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                        : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
