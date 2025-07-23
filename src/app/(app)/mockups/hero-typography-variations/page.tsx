'use client';

import { useState } from 'react';

export default function HeroTypographyVariations() {
  const [activeVariation, setActiveVariation] = useState(1);

  const variations = [
    {
      id: 1,
      name: "Enhanced Hierarchy & Spacing",
      description: "Improved visual hierarchy with better spacing and font sizes"
    },
    {
      id: 2,
      name: "Split Layout with Emphasis",
      description: "Separated 'ideale' for stronger impact and brand focus"
    },
    {
      id: 3,
      name: "Minimalist & Clean",
      description: "Reduced elements with focus on core message"
    },
    {
      id: 4,
      name: "Dynamic Typography",
      description: "Mixed font weights and sizes for visual interest"
    },
    {
      id: 5,
      name: "Professional & Structured",
      description: "Corporate feel with clear sections and balanced layout"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Hero Typography Variations</h1>
            <div className="flex gap-2">
              {variations.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setActiveVariation(v.id)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    activeVariation === v.id
                      ? 'bg-black text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {v.id}
                </button>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {variations.find(v => v.id === activeVariation)?.description}
          </p>
        </div>
      </div>

      {/* Mockup Display */}
      <div className="py-12">
        {/* Variation 1: Enhanced Hierarchy & Spacing */}
        {activeVariation === 1 && (
          <div className="max-w-6xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="min-h-[600px] flex items-center justify-center p-16">
                <div className="text-center max-w-4xl">
                  {/* Process Steps - Smaller and more subtle */}
                  <div className="flex items-center justify-center gap-8 mb-16">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">1</div>
                      <span className="text-sm text-gray-600">Boek je stem</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm font-semibold">2</div>
                      <span className="text-sm text-gray-400">Upload script</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm font-semibold">3</div>
                      <span className="text-sm text-gray-400">Ontvang audio</span>
                    </div>
                  </div>

                  {/* Main Title - Improved spacing and size */}
                  <h1 className="mb-12">
                    <span className="text-7xl font-light text-gray-900 block mb-4">
                      De <span className="text-green-500 font-normal italic">ideale</span> stem
                    </span>
                    <span className="text-5xl font-light text-gray-700">
                      voor jouw instructievideo
                    </span>
                  </h1>

                  {/* Subtitle - Better contrast and spacing */}
                  <p className="text-xl text-gray-600 mb-16 leading-relaxed max-w-3xl mx-auto">
                    Op zoek naar een professionele voiceover? Vind een Nederlandse
                    stemacteur die jouw merk laat spreken!
                  </p>

                  {/* Features - More visual spacing */}
                  <div className="flex items-center justify-center gap-12 mb-16 text-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-green-500 text-xl">⚡</span>
                      <span className="font-medium">&lt;48u levering</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500 text-xl">⭐</span>
                      <span className="font-medium">9.1/10 beoordeeld</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-500 text-xl">🛡️</span>
                      <span className="font-medium">100% garantie</span>
                    </div>
                  </div>

                  {/* CTA Buttons - Larger and clearer */}
                  <div className="flex items-center justify-center gap-6">
                    <button className="bg-green-500 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-green-600 transition-all transform hover:scale-105 shadow-lg">
                      Bekijk stemmen →
                    </button>
                    <button className="text-gray-700 px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-100 transition-all flex items-center gap-2">
                      Over ons <span className="text-sm">ⓘ</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Variation 2: Split Layout with Emphasis */}
        {activeVariation === 2 && (
          <div className="max-w-6xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="min-h-[600px] flex items-center justify-center p-16">
                <div className="text-center max-w-5xl">
                  {/* Process Steps - Horizontal line connection */}
                  <div className="flex items-center justify-center gap-4 mb-20 relative">
                    <div className="absolute inset-x-0 top-4 h-0.5 bg-gray-200 max-w-md mx-auto"></div>
                    <div className="relative bg-white px-4">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mb-2">1</div>
                      <span className="text-xs text-gray-600">Boek je stem</span>
                    </div>
                    <div className="relative bg-white px-4">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold mb-2">2</div>
                      <span className="text-xs text-gray-400">Upload script</span>
                    </div>
                    <div className="relative bg-white px-4">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold mb-2">3</div>
                      <span className="text-xs text-gray-400">Ontvang audio</span>
                    </div>
                  </div>

                  {/* Main Title - Split design */}
                  <div className="mb-16">
                    <h1 className="text-8xl font-bold text-gray-900 mb-6">
                      De <span className="text-green-500 italic font-light block text-9xl my-4">ideale</span> stem
                    </h1>
                    <p className="text-3xl font-light text-gray-700">
                      voor jouw instructievideo
                    </p>
                  </div>

                  {/* Subtitle */}
                  <p className="text-lg text-gray-500 mb-16 max-w-2xl mx-auto leading-relaxed">
                    Op zoek naar een professionele voiceover? Vind een Nederlandse
                    stemacteur die jouw merk laat spreken!
                  </p>

                  {/* Features - Icon based */}
                  <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-16">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-green-600">⚡</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-700">&lt;48u levering</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-yellow-600">⭐</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-700">9.1/10 beoordeeld</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-blue-600">🛡️</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-700">100% garantie</p>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="space-y-4">
                    <button className="bg-green-500 text-white px-10 py-5 rounded-full text-xl font-semibold hover:bg-green-600 transition-all transform hover:scale-105 shadow-xl">
                      Bekijk stemmen →
                    </button>
                    <div>
                      <button className="text-gray-600 text-sm hover:text-gray-900 transition-colors">
                        Over ons →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Variation 3: Minimalist & Clean */}
        {activeVariation === 3 && (
          <div className="max-w-6xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="min-h-[600px] flex items-center justify-center p-16">
                <div className="max-w-3xl">
                  {/* Main Title - Ultra clean */}
                  <h1 className="text-6xl font-extralight text-gray-900 mb-8 leading-tight">
                    De <span className="text-green-500 font-normal">ideale</span> stem
                    <br />
                    voor jouw instructievideo
                  </h1>

                  {/* Subtitle */}
                  <p className="text-gray-600 mb-12 text-lg">
                    Professionele Nederlandse stemacteurs voor jouw merk.
                  </p>

                  {/* Simple features */}
                  <div className="flex gap-8 mb-12 text-sm text-gray-500">
                    <span>✓ Binnen 48 uur</span>
                    <span>✓ 9.1/10 score</span>
                    <span>✓ Garantie</span>
                  </div>

                  {/* Single CTA */}
                  <button className="bg-black text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-900 transition-colors">
                    Ontdek stemmen
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Variation 4: Dynamic Typography */}
        {activeVariation === 4 && (
          <div className="max-w-6xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="min-h-[600px] flex items-center justify-center p-16">
                <div className="text-center max-w-4xl">
                  {/* Process Pills */}
                  <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-6 py-3 mb-16">
                    <span className="text-green-600 font-bold">01</span>
                    <span className="text-sm text-gray-600">Boek</span>
                    <span className="text-gray-300">→</span>
                    <span className="text-gray-400 font-bold">02</span>
                    <span className="text-sm text-gray-400">Upload</span>
                    <span className="text-gray-300">→</span>
                    <span className="text-gray-400 font-bold">03</span>
                    <span className="text-sm text-gray-400">Ontvang</span>
                  </div>

                  {/* Dynamic Title */}
                  <h1 className="mb-12">
                    <span className="text-5xl font-black text-gray-900 uppercase tracking-tight">De</span>
                    <span className="text-8xl font-light text-green-500 italic block my-4">ideale</span>
                    <span className="text-5xl font-black text-gray-900 uppercase tracking-tight">stem</span>
                    <span className="text-2xl font-light text-gray-600 block mt-6">voor jouw instructievideo</span>
                  </h1>

                  {/* Tagline */}
                  <p className="text-lg text-gray-500 mb-16 font-light">
                    Nederlandse stemacteurs • Professionele kwaliteit • Snel geleverd
                  </p>

                  {/* Stats Cards */}
                  <div className="flex justify-center gap-4 mb-16">
                    <div className="bg-green-50 px-6 py-4 rounded-2xl">
                      <p className="text-2xl font-bold text-green-600">48u</p>
                      <p className="text-xs text-gray-600">levering</p>
                    </div>
                    <div className="bg-yellow-50 px-6 py-4 rounded-2xl">
                      <p className="text-2xl font-bold text-yellow-600">9.1</p>
                      <p className="text-xs text-gray-600">rating</p>
                    </div>
                    <div className="bg-blue-50 px-6 py-4 rounded-2xl">
                      <p className="text-2xl font-bold text-blue-600">100%</p>
                      <p className="text-xs text-gray-600">garantie</p>
                    </div>
                  </div>

                  {/* CTA Group */}
                  <div className="flex items-center justify-center gap-4">
                    <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-xl transition-all">
                      Start Nu
                    </button>
                    <button className="text-gray-500 hover:text-gray-700 transition-colors">
                      Meer info →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Variation 5: Professional & Structured */}
        {activeVariation === 5 && (
          <div className="max-w-6xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="min-h-[600px] p-16">
                {/* Top Section */}
                <div className="text-center mb-16">
                  {/* Process Bar */}
                  <div className="max-w-2xl mx-auto mb-12">
                    <div className="bg-gray-100 rounded-full p-1">
                      <div className="grid grid-cols-3 gap-1">
                        <div className="bg-green-500 text-white rounded-full py-2 px-4 text-center">
                          <p className="text-xs font-semibold">Stap 1: Selecteer</p>
                        </div>
                        <div className="bg-gray-100 text-gray-400 rounded-full py-2 px-4 text-center">
                          <p className="text-xs">Stap 2: Upload</p>
                        </div>
                        <div className="bg-gray-100 text-gray-400 rounded-full py-2 px-4 text-center">
                          <p className="text-xs">Stap 3: Ontvang</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">
                      De <span className="text-green-500 underline decoration-4 underline-offset-8">ideale</span> stem
                      <br />voor jouw instructievideo
                    </h1>
                    
                    <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                      Op zoek naar een professionele voiceover? Vind een Nederlandse
                      stemacteur die jouw merk laat spreken!
                    </p>

                    {/* Value Props Grid */}
                    <div className="grid grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
                      <div className="border border-gray-200 rounded-xl p-6">
                        <h3 className="font-bold text-gray-900 mb-2">Snel</h3>
                        <p className="text-3xl font-bold text-green-500 mb-1">&lt;48u</p>
                        <p className="text-sm text-gray-600">levering</p>
                      </div>
                      <div className="border border-gray-200 rounded-xl p-6">
                        <h3 className="font-bold text-gray-900 mb-2">Kwaliteit</h3>
                        <p className="text-3xl font-bold text-yellow-500 mb-1">9.1/10</p>
                        <p className="text-sm text-gray-600">beoordeling</p>
                      </div>
                      <div className="border border-gray-200 rounded-xl p-6">
                        <h3 className="font-bold text-gray-900 mb-2">Zekerheid</h3>
                        <p className="text-3xl font-bold text-blue-500 mb-1">100%</p>
                        <p className="text-sm text-gray-600">garantie</p>
                      </div>
                    </div>

                    {/* CTA Section */}
                    <div className="bg-gray-50 rounded-2xl p-8">
                      <p className="text-sm text-gray-600 mb-4">Klaar om te beginnen?</p>
                      <div className="flex items-center justify-center gap-4">
                        <button className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors">
                          Bekijk stemmen
                        </button>
                        <button className="bg-white text-gray-700 px-8 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors">
                          Over ons
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}