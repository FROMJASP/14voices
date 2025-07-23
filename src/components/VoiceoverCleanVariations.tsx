'use client';

import React, { useState } from 'react';
import { Search, Star, Zap, Shield, ThumbsUp, ExternalLink, MessageSquare, Award, Users, Clock, ChevronRight, Play, Mic, Globe, HeartHandshake, TrendingUp, CheckCircle, Sparkles } from 'lucide-react';
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

export function VoiceoverCleanVariations() {
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
    <div className={`${plusJakarta.variable} font-plus-jakarta`}>
      
      {/* Version 1: Exact Recreation */}
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="relative">
          {/* Floating Testimonials */}
          <div className="absolute left-8 top-24 hidden lg:block">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg max-w-xs transform -rotate-3">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#efd243] text-[#efd243]" />
                ))}
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                "Perfecte stem voor onze commercial!"
              </p>
              <p className="text-xs text-gray-500 mt-2">- Lisa M.</p>
            </div>
          </div>

          <div className="absolute right-8 top-32 hidden lg:block">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg max-w-xs transform rotate-3">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#efd243] text-[#efd243]" />
                ))}
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                "Snelle levering, top kwaliteit!"
              </p>
              <p className="text-xs text-gray-500 mt-2">- Peter V.</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto px-6 pt-32 pb-16">
            {/* Header Badge */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#18f109]/10 backdrop-blur-sm rounded-full">
                <ThumbsUp className="w-4 h-4 text-[#18f109]" />
                <span className="text-sm font-medium">500+ tevreden klanten</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-5xl lg:text-7xl font-bold text-center text-gray-900 dark:text-white mb-6">
              Jouw stem,<br />
              ons vakmanschap
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-center text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
              Ontdek waarom honderden bedrijven kiezen voor onze voice-over diensten
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mb-12">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#18f109]" />
                <span className="font-semibold">24u levering</span>
              </div>
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-700" />
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-[#efd243]" />
                <span className="font-semibold">4.9/5 rating</span>
              </div>
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-700" />
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#ebaa3a]" />
                <span className="font-semibold">100% garantie</span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-10">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Zoek stemmen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm text-lg focus:outline-none focus:ring-4 focus:ring-[#18f109]/20 transition-all"
                />
              </div>
            </div>

            {/* Style Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              {allStyles.map((style) => (
                <button
                  key={style}
                  onClick={() => toggleStyle(style)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    selectedStyles.includes(style)
                      ? 'bg-[#18f109] text-black shadow-md scale-105'
                      : 'bg-white dark:bg-gray-800 hover:shadow-md border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>

            {/* Feedback Company Link */}
            <div className="text-center">
              <a 
                href="https://www.feedbackcompany.com/nl-nl/reviews/fourteen-voices/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#18f109] hover:underline font-medium"
              >
                Lees meer reviews op Feedback Company <ExternalLink className="w-4 h-4" />
              </a>
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

      {/* Version 2: With Process Steps */}
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        <div className="relative">
          {/* Floating Elements */}
          <div className="absolute left-12 top-40 hidden xl:block">
            <div className="bg-[#fcf9f5] dark:bg-gray-800 p-6 rounded-2xl shadow-xl max-w-xs">
              <MessageSquare className="w-8 h-8 text-[#18f109] mb-3" />
              <p className="font-semibold mb-1">Direct contact</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Persoonlijk advies binnen 2 uur
              </p>
            </div>
          </div>

          <div className="absolute right-12 top-40 hidden xl:block">
            <div className="bg-[#fcf9f5] dark:bg-gray-800 p-6 rounded-2xl shadow-xl max-w-xs">
              <Award className="w-8 h-8 text-[#efd243] mb-3" />
              <p className="font-semibold mb-1">Bekroond</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                4.9/5 op Feedback Company
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-5xl mx-auto px-6 pt-32 pb-16">
            {/* Process Steps */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="w-8 h-8 bg-[#18f109] text-black rounded-full flex items-center justify-center font-semibold">1</span>
                <span>Kies je stem</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center font-semibold">2</span>
                <span>Upload script</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center font-semibold">3</span>
                <span>Ontvang audio</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-5xl lg:text-7xl font-bold text-center text-gray-900 dark:text-white mb-6">
              De perfecte stem<br />
              voor elk verhaal
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-center text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
              Van commercials tot documentaires. Direct beschikbaar, professioneel opgenomen.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#18f109]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-8 h-8 text-[#18f109]" />
                </div>
                <p className="font-semibold">24u levering</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Snel geleverd</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#efd243]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Star className="w-8 h-8 text-[#efd243]" />
                </div>
                <p className="font-semibold">4.9/5 rating</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">500+ reviews</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#ebaa3a]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-8 h-8 text-[#ebaa3a]" />
                </div>
                <p className="font-semibold">100% garantie</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Altijd tevreden</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-10">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Zoek op naam, stijl of type project..."
                  className="w-full pl-14 pr-6 py-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-lg focus:outline-none focus:ring-4 focus:ring-[#18f109]/20"
                />
              </div>
            </div>

            {/* Style Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {allStyles.map((style) => (
                <button
                  key={style}
                  onClick={() => toggleStyle(style)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    selectedStyles.includes(style)
                      ? 'bg-[#18f109] text-black shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Voice Grid */}
        <div className="bg-gray-50 dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Beschikbare stemmen</h2>
              <a 
                href="https://www.feedbackcompany.com/nl-nl/reviews/fourteen-voices/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#18f109] hover:underline"
              >
                Bekijk reviews <ExternalLink className="w-4 h-4" />
              </a>
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

      {/* Version 3: Interactive Stats */}
      <div className="min-h-screen bg-[#fcf9f5] dark:bg-gray-950">
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, #18f109 0%, transparent 50%),
                               radial-gradient(circle at 80% 80%, #efd243 0%, transparent 50%),
                               radial-gradient(circle at 40% 20%, #ebaa3a 0%, transparent 50%)`
            }} />
          </div>

          {/* Animated Stats */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-6xl px-6">
            <div className="flex justify-between">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl shadow-lg animate-pulse">
                <p className="text-2xl font-bold text-[#18f109]">250+</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Stemmen</p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl shadow-lg animate-pulse delay-75">
                <p className="text-2xl font-bold text-[#efd243]">4.9/5</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Rating</p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl shadow-lg animate-pulse delay-150">
                <p className="text-2xl font-bold text-[#ebaa3a]">10k+</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Projecten</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 max-w-5xl mx-auto px-6 pt-40 pb-16">
            {/* Badge */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                <Users className="w-4 h-4 text-[#18f109]" />
                <span className="text-sm font-medium">Vertrouwd door 500+ bedrijven</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-5xl lg:text-7xl font-bold text-center text-gray-900 dark:text-white mb-6">
              Geef je project<br />
              <span className="text-[#18f109]">een stem</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-center text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
              Professionele voice-overs die jouw boodschap versterken
            </p>

            {/* Interactive Elements */}
            <div className="grid grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto">
              <button className="group bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-xl transition-all">
                <Play className="w-6 h-6 text-[#18f109] mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium">Luister demos</p>
              </button>
              <button className="group bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-xl transition-all">
                <Mic className="w-6 h-6 text-[#efd243] mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium">Direct boeken</p>
              </button>
              <button className="group bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-xl transition-all">
                <HeartHandshake className="w-6 h-6 text-[#ebaa3a] mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium">Persoonlijk advies</p>
              </button>
            </div>

            {/* Search */}
            <div className="max-w-2xl mx-auto mb-10">
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#18f109] transition-colors" />
                <input
                  type="text"
                  placeholder="Zoek de perfecte stem..."
                  className="w-full pl-14 pr-6 py-4 bg-white dark:bg-gray-800 rounded-2xl shadow-md group-focus-within:shadow-xl text-lg focus:outline-none focus:ring-4 focus:ring-[#18f109]/20 transition-all"
                />
              </div>
            </div>

            {/* Style Tags with Counter */}
            <div>
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedStyles.length > 0 
                    ? `${selectedStyles.length} stijl(en) geselecteerd` 
                    : 'Selecteer een of meerdere stijlen'}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {allStyles.map((style) => (
                  <button
                    key={style}
                    onClick={() => toggleStyle(style)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                      selectedStyles.includes(style)
                        ? 'bg-[#18f109] text-black shadow-lg transform scale-105'
                        : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Voice Grid */}
        <div className="bg-white dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Onze stemacteurs</h2>
              <a 
                href="https://www.feedbackcompany.com/nl-nl/reviews/fourteen-voices/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#18f109] hover:underline"
              >
                <Star className="w-4 h-4" />
                4.9/5 op Feedback Company
              </a>
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

      {/* Version 4: Split Hero */}
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <div className="grid lg:grid-cols-2 min-h-[600px]">
          {/* Left Side */}
          <div className="bg-gradient-to-br from-[#fcf9f5] to-white dark:from-gray-900 dark:to-gray-800 p-12 lg:p-16 flex items-center">
            <div className="w-full">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#18f109]/10 rounded-full mb-6">
                <CheckCircle className="w-4 h-4 text-[#18f109]" />
                <span className="text-sm font-medium">Marktleider sinds 2015</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Jouw stem,<br />
                ons vakmanschap
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                250+ professionele stemacteurs voor commercials, documentaires en bedrijfsvideo's.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div>
                  <p className="text-3xl font-bold text-[#18f109]">24u</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Levering</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#efd243]">4.9/5</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#ebaa3a]">100%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Garantie</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="px-6 py-3 bg-[#18f109] text-black rounded-xl font-semibold hover:bg-[#18f109]/90 transition-colors">
                  Start project
                </button>
                <a 
                  href="https://www.feedbackcompany.com/nl-nl/reviews/fourteen-voices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  Reviews <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="p-12 lg:p-16 flex items-center bg-gray-50 dark:bg-gray-900">
            <div className="w-full">
              <h3 className="text-2xl font-semibold mb-6">Vind jouw perfecte stem</h3>
              
              {/* Search */}
              <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Zoek op naam, stijl of taal..."
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#18f109]"
                />
              </div>

              {/* Recent Reviews */}
              <div className="mb-8">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">RECENTE REVIEWS</p>
                <div className="space-y-3">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl">
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-[#efd243] text-[#efd243]" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      "Uitstekende kwaliteit en snelle levering!"
                    </p>
                    <p className="text-xs text-gray-500 mt-1">- Mark K.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl">
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-[#efd243] text-[#efd243]" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      "Perfecte stem voor onze commercial."
                    </p>
                    <p className="text-xs text-gray-500 mt-1">- Anna B.</p>
                  </div>
                </div>
              </div>

              {/* Popular Styles */}
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">POPULAIRE STIJLEN</p>
                <div className="flex flex-wrap gap-2">
                  {allStyles.slice(0, 8).map((style) => (
                    <button
                      key={style}
                      onClick={() => toggleStyle(style)}
                      className={`px-4 py-2 rounded-lg text-sm transition-all ${
                        selectedStyles.includes(style)
                          ? 'bg-[#18f109] text-black'
                          : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {style}
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

      {/* Version 5: Minimal Centered */}
      <div className="min-h-screen bg-gradient-to-b from-white to-[#fcf9f5]/30 dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-4xl mx-auto px-6 pt-32 pb-16">
          {/* Animated Background Elements */}
          <div className="fixed top-20 left-20 w-64 h-64 bg-[#18f109]/5 rounded-full blur-3xl animate-pulse" />
          <div className="fixed bottom-20 right-20 w-96 h-96 bg-[#efd243]/5 rounded-full blur-3xl animate-pulse delay-75" />

          {/* Title */}
          <h1 className="text-6xl lg:text-8xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Jouw stem,<br />
            <span className="bg-gradient-to-r from-[#18f109] to-[#efd243] bg-clip-text text-transparent">
              ons vakmanschap
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-2xl text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Ontdek waarom honderden bedrijven kiezen voor onze voice-over diensten
          </p>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-12 mb-16">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Zap className="w-6 h-6 text-[#18f109]" />
                <span className="text-2xl font-bold">24u</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">levering</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-6 h-6 text-[#efd243]" />
                <span className="text-2xl font-bold">4.9/5</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">rating</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Shield className="w-6 h-6 text-[#ebaa3a]" />
                <span className="text-2xl font-bold">100%</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">garantie</p>
            </div>
          </div>

          {/* Large Search */}
          <div className="relative group mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-[#18f109]/20 to-[#efd243]/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
            <div className="relative">
              <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Zoek stemmen..."
                className="w-full pl-16 pr-8 py-6 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl text-xl focus:outline-none focus:ring-4 focus:ring-[#18f109]/20 transition-all"
              />
            </div>
          </div>

          {/* Minimal Style Pills */}
          <div className="text-center mb-8">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Klik om te filteren op stijl</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {allStyles.map((style) => (
                <button
                  key={style}
                  onClick={() => toggleStyle(style)}
                  className={`px-6 py-3 rounded-2xl text-base font-medium transition-all ${
                    selectedStyles.includes(style)
                      ? 'bg-gradient-to-r from-[#18f109] to-[#18f109]/80 text-black shadow-xl transform scale-105'
                      : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <a 
              href="https://www.feedbackcompany.com/nl-nl/reviews/fourteen-voices/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-lg text-[#18f109] hover:underline font-medium"
            >
              Lees meer reviews op Feedback Company <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Voice Grid */}
        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm py-16">
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
    </div>
  );
}