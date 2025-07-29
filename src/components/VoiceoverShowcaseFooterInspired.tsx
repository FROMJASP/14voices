'use client';

import React from 'react';
import { Search, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

export function VoiceoverShowcaseFooterInspired() {
  return (
    <div className={`space-y-20 p-8 bg-gray-50 ${plusJakarta.variable}`}>
      {/* Variation 1: Footer-Style with Black Inputs */}
      <div className="bg-[#fcf9f5] p-12 rounded-lg shadow-lg font-plus-jakarta">
        <h3 className="text-sm font-bold mb-4 text-gray-500">
          VARIATION 1: Footer-Style Black Inputs
        </h3>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-7xl md:text-8xl font-black leading-[0.85] mb-8">
              <span className="block">Vind jouw</span>
              <span className="block text-gray-600 mt-2">ideale stem</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              14 professioneel getrainde voice-overs voor jouw commercial, documentaire en alles
              daartussenin.
            </p>
          </div>
          <div className="max-w-3xl mx-auto flex gap-4">
            <div className="flex-1 relative bg-black rounded-full border-2 border-black overflow-hidden">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Zoek op naam of stijl..."
                className="w-full pl-14 pr-6 py-4 bg-transparent text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
            <button className="px-8 py-4 bg-black text-white rounded-full border-2 border-black hover:bg-gray-900 flex items-center gap-3 whitespace-nowrap font-semibold">
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Variation 2: Minimal with Arrow Button */}
      <div className="bg-[#fcf9f5] p-12 rounded-lg shadow-lg font-plus-jakarta">
        <h3 className="text-sm font-bold mb-4 text-gray-500">
          VARIATION 2: Minimal with Arrow Button
        </h3>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-6xl md:text-7xl font-semibold leading-[0.9] mb-6">
              Vind jouw
              <br />
              ideale stem
            </h2>
            <p className="text-xl text-gray-600 max-w-xl mx-auto">
              14 professioneel getrainde voice-overs voor jouw commercial, documentaire en alles
              daartussenin.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="bg-black rounded-full flex items-center border-2 border-black overflow-hidden">
              <Search className="absolute left-6 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Zoek op naam of stijl..."
                className="flex-1 pl-14 pr-4 py-4 bg-transparent text-white placeholder-gray-400 focus:outline-none"
              />
              <button className="px-6 bg-white text-black hover:bg-gray-100 transition-colors h-full flex items-center justify-center">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <button className="mt-4 mx-auto flex items-center gap-2 text-lg font-medium hover:gap-3 transition-all">
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filter stemmen</span>
            </button>
          </div>
        </div>
      </div>

      {/* Variation 3: Two-Tone with Border */}
      <div className="bg-[#fcf9f5] p-12 rounded-lg shadow-lg font-plus-jakarta">
        <h3 className="text-sm font-bold mb-4 text-gray-500">
          VARIATION 3: Two-Tone with Border Accent
        </h3>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 pb-12 border-b-2 border-gray-200">
            <h2 className="text-7xl md:text-8xl font-black leading-[0.85] mb-6">
              <span className="block">Vind jouw</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-900 mt-2">
                ideale stem
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              14 professioneel getrainde voice-overs voor jouw commercial, documentaire en alles
              daartussenin.
            </p>
          </div>
          <div className="max-w-3xl mx-auto flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Zoek op naam of stijl..."
                className="w-full pl-14 pr-5 py-4 bg-white border-2 border-gray-900 rounded-full focus:outline-none focus:border-black"
              />
            </div>
            <button className="px-8 py-4 bg-gray-900 text-white rounded-full hover:bg-black transition-colors flex items-center gap-3 whitespace-nowrap font-semibold">
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Variation 4: Clean White on Light Background */}
      <div className="bg-[#fcf9f5] p-12 rounded-lg shadow-lg font-plus-jakarta">
        <h3 className="text-sm font-bold mb-4 text-gray-500">VARIATION 4: Clean White Inputs</h3>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-7xl md:text-8xl font-black leading-[0.85] mb-8">
              <span className="block text-gray-900">Vind jouw</span>
              <span className="block text-gray-700 mt-2">ideale stem</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
              14 professioneel getrainde voice-overs voor jouw commercial, documentaire en alles
              daartussenin.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Zoek op naam of stijl..."
                  className="w-full pl-14 pr-5 py-4 bg-gray-50 rounded-xl focus:outline-none focus:bg-white transition-colors"
                />
              </div>
              <button className="px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-3 whitespace-nowrap font-semibold">
                <SlidersHorizontal className="w-5 h-5" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Variation 5: Premium Minimal */}
      <div className="bg-[#fcf9f5] p-12 rounded-lg shadow-lg font-plus-jakarta">
        <h3 className="text-sm font-bold mb-4 text-gray-500">VARIATION 5: Premium Minimal</h3>
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <h2 className="text-6xl md:text-7xl font-medium leading-[0.9] mb-6 text-center">
              Vind jouw ideale stem
            </h2>
            <p className="text-xl text-gray-600 text-center max-w-2xl mx-auto">
              14 professioneel getrainde voice-overs voor jouw commercial, documentaire en alles
              daartussenin.
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="relative">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Zoek op naam of stijl..."
                className="w-full pl-8 pr-4 py-4 bg-transparent border-b-2 border-gray-300 focus:border-gray-900 focus:outline-none transition-colors text-lg"
              />
            </div>
            <div className="flex justify-center">
              <button className="text-lg font-medium hover:font-semibold transition-all flex items-center gap-3 group">
                <SlidersHorizontal className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                <span>Filter stemmen</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
