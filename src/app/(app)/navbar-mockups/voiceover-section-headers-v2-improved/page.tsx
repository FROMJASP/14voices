'use client';

import React, { useState } from 'react';
import { VoiceoverSectionHeaderV2ImprovedA } from '@/components/mockups/VoiceoverSectionHeaderV2ImprovedA';
import { VoiceoverSectionHeaderV2ImprovedB } from '@/components/mockups/VoiceoverSectionHeaderV2ImprovedB';
import { VoiceoverSectionHeaderV2ImprovedC } from '@/components/mockups/VoiceoverSectionHeaderV2ImprovedC';
import { VoiceoverSectionHeaderV2ImprovedD } from '@/components/mockups/VoiceoverSectionHeaderV2ImprovedD';
import { VoiceoverSectionHeaderV2ImprovedE } from '@/components/mockups/VoiceoverSectionHeaderV2ImprovedE';

const mockTags = [
  'Warm & Vriendelijk',
  'Zakelijk',
  'Jong & Energiek',
  'Helder',
  'Diep & Krachtig',
  'Speels',
  'Verhalend',
  'Commercieel',
  'Documentaire',
  'Meertalig',
  'Karakterstem',
  'Natuurlijk',
];

export default function VoiceoverSectionHeaderV2ImprovedMockups() {
  const [currentDesign, setCurrentDesign] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [searchQuery, setSearchQuery] = useState('');

  const designs = [
    {
      id: 1,
      name: 'Enhanced Spacing & Gradient',
      description: 'Improved spacing with gradient title and animated filter panel',
      component: VoiceoverSectionHeaderV2ImprovedA,
    },
    {
      id: 2,
      name: 'Compact Side-by-Side',
      description: 'Search and filter side-by-side with quick filter pills',
      component: VoiceoverSectionHeaderV2ImprovedB,
    },
    {
      id: 3,
      name: 'Integrated Sidebar',
      description: 'Filter categories as sidebar with counts and stats',
      component: VoiceoverSectionHeaderV2ImprovedC,
    },
    {
      id: 4,
      name: 'Visual Category Cards',
      description: 'Icon-based category cards with centered search',
      component: VoiceoverSectionHeaderV2ImprovedD,
    },
    {
      id: 5,
      name: 'Floating Panel',
      description: 'Modal filter panel with animated background elements',
      component: VoiceoverSectionHeaderV2ImprovedE,
    },
  ];

  const CurrentHeader = designs[currentDesign - 1].component;

  return (
    <div className="min-h-screen bg-[#fcf9f5] dark:bg-gray-950">
      {/* Design Selector */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-[60]">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
            V2 Improved Header Designs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            5 enhanced variations based on V2 with better spacing and design
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {designs.map((design) => (
              <button
                key={design.id}
                onClick={() => setCurrentDesign(design.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  currentDesign === design.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                V{design.id}
              </button>
            ))}
          </div>

          {/* Current Design Info */}
          <div className="text-center mt-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {designs[currentDesign - 1].name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {designs[currentDesign - 1].description}
            </p>
          </div>
        </div>
      </div>

      {/* Current Design Display */}
      <div className="container mx-auto px-4 py-12">
        <CurrentHeader
          allTags={mockTags}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Mock Voice Cards for Context */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-[3/4] bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Key Improvements */}
      <div className="bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Key Improvements from Original V2
          </h3>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                ✨ Better Spacing
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                More generous padding and margins throughout for improved visual hierarchy
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                🎨 Enhanced Typography
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Larger, bolder titles with gradient effects inspired by V1
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                🔽 Clear Dropdown Arrow
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                ChevronDown icon that rotates when filter panel is expanded
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="container mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Design Features Comparison
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">
                  Feature
                </th>
                {designs.map((design) => (
                  <th
                    key={design.id}
                    className="text-center py-4 px-4 font-medium text-gray-700 dark:text-gray-300"
                  >
                    V{design.id}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 dark:border-gray-800/50">
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Title Impact</td>
                <td className="text-center py-3 px-4">⭐⭐⭐</td>
                <td className="text-center py-3 px-4">⭐⭐</td>
                <td className="text-center py-3 px-4">⭐⭐⭐</td>
                <td className="text-center py-3 px-4">⭐⭐⭐</td>
                <td className="text-center py-3 px-4">⭐⭐⭐</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800/50">
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Filter UX</td>
                <td className="text-center py-3 px-4">⭐⭐⭐</td>
                <td className="text-center py-3 px-4">⭐⭐⭐</td>
                <td className="text-center py-3 px-4">⭐⭐</td>
                <td className="text-center py-3 px-4">⭐⭐⭐</td>
                <td className="text-center py-3 px-4">⭐⭐⭐</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800/50">
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Visual Appeal</td>
                <td className="text-center py-3 px-4">⭐⭐⭐</td>
                <td className="text-center py-3 px-4">⭐⭐</td>
                <td className="text-center py-3 px-4">⭐⭐</td>
                <td className="text-center py-3 px-4">⭐⭐⭐</td>
                <td className="text-center py-3 px-4">⭐⭐⭐</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Mobile Friendly</td>
                <td className="text-center py-3 px-4">⭐⭐⭐</td>
                <td className="text-center py-3 px-4">⭐⭐⭐</td>
                <td className="text-center py-3 px-4">⭐⭐</td>
                <td className="text-center py-3 px-4">⭐⭐</td>
                <td className="text-center py-3 px-4">⭐⭐</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* All Designs Preview */}
      <div className="bg-gray-50 dark:bg-gray-900 py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            All Design Variations
          </h3>

          <div className="space-y-20">
            {designs.map((design) => {
              const HeaderComponent = design.component;
              return (
                <div
                  key={design.id}
                  className="border-b border-gray-200 dark:border-gray-800 pb-20 last:border-0"
                >
                  <div className="mb-6 text-center">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      V{design.id}: {design.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">{design.description}</p>
                  </div>

                  <div className="bg-[#fcf9f5] dark:bg-gray-950 rounded-xl p-8">
                    <HeaderComponent
                      allTags={mockTags}
                      selectedCategory="Alle"
                      onCategoryChange={() => {}}
                      searchQuery=""
                      onSearchChange={() => {}}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
