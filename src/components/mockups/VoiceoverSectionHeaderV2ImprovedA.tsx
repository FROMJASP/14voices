// Voiceover Section Header V2 Improved A: Enhanced Spacing & Gradient Title
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

interface VoiceoverSectionHeaderV2ImprovedAProps {
  allTags: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function VoiceoverSectionHeaderV2ImprovedA({
  allTags,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: VoiceoverSectionHeaderV2ImprovedAProps) {
  const [showFilters, setShowFilters] = useState(false);
  const activeFiltersCount = selectedCategory !== 'Alle' ? 1 : 0;

  return (
    <div className={`${plusJakarta.variable} font-plus-jakarta mb-20`}>
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-end mb-16">
        {/* Left: Enhanced Title */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-7xl md:text-8xl font-black leading-[0.85] mb-6"
          >
            <span className="text-gray-900 dark:text-white">Vind jouw</span>
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600">
              perfecte stem
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed"
          >
            24 professionele voice-overs voor commercials, documentaires en alles daartussen.
          </motion.p>
        </div>

        {/* Right: Search & Filter with Better Spacing */}
        <div className="space-y-5">
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
            <div className="relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Zoek op naam of stijl..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 font-plus-jakarta text-gray-900 dark:text-white placeholder-gray-400 shadow-sm hover:shadow-md transition-all duration-300"
              />
            </div>
          </motion.div>

          {/* Enhanced Filter Button */}
          <motion.button
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`w-full flex items-center justify-between px-6 py-5 rounded-2xl font-semibold transition-all duration-300 ${
              showFilters
                ? 'bg-purple-600 text-white shadow-xl shadow-purple-600/20'
                : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:shadow-lg'
            }`}
          >
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-2.5 py-0.5 bg-white/20 dark:bg-gray-900/20 backdrop-blur-sm text-xs rounded-full font-medium"
                >
                  {activeFiltersCount}
                </motion.span>
              )}
            </div>
            <motion.div animate={{ rotate: showFilters ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Expandable Filter Section with Better Design */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-3xl p-8 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Filter op stijl</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onCategoryChange('Alle');
                    setShowFilters(false);
                  }}
                  className={`px-5 py-3 rounded-xl font-medium transition-all ${
                    selectedCategory === 'Alle'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  Alle stemmen
                </motion.button>
                {allTags.map((tag, index) => (
                  <motion.button
                    key={tag}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onCategoryChange(tag);
                      setShowFilters(false);
                    }}
                    className={`px-5 py-3 rounded-xl font-medium transition-all ${
                      selectedCategory === tag
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    {tag}
                  </motion.button>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex gap-8">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Stemmen</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Categorieën</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
