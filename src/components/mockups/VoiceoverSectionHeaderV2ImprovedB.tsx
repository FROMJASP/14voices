// Voiceover Section Header V2 Improved B: Compact Side-by-Side Layout
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronDown, Sparkles } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

interface VoiceoverSectionHeaderV2ImprovedBProps {
  allTags: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function VoiceoverSectionHeaderV2ImprovedB({
  allTags,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: VoiceoverSectionHeaderV2ImprovedBProps) {
  const [showFilters, setShowFilters] = useState(false);
  const activeFiltersCount = selectedCategory !== 'Alle' ? 1 : 0;

  return (
    <div className={`${plusJakarta.variable} font-plus-jakarta mb-16`}>
      {/* Title Section with Animation */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <div className="flex items-start justify-between">
          <div className="max-w-2xl">
            <h2 className="text-6xl md:text-7xl font-black leading-[0.9] mb-4">
              <span className="text-gray-900 dark:text-white">Ontdek de</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                perfecte stem
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Professionele voice-overs die jouw verhaal versterken
            </p>
          </div>

          {/* Floating Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="hidden lg:block"
          >
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
              <Sparkles className="w-4 h-4" />
              24 stemmen
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Search and Filter Row */}
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid lg:grid-cols-[1fr,auto] gap-4"
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Zoek een stem, stijl of eigenschap..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-14 pr-5 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-plus-jakarta text-gray-900 dark:text-white placeholder-gray-400 shadow-sm hover:shadow-md transition-all"
            />
            {searchQuery && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute right-5 top-1/2 transform -translate-y-1/2"
              >
                <button
                  onClick={() => onSearchChange('')}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <span className="text-xl">×</span>
                </button>
              </motion.div>
            )}
          </div>

          {/* Filter Toggle */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-4 rounded-2xl font-medium flex items-center gap-3 transition-all ${
              showFilters || activeFiltersCount > 0
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="px-2 py-0.5 bg-white/20 text-xs rounded-full">
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
            />
          </motion.button>
        </motion.div>

        {/* Quick Filter Pills (Always Visible) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
        >
          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center px-3">
            Snel filteren:
          </span>
          {allTags.slice(0, 5).map((tag) => (
            <button
              key={tag}
              onClick={() => onCategoryChange(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === tag
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Expandable Filter Grid */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -10 }}
            animate={{ height: 'auto', opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mt-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Alle categorieën</h3>
                <button
                  onClick={() => {
                    onCategoryChange('Alle');
                    setShowFilters(false);
                  }}
                  className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Wis filters
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <button
                  onClick={() => {
                    onCategoryChange('Alle');
                    setShowFilters(false);
                  }}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === 'Alle'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  ✨ Alle stemmen
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      onCategoryChange(tag);
                      setShowFilters(false);
                    }}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === tag
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
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

      {/* Active Filter Display */}
      <AnimatePresence>
        {selectedCategory !== 'Alle' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 flex items-center gap-2"
          >
            <span className="text-sm text-gray-600 dark:text-gray-400">Actief filter:</span>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                {selectedCategory}
              </span>
              <button
                onClick={() => onCategoryChange('Alle')}
                className="ml-1 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
