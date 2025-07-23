'use client';

import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

export function VoiceoverShowcaseMockups() {
  return (
    <div className="space-y-20 p-8 bg-gray-50">
      {/* Mockup 1: Centered Compact */}
      <div className="bg-white p-12 rounded-lg shadow-lg">
        <h3 className="text-sm font-bold mb-4 text-gray-500">MOCKUP 1: Centered Compact</h3>
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div>
            <h2 className="text-5xl md:text-6xl font-black leading-tight mb-4">
              Vind jouw ideale stem
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              14 professioneel getrainde voice-overs voor jouw commercial, documentaire en alles daartussenin.
            </p>
          </div>
          <div className="flex gap-4 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Zoek op naam of stijl..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg"
              />
            </div>
            <button className="px-6 py-3 bg-gray-900 text-white rounded-lg flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Mockup 2: Left-Aligned with Vertical Spacing */}
      <div className="bg-white p-12 rounded-lg shadow-lg">
        <h3 className="text-sm font-bold mb-4 text-gray-500">MOCKUP 2: Left-Aligned Vertical</h3>
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl space-y-10">
            <div>
              <h2 className="text-6xl md:text-7xl font-black leading-[0.9] mb-6">
                Vind jouw<br />ideale stem
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                14 professioneel getrainde voice-overs voor jouw<br />
                commercial, documentaire en alles daartussenin.
              </p>
            </div>
            <div className="space-y-4 max-w-xl">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Zoek op naam of stijl..."
                  className="w-full pl-14 pr-5 py-4 border-2 border-gray-200 rounded-xl"
                />
              </div>
              <button className="w-full px-6 py-4 bg-gray-900 text-white rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                </div>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mockup 3: Split Layout Horizontal */}
      <div className="bg-white p-12 rounded-lg shadow-lg">
        <h3 className="text-sm font-bold mb-4 text-gray-500">MOCKUP 3: Split Horizontal</h3>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            <div className="flex-1">
              <h2 className="text-5xl md:text-6xl font-black leading-tight mb-4">
                Vind jouw ideale stem
              </h2>
              <p className="text-lg text-gray-600">
                14 professioneel getrainde voice-overs voor jouw commercial, documentaire en alles daartussenin.
              </p>
            </div>
            <div className="flex-1 w-full lg:max-w-md">
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Zoek op naam of stijl..."
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg"
                  />
                </div>
                <button className="w-full px-5 py-3.5 bg-gray-900 text-white rounded-lg flex items-center justify-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mockup 4: Minimalist with Inline Search */}
      <div className="bg-white p-12 rounded-lg shadow-lg">
        <h3 className="text-sm font-bold mb-4 text-gray-500">MOCKUP 4: Minimalist Inline</h3>
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-3">
              Vind jouw ideale stem
            </h2>
            <p className="text-gray-600">
              14 professioneel getrainde voice-overs voor jouw commercial, documentaire en alles daartussenin.
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Zoek op naam of stijl..."
                className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <button className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-md flex items-center gap-2 text-sm hover:bg-gray-200">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Mockup 5: Stacked with Enhanced Typography */}
      <div className="bg-white p-12 rounded-lg shadow-lg">
        <h3 className="text-sm font-bold mb-4 text-gray-500">MOCKUP 5: Stacked Typography</h3>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-7xl md:text-8xl font-black leading-[0.85] mb-8">
              <span className="block">Vind jouw</span>
              <span className="block text-gray-600 mt-2">ideale stem</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              14 professioneel getrainde voice-overs voor jouw commercial, documentaire en alles daartussenin.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-50 p-2 rounded-2xl flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Zoek op naam of stijl..."
                  className="w-full pl-14 pr-5 py-4 bg-white rounded-xl"
                />
              </div>
              <button className="px-8 py-4 bg-gray-900 text-white rounded-xl flex items-center justify-center gap-3 whitespace-nowrap">
                <SlidersHorizontal className="w-5 h-5" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}