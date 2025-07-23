'use client';

import React, { useState } from 'react';
import { Search, Star, Zap, Menu, X, Check, Filter, ChevronDown, Mic, Music, Sparkles, Play, Headphones, Globe, Clock, Shield, Award, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { VoiceoverCard } from './VoiceoverCard';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

// Sample voice data
const sampleVoices = [
  { id: '1', name: 'Gina', slug: 'gina', profilePhoto: null, tags: ['Warm', 'Vriendelijk'], beschikbaar: true, availabilityText: 'Direct beschikbaar', demos: [{ id: '1', title: 'Commercial', url: '#', duration: '0:30' }] },
  { id: '2', name: 'Sophie', slug: 'sophie', profilePhoto: null, tags: ['Helder', 'Professioneel'], beschikbaar: true, availabilityText: 'Direct beschikbaar', demos: [{ id: '1', title: 'Commercial', url: '#', duration: '0:30' }] },
  { id: '3', name: 'Mark', slug: 'mark', profilePhoto: null, tags: ['Autoriteit', 'Zakelijk'], beschikbaar: true, availabilityText: 'Direct beschikbaar', demos: [{ id: '1', title: 'Commercial', url: '#', duration: '0:30' }] },
  { id: '4', name: 'Lisa', slug: 'lisa', profilePhoto: null, tags: ['Jong', 'Energiek'], beschikbaar: true, availabilityText: 'Direct beschikbaar', demos: [{ id: '1', title: 'Commercial', url: '#', duration: '0:30' }] },
  { id: '5', name: 'Tom', slug: 'tom', profilePhoto: null, tags: ['Warm', 'Betrouwbaar'], beschikbaar: true, availabilityText: 'Direct beschikbaar', demos: [{ id: '1', title: 'Commercial', url: '#', duration: '0:30' }] },
  { id: '6', name: 'Eva', slug: 'eva', profilePhoto: null, tags: ['Urban', 'Modern'], beschikbaar: true, availabilityText: 'Direct beschikbaar', demos: [{ id: '1', title: 'Commercial', url: '#', duration: '0:30' }] },
  { id: '7', name: 'Jan', slug: 'jan', profilePhoto: null, tags: ['Autoriteit', 'Ervaren'], beschikbaar: true, availabilityText: 'Direct beschikbaar', demos: [{ id: '1', title: 'Commercial', url: '#', duration: '0:30' }] },
  { id: '8', name: 'Nina', slug: 'nina', profilePhoto: null, tags: ['Helder', 'Vriendelijk'], beschikbaar: true, availabilityText: 'Direct beschikbaar', demos: [{ id: '1', title: 'Commercial', url: '#', duration: '0:30' }] },
];

// Extended style tags
const allStyles = [
  'Warm', 'Vriendelijk', 'Helder', 'Professioneel', 'Autoriteit', 'Zakelijk', 
  'Jong', 'Energiek', 'Urban', 'Modern', 'Betrouwbaar', 'Ervaren',
  'Speels', 'Serieus', 'Natuurlijk', 'Karaktervol', 'Diep', 'Licht'
];

export function VoiceoverVersion4Variations() {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev => 
      prev.includes(style) 
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  return (
    <div className={`space-y-24 bg-gray-50 dark:bg-gray-900 ${plusJakarta.variable} font-plus-jakarta`}>
      
      {/* Version 1: Minimalist Hero with Inline Filters */}
      <div className="bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-2 h-2 bg-[#18f109] rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Direct beschikbaar</span>
              <div className="w-2 h-2 bg-[#18f109] rounded-full animate-pulse" />
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              Vind jouw ideale stem
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12">
              Professionele voice-overs voor elk project. Van commercials tot documentaires.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Zoek op naam, stijl of taal..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-full text-lg focus:outline-none focus:ring-4 focus:ring-[#18f109]/20 focus:bg-white dark:focus:bg-gray-700 transition-all"
                />
              </div>
            </div>

            {/* Inline Style Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Populaire stijlen:</span>
              {allStyles.slice(0, 8).map((style) => (
                <button
                  key={style}
                  onClick={() => toggleStyle(style)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedStyles.includes(style)
                      ? 'bg-[#18f109] text-black'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {style}
                </button>
              ))}
              <button className="px-4 py-2 rounded-full text-sm font-medium bg-transparent border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
                Alle stijlen →
              </button>
            </div>
          </div>
        </div>

        {/* Voice Grid */}
        <div className="bg-gray-50 dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sampleVoices.map((voice) => (
                <VoiceoverCard
                  key={voice.id}
                  voice={voice}
                  isSelected={false}
                  onSelect={() => {}}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Version 2: Feature Cards Layout */}
      <div className="bg-[#fcf9f5] dark:bg-gray-950">
        {/* Hero with Feature Cards */}
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left: Content */}
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                Professionele stemmen voor elk project
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Ontdek 250+ stemacteurs. Direct beschikbaar voor jouw commercial, documentaire of bedrijfsvideo.
              </p>
              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#efd243]" />
                  <span className="font-semibold">4.9/5</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#18f109]" />
                  <span className="font-semibold">24u levertijd</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#ebaa3a]" />
                  <span className="font-semibold">15+ talen</span>
                </div>
              </div>
              <button className="px-8 py-4 bg-[#18f109] text-black rounded-xl font-semibold hover:bg-[#18f109]/90 transition-colors">
                Start een project
              </button>
            </div>

            {/* Right: Feature Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl">
                <Headphones className="w-10 h-10 text-[#18f109] mb-4" />
                <h3 className="font-semibold text-lg mb-2">Studio kwaliteit</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Professionele opnames in top studio's</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl">
                <Shield className="w-10 h-10 text-[#efd243] mb-4" />
                <h3 className="font-semibold text-lg mb-2">100% Garantie</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Niet tevreden? Gratis herziening</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl">
                <Users className="w-10 h-10 text-[#ebaa3a] mb-4" />
                <h3 className="font-semibold text-lg mb-2">Persoonlijk advies</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">We helpen je de perfecte stem te vinden</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl">
                <TrendingUp className="w-10 h-10 text-[#18f109] mb-4" />
                <h3 className="font-semibold text-lg mb-2">Flexibele prijzen</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Voor elk budget een oplossing</p>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Zoek stemmen..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#18f109]"
                />
              </div>
              <div className="flex gap-2">
                {['Warm', 'Zakelijk', 'Jong', 'Ervaren'].map((style) => (
                  <button
                    key={style}
                    onClick={() => toggleStyle(style)}
                    className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                      selectedStyles.includes(style)
                        ? 'bg-[#18f109] text-black'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {style}
                  </button>
                ))}
                <button className="px-6 py-3 rounded-xl text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100">
                  Meer filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Voice Grid */}
        <div className="bg-white dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sampleVoices.map((voice) => (
                <VoiceoverCard
                  key={voice.id}
                  voice={voice}
                  isSelected={false}
                  onSelect={() => {}}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Version 3: Video Background Hero */}
      <div className="bg-black">
        {/* Video Hero Section */}
        <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black" />
          
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[#18f109]" style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`
            }} />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center px-6 py-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#18f109]/20 backdrop-blur-sm rounded-full mb-8">
              <Play className="w-4 h-4 text-[#18f109]" />
              <span className="text-sm font-medium text-white">250+ professionele stemmen</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6">
              Geef je project<br />een stem
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
              Van impactvolle commercials tot meeslepende documentaires. Vind de perfecte stem voor jouw verhaal.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button className="px-8 py-4 bg-[#18f109] text-black rounded-xl font-semibold hover:bg-[#18f109]/90 transition-all flex items-center justify-center gap-2">
                <Mic className="w-5 h-5" />
                Ontdek stemmen
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20">
                Bekijk voorbeelden
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div>
                <p className="text-3xl font-bold text-[#18f109]">4.9/5</p>
                <p className="text-sm text-gray-400">Klantbeoordeling</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#efd243]">24u</p>
                <p className="text-sm text-gray-400">Snelle levering</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#ebaa3a]">10k+</p>
                <p className="text-sm text-gray-400">Projecten</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-gray-900 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Zoek op naam, stijl of project type..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#18f109] placeholder-gray-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Stijlen:</span>
                <div className="flex gap-2">
                  {['Alle', 'Commercieel', 'Documentaire', 'E-learning', 'Animatie'].map((type) => (
                    <button
                      key={type}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        type === 'Alle'
                          ? 'bg-[#18f109] text-black'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Voice Grid */}
        <div className="bg-gray-50 dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sampleVoices.map((voice) => (
                <VoiceoverCard
                  key={voice.id}
                  voice={voice}
                  isSelected={false}
                  onSelect={() => {}}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Version 4: Testimonial Hero */}
      <div className="bg-white dark:bg-gray-950">
        {/* Hero with Testimonial */}
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Main Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#18f109]/10 rounded-full mb-6">
                <Award className="w-4 h-4 text-[#18f109]" />
                <span className="text-sm font-medium text-[#18f109]">Marktleider in voice-overs</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                De stem die jouw merk versterkt
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Werk samen met Nederland's beste stemacteurs. Direct beschikbaar, professioneel en betaalbaar.
              </p>
              
              {/* Search with Style Dropdown */}
              <div className="flex gap-3 mb-8">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Zoek stemmen..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#18f109]"
                  />
                </div>
                <button className="px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full border-2 border-white dark:border-gray-950" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-white">500+</span> tevreden klanten
                </p>
              </div>
            </div>

            {/* Right: Testimonial Card */}
            <div className="relative">
              <div className="bg-gradient-to-br from-[#fcf9f5] to-[#fafafa] dark:from-gray-900 dark:to-gray-800 p-8 rounded-2xl">
                <div className="flex items-start gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-[#efd243] text-[#efd243]" />
                  ))}
                </div>
                <blockquote className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                  "14voices heeft onze commercial naar een hoger niveau getild. De perfecte stem, snelle levering en uitstekende kwaliteit. Een aanrader!"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Jan de Vries</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Marketing Director, TechCo</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <Zap className="w-8 h-8 text-[#18f109]" />
                  <div>
                    <p className="text-2xl font-bold">24u</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Gemiddelde levertijd</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Voice Grid */}
        <div className="bg-gray-50 dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Populaire stemmen</h2>
              <p className="text-gray-600 dark:text-gray-400">Direct beschikbaar voor jouw project</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sampleVoices.map((voice) => (
                <VoiceoverCard
                  key={voice.id}
                  voice={voice}
                  isSelected={false}
                  onSelect={() => {}}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Version 5: Interactive Process Steps */}
      <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
        {/* Hero with Process Steps */}
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              Van idee tot perfecte voice-over
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              In 3 simpele stappen naar professionele audio voor jouw project
            </p>
          </div>

          {/* Process Steps */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="relative group">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-[#18f109] rounded-xl flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-black">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Kies je stem</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Browse door 250+ professionele stemacteurs en vind de perfecte match
                </p>
                <button className="text-[#18f109] font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                  Start hier <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-300 dark:bg-gray-700" />
            </div>

            <div className="relative group">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-[#efd243] rounded-xl flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-black">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Upload je script</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Deel je tekst en ontvang binnen 24 uur je professionele opname
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Gemiddeld 6 uur levertijd</span>
                </div>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-300 dark:bg-gray-700" />
            </div>

            <div className="relative group">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-[#ebaa3a] rounded-xl flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-black">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Download & gebruik</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Ontvang je audio in HD kwaliteit, klaar voor direct gebruik
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>100% tevredenheidsgarantie</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div className="bg-[#fcf9f5] dark:bg-gray-800 p-8 rounded-2xl">
            <div className="grid lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2">
                <h3 className="text-2xl font-semibold mb-3">Klaar om te beginnen?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Zoek direct in ons uitgebreide stemmenbestand
                </p>
              </div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Zoek stemmen..."
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#18f109]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Voice Grid */}
        <div className="bg-white dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Ontdek onze stemmen</h2>
                <p className="text-gray-600 dark:text-gray-400">Filter op stijl, taal of project type</p>
              </div>
              <div className="flex gap-2">
                {['Warm', 'Zakelijk', 'Jong'].map((style) => (
                  <button
                    key={style}
                    onClick={() => toggleStyle(style)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedStyles.includes(style)
                        ? 'bg-[#18f109] text-black'
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sampleVoices.map((voice) => (
                <VoiceoverCard
                  key={voice.id}
                  voice={voice}
                  isSelected={false}
                  onSelect={() => {}}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}