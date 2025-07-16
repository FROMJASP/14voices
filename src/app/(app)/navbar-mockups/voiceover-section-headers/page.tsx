'use client';

import React, { useState } from 'react';
import { VoiceoverSectionHeaderV1 } from '@/components/mockups/VoiceoverSectionHeaderV1';
import { VoiceoverSectionHeaderV2 } from '@/components/mockups/VoiceoverSectionHeaderV2';
import { VoiceoverSectionHeaderV3 } from '@/components/mockups/VoiceoverSectionHeaderV3';
import { VoiceoverSectionHeaderV4 } from '@/components/mockups/VoiceoverSectionHeaderV4';
import { VoiceoverSectionHeaderV5 } from '@/components/mockups/VoiceoverSectionHeaderV5';

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

export default function VoiceoverSectionHeaderMockups() {
  const [currentDesign, setCurrentDesign] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [searchQuery, setSearchQuery] = useState('');

  const designs = [
    {
      id: 1,
      name: 'Minimalist Elegance',
      description: 'Clean centered design with gradient text and floating search',
      component: VoiceoverSectionHeaderV1,
    },
    {
      id: 2,
      name: 'Split Screen Modern',
      description: 'Two-column layout with expandable filter drawer',
      component: VoiceoverSectionHeaderV2,
    },
    {
      id: 3,
      name: 'Interactive Tag Cloud',
      description: 'Playful cloud layout with integrated search and animations',
      component: VoiceoverSectionHeaderV3,
    },
    {
      id: 4,
      name: 'Glassmorphic Live',
      description: 'Glass effects with recent searches and trending tags',
      component: VoiceoverSectionHeaderV4,
    },
    {
      id: 5,
      name: 'Bento Grid Style',
      description: 'Card-based layout with quick filters and stats',
      component: VoiceoverSectionHeaderV5,
    },
  ];

  const CurrentHeader = designs[currentDesign - 1].component;

  return (
    <div className="min-h-screen bg-[#fcf9f5] dark:bg-gray-950">
      {/* Design Selector */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Voiceover Section Header Designs
          </h1>

          <div className="flex flex-wrap justify-center gap-3">
            {designs.map((design) => (
              <button
                key={design.id}
                onClick={() => setCurrentDesign(design.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  currentDesign === design.id
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                V{design.id}
              </button>
            ))}
          </div>

          {/* Current Design Info */}
          <div className="text-center mt-4">
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

      {/* All Designs Preview */}
      <div className="bg-gray-50 dark:bg-gray-900 py-20 mt-20">
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
                  <div className="mb-6">
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

      {/* Design Features Comparison */}
      <div className="container mx-auto px-4 py-20">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Design Features
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
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Search prominence</td>
                <td className="text-center py-3 px-4">⭐⭐⭐</td>
                <td className="text-center py-3 px-4">⭐⭐</td>
                <td className="text-center py-3 px-4">⭐⭐⭐</td>
                <td className="text-center py-3 px-4">⭐⭐⭐</td>
                <td className="text-center py-3 px-4">⭐⭐</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800/50">
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Filter accessibility</td>
                <td className="text-center py-3 px-4">⭐⭐⭐</td>
                <td className="text-center py-3 px-4">⭐⭐</td>
                <td className="text-center py-3 px-4">⭐⭐⭐</td>
                <td className="text-center py-3 px-4">⭐⭐⭐</td>
                <td className="text-center py-3 px-4">⭐⭐⭐</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800/50">
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Visual impact</td>
                <td className="text-center py-3 px-4">⭐⭐</td>
                <td className="text-center py-3 px-4">⭐⭐⭐</td>
                <td className="text-center py-3 px-4">⭐⭐⭐</td>
                <td className="text-center py-3 px-4">⭐⭐⭐</td>
                <td className="text-center py-3 px-4">⭐⭐⭐</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Mobile friendly</td>
                <td className="text-center py-3 px-4">⭐⭐⭐</td>
                <td className="text-center py-3 px-4">⭐⭐</td>
                <td className="text-center py-3 px-4">⭐⭐</td>
                <td className="text-center py-3 px-4">⭐⭐⭐</td>
                <td className="text-center py-3 px-4">⭐⭐</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
