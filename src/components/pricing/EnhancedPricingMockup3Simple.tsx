'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  GraduationCap,
  Radio,
  Tv,
  Globe,
  Phone,
  Mic,
  Music,
  Edit3,
  Headphones,
  FileText,
  Film,
  Play,
  Pause,
  Volume2,
  Layers,
  Eye,
  Sparkles,
  Check,
  Download,
  Zap,
  Box,
} from 'lucide-react';

// Production types
const productionTypes = [
  {
    id: 'video',
    name: 'Videoproductie',
    icon: Video,
    color: '#3B82F6',
    gradient: 'from-blue-500 to-purple-500',
    price: 175,
  },
  {
    id: 'elearning',
    name: 'E-learning',
    icon: GraduationCap,
    color: '#10B981',
    gradient: 'from-green-500 to-teal-500',
    price: 200,
  },
  {
    id: 'radio',
    name: 'Radiocommercial',
    icon: Radio,
    color: '#F97316',
    gradient: 'from-orange-500 to-red-500',
    price: 150,
  },
  {
    id: 'tv',
    name: 'TV Commercial',
    icon: Tv,
    color: '#EC4899',
    gradient: 'from-pink-500 to-rose-500',
    price: 250,
  },
];

export function EnhancedPricingMockup3Simple() {
  const [selectedType, setSelectedType] = useState<string>('video');
  const [wordCount, setWordCount] = useState(750);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'visual' | 'layers' | 'preview'>('visual');
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string>('emma');
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const currentType = productionTypes.find(t => t.id === selectedType) || productionTypes[0];

  const extras = [
    { id: 'cleanup', name: 'Audio Cleanup', icon: Headphones, price: 50 },
    { id: 'editing', name: 'Editing', icon: Edit3, price: 50 },
    { id: 'mixage', name: 'Mixage', icon: Music, price: 100, requires: ['editing'] },
    { id: 'sounddesign', name: 'Sound Design', icon: Film, price: 100, requires: ['editing', 'mixage'] },
  ];

  const voices = [
    { id: 'emma', name: 'Emma', style: 'Warm & Vriendelijk' },
    { id: 'thomas', name: 'Thomas', style: 'Zakelijk' },
    { id: 'sophie', name: 'Sophie', style: 'Jong & Energiek' },
  ];

  const calculatePrice = () => {
    let price = currentType.price;
    if (wordCount > 1000) price += 150;
    else if (wordCount > 500) price += 50;
    
    selectedExtras.forEach(extraId => {
      const extra = extras.find(e => e.id === extraId);
      if (extra) price += extra.price;
    });
    
    return price;
  };

  const toggleExtra = (extraId: string) => {
    const extra = extras.find(e => e.id === extraId);
    if (!extra) return;

    if (selectedExtras.includes(extraId)) {
      // Remove extra and dependent extras
      setSelectedExtras(prev => prev.filter(id => {
        const e = extras.find(ex => ex.id === id);
        return id !== extraId && !e?.requires?.includes(extraId);
      }));
    } else {
      // Add required extras first
      const newExtras = [...selectedExtras];
      if (extra.requires) {
        extra.requires.forEach(req => {
          if (!newExtras.includes(req)) newExtras.push(req);
        });
      }
      newExtras.push(extraId);
      setSelectedExtras(newExtras);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12 px-4 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-[#18f109]">Visual</span> Voice-Over Configurator
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Bouw je productie visueel op en zie direct het resultaat
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Visual Viewer */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800/30 backdrop-blur rounded-3xl p-4 h-[600px]"
            >
              {/* View Mode Tabs */}
              <div className="flex gap-2 mb-4">
                {[
                  { id: 'visual', label: 'Visual', icon: Eye },
                  { id: 'layers', label: 'Layers', icon: Layers },
                  { id: 'preview', label: 'Preview', icon: Play },
                ].map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setViewMode(mode.id as any)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        viewMode === mode.id
                          ? 'bg-[#18f109] text-gray-900'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {mode.label}
                    </button>
                  );
                })}
              </div>

              {/* Visual View */}
              {viewMode === 'visual' && (
                <div 
                  className="h-full flex items-center justify-center relative"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width - 0.5;
                    const y = (e.clientY - rect.top) / rect.height - 0.5;
                    setRotation({ x: y * 20, y: x * 20 });
                  }}
                  onMouseLeave={() => setRotation({ x: 0, y: 0 })}
                >
                  <motion.div
                    animate={{
                      rotateX: rotation.x,
                      rotateY: rotation.y,
                    }}
                    transition={{ type: 'spring', stiffness: 100 }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="relative"
                  >
                    {/* Base shape */}
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className={`w-48 h-48 rounded-3xl bg-gradient-to-br ${currentType.gradient} shadow-2xl flex items-center justify-center`}
                      style={{ transform: 'translateZ(0px)' }}
                    >
                      <currentType.icon className="w-24 h-24 text-white/80" />
                    </motion.div>

                    {/* Extra layers */}
                    {selectedExtras.map((extraId, index) => {
                      const extra = extras.find(e => e.id === extraId);
                      if (!extra) return null;
                      
                      return (
                        <motion.div
                          key={extraId}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 0.8, scale: 1 }}
                          className="absolute inset-0 rounded-3xl border-4 border-[#18f109] flex items-center justify-center"
                          style={{ 
                            transform: `translateZ(${(index + 1) * 30}px)`,
                            borderStyle: index % 2 === 0 ? 'solid' : 'dashed',
                          }}
                        >
                          <extra.icon className="w-12 h-12 text-[#18f109]" />
                        </motion.div>
                      );
                    })}

                    {/* Floating particles */}
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-[#18f109] rounded-full"
                        animate={{
                          x: [0, Math.random() * 100 - 50, 0],
                          y: [0, Math.random() * 100 - 50, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 3 + i,
                          repeat: Infinity,
                          delay: i * 0.5,
                        }}
                        style={{
                          left: '50%',
                          top: '50%',
                        }}
                      />
                    ))}
                  </motion.div>
                </div>
              )}

              {/* Layers View */}
              {viewMode === 'layers' && (
                <div className="h-full flex items-center justify-center">
                  <div className="space-y-4 w-full max-w-md">
                    {/* Base Layer */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative"
                    >
                      <div className={`p-6 bg-gradient-to-r ${currentType.gradient} rounded-xl flex items-center justify-between shadow-lg`}>
                        <div className="flex items-center gap-3">
                          <currentType.icon className="w-8 h-8 text-white" />
                          <span className="font-semibold text-lg">{currentType.name}</span>
                        </div>
                        <span className="text-xl font-bold">€{currentType.price}</span>
                      </div>
                    </motion.div>

                    {/* Word count layer */}
                    {wordCount > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="relative ml-8"
                      >
                        <div className="p-4 bg-gray-800 rounded-xl border-2 border-gray-700">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText className="w-6 h-6 text-gray-400" />
                              <span>{wordCount} woorden</span>
                            </div>
                            <span className="text-lg font-bold text-[#18f109]">
                              {wordCount > 1000 ? '+€150' : wordCount > 500 ? '+€50' : '€0'}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Extra Layers */}
                    {selectedExtras.map((extraId, index) => {
                      const extra = extras.find(e => e.id === extraId);
                      if (!extra) return null;
                      const Icon = extra.icon;
                      
                      return (
                        <motion.div
                          key={extraId}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                          className="relative"
                          style={{ marginLeft: `${(index + 2) * 2}rem` }}
                        >
                          <div className="p-4 bg-gradient-to-r from-[#18f109]/20 to-[#16d008]/20 rounded-xl border-2 border-[#18f109]">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Icon className="w-6 h-6 text-[#18f109]" />
                                <span>{extra.name}</span>
                              </div>
                              <span className="text-lg font-bold text-[#18f109]">+€{extra.price}</span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}

                    {/* Total */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="pt-4 border-t border-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl">Totaal</span>
                        <motion.span
                          key={calculatePrice()}
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className="text-3xl font-bold text-[#18f109]"
                        >
                          €{calculatePrice()}
                        </motion.span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}

              {/* Preview */}
              {viewMode === 'preview' && (
                <div className="h-full flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gray-800/50 backdrop-blur rounded-2xl p-8 max-w-md w-full"
                  >
                    <h4 className="text-lg font-semibold mb-6 text-center">Audio Preview</h4>
                    
                    {/* Waveform visualization */}
                    <div className="flex items-center justify-center gap-1 mb-6 h-20">
                      {[...Array(32)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 bg-[#18f109] rounded-full"
                          animate={{
                            height: isPlaying ? [20, Math.random() * 60 + 20, 20] : 20,
                          }}
                          transition={{
                            duration: 0.8,
                            repeat: isPlaying ? Infinity : 0,
                            delay: i * 0.05,
                            ease: 'easeInOut',
                          }}
                        />
                      ))}
                    </div>

                    {/* Info */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Productie</span>
                        <span className="font-medium">{currentType.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Stem</span>
                        <span className="font-medium">{voices.find(v => v.id === selectedVoice)?.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Duur</span>
                        <span className="font-medium">~{Math.round(wordCount / 150)} min</span>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-4 bg-[#18f109] rounded-full text-gray-900 hover:bg-[#16d008] transition-colors"
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Production Types */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800/50 backdrop-blur rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Productie Type</h3>
              <div className="grid grid-cols-2 gap-3">
                {productionTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                        selectedType === type.id
                          ? 'bg-[#18f109] text-gray-900'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-xs font-medium">{type.name}</span>
                      <span className="text-xs opacity-80">€{type.price}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Word Count */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/50 backdrop-blur rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Script Lengte</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-3xl font-bold text-[#18f109]">{wordCount}</span>
                  <span className="text-sm text-gray-400 ml-2">woorden</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  value={wordCount}
                  onChange={(e) => setWordCount(Number(e.target.value))}
                  className="w-full"
                  style={{
                    background: `linear-gradient(to right, #18f109 0%, #18f109 ${(wordCount / 2000) * 100}%, #374151 ${(wordCount / 2000) * 100}%, #374151 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>0</span>
                  <span>1000</span>
                  <span>2000</span>
                </div>
              </div>
            </motion.div>

            {/* Extras */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Extra Opties</h3>
              <div className="space-y-3">
                {extras.map((extra) => {
                  const Icon = extra.icon;
                  const isSelected = selectedExtras.includes(extra.id);
                  const isDisabled = extra.requires?.some(req => !selectedExtras.includes(req));
                  
                  return (
                    <button
                      key={extra.id}
                      onClick={() => !isDisabled && toggleExtra(extra.id)}
                      disabled={isDisabled}
                      className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${
                        isSelected
                          ? 'bg-[#18f109] text-gray-900'
                          : isDisabled
                            ? 'bg-gray-700/50 opacity-50 cursor-not-allowed'
                            : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="flex-1 text-left font-medium">{extra.name}</span>
                      <span className="text-sm">+€{extra.price}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Voice Selection */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 backdrop-blur rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Voice-Over Stem</h3>
              <div className="space-y-2">
                {voices.map((voice) => (
                  <button
                    key={voice.id}
                    onClick={() => setSelectedVoice(voice.id)}
                    className={`w-full p-3 rounded-xl flex items-center justify-between transition-all ${
                      selectedVoice === voice.id
                        ? 'bg-[#18f109] text-gray-900'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <div className="text-left">
                      <p className="font-medium">{voice.name}</p>
                      <p className="text-xs opacity-80">{voice.style}</p>
                    </div>
                    <Mic className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Price & CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-[#18f109] to-[#16d008] rounded-2xl p-6 text-gray-900"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Totale prijs</span>
                <motion.span
                  key={calculatePrice()}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-3xl font-bold"
                >
                  €{calculatePrice()}
                </motion.span>
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Offerte
                </button>
                <button className="flex-1 bg-white text-gray-900 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors">
                  Direct Boeken
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}