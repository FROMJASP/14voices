'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Video,
  GraduationCap,
  Radio,
  Tv,
  Globe,
  Phone,
  Clock,
  DollarSign,
  Package,
  Mic,
  Music,
  Edit3,
  Headphones,
  FileText,
  Film,
  Plus,
  X,
  Info,
  User,
  Calendar,
  ChevronDown,
} from 'lucide-react';

// Timeline items based on production process
const timelineSteps = [
  { id: 'select', title: 'Selectie', duration: '5 min', icon: Package },
  { id: 'script', title: 'Script', duration: '15 min', icon: FileText },
  { id: 'voice', title: 'Voice-over', duration: '30 min', icon: Mic },
  { id: 'extras', title: 'Extra\'s', duration: 'Variabel', icon: Plus },
  { id: 'delivery', title: 'Oplevering', duration: '48 uur', icon: Calendar },
];

const productionTypes = [
  {
    id: 'video',
    name: 'Videoproductie',
    icon: Video,
    color: 'from-blue-500 to-purple-500',
    basePrice: 175,
    baseTime: 120, // minutes
  },
  {
    id: 'elearning',
    name: 'E-learning',
    icon: GraduationCap,
    color: 'from-green-500 to-teal-500',
    basePrice: 200,
    baseTime: 90,
  },
  {
    id: 'radio',
    name: 'Radiocommercial',
    icon: Radio,
    color: 'from-orange-500 to-red-500',
    basePrice: 150,
    baseTime: 60,
  },
  {
    id: 'tv',
    name: 'TV Commercial',
    icon: Tv,
    color: 'from-pink-500 to-rose-500',
    basePrice: 250,
    baseTime: 180,
  },
];

const availableExtras = [
  { id: 'cleanup', name: 'Audio Cleanup', icon: Headphones, price: 50, time: 30 },
  { id: 'editing', name: 'Editing', icon: Edit3, price: 50, time: 45 },
  { id: 'mixage', name: 'Mixage', icon: Music, price: 100, time: 60, requires: ['editing'] },
  { id: 'sounddesign', name: 'Sound Design', icon: Film, price: 100, time: 90, requires: ['editing', 'mixage'] },
];

const voiceOptions = [
  { id: 1, name: 'Emma - Warm & Vriendelijk', avatar: '👩‍🦰', available: true },
  { id: 2, name: 'Thomas - Zakelijk', avatar: '👨‍💼', available: true },
  { id: 3, name: 'Sophie - Jong & Energiek', avatar: '👩', available: false },
  { id: 4, name: 'Lars - Diep & Krachtig', avatar: '🧔', available: true },
];

export function EnhancedPricingMockup2() {
  const [selectedType, setSelectedType] = useState<string>('');
  const [wordCount, setWordCount] = useState(500);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<number | null>(null);
  const [draggedExtra, setDraggedExtra] = useState<string | null>(null);
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

  const calculatePrice = () => {
    let price = 0;
    const type = productionTypes.find(t => t.id === selectedType);
    if (type) {
      price += type.basePrice;
      // Word count pricing
      if (wordCount > 1000) price += 150;
      else if (wordCount > 500) price += 50;
    }
    
    // Add extras
    selectedExtras.forEach(extraId => {
      const extra = availableExtras.find(e => e.id === extraId);
      if (extra) price += extra.price;
    });
    
    return price;
  };

  const calculateTime = () => {
    let time = 0;
    const type = productionTypes.find(t => t.id === selectedType);
    if (type) time += type.baseTime;
    
    // Add extras time
    selectedExtras.forEach(extraId => {
      const extra = availableExtras.find(e => e.id === extraId);
      if (extra) time += extra.time;
    });
    
    return time;
  };

  const handleDragEnd = (extraId: string, stepId: string) => {
    if (stepId === 'extras' && !selectedExtras.includes(extraId)) {
      const extra = availableExtras.find(e => e.id === extraId);
      if (extra) {
        // Check dependencies
        if (extra.requires) {
          const missingDeps = extra.requires.filter(dep => !selectedExtras.includes(dep));
          if (missingDeps.length > 0) {
            // Auto-add dependencies
            setSelectedExtras([...selectedExtras, ...missingDeps, extraId]);
          } else {
            setSelectedExtras([...selectedExtras, extraId]);
          }
        } else {
          setSelectedExtras([...selectedExtras, extraId]);
        }
      }
    }
    setDraggedExtra(null);
  };

  const removeExtra = (extraId: string) => {
    // Remove extra and dependent extras
    const newExtras = selectedExtras.filter(id => {
      const extra = availableExtras.find(e => e.id === id);
      return id !== extraId && !extra?.requires?.includes(extraId);
    });
    setSelectedExtras(newExtras);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Bouw Je <span className="text-[#18f109]">Productie Timeline</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Sleep componenten naar de tijdlijn om je perfecte voice-over productie samen te stellen
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Options */}
          <div className="lg:col-span-1 space-y-6">
            {/* Production Types */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800/50 backdrop-blur rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#18f109]" />
                Productie Type
              </h3>
              <div className="space-y-3">
                {productionTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <motion.button
                      key={type.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedType(type.id)}
                      className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all ${
                        selectedType === type.id
                          ? 'bg-gradient-to-r ' + type.color + ' text-white shadow-lg'
                          : 'bg-gray-700/50 hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      <div className="text-left flex-1">
                        <p className="font-medium">{type.name}</p>
                        <p className="text-sm opacity-80">€{type.basePrice} basis</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Word Count */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/50 backdrop-blur rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#efd243]" />
                Aantal Woorden
              </h3>
              <div className="space-y-4">
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
                <div className="flex justify-between text-sm">
                  <span>{wordCount} woorden</span>
                  <span>~{Math.round(wordCount / 150)} min leestijd</span>
                </div>
              </div>
            </motion.div>

            {/* Available Extras (Draggable) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-500" />
                Beschikbare Extra\'s
              </h3>
              <p className="text-sm text-gray-400 mb-4">Sleep naar de tijdlijn →</p>
              <div className="space-y-3">
                {availableExtras.map((extra) => {
                  const Icon = extra.icon;
                  const isSelected = selectedExtras.includes(extra.id);
                  
                  return (
                    <motion.div
                      key={extra.id}
                      drag={!isSelected}
                      dragSnapToOrigin
                      onDragStart={() => setDraggedExtra(extra.id)}
                      onDragEnd={(_, info) => {
                        if (Math.abs(info.offset.x) > 100) {
                          handleDragEnd(extra.id, 'extras');
                        }
                        setDraggedExtra(null);
                      }}
                      whileDrag={{ scale: 1.1, zIndex: 50 }}
                      className={`p-4 rounded-xl flex items-center gap-3 cursor-move transition-all ${
                        isSelected
                          ? 'bg-gray-700/30 opacity-50'
                          : 'bg-gray-700/50 hover:bg-gray-700'
                      } ${draggedExtra === extra.id ? 'shadow-2xl' : ''}`}
                    >
                      <Icon className="w-5 h-5" />
                      <div className="flex-1">
                        <p className="font-medium">{extra.name}</p>
                        <p className="text-xs text-gray-400">
                          +€{extra.price} • {extra.time} min
                        </p>
                      </div>
                      {extra.requires && (
                        <Info className="w-4 h-4 text-gray-400" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Right Panel - Timeline */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/30 backdrop-blur rounded-3xl p-8"
            >
              {/* Timeline Header */}
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold">Productie Timeline</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#18f109]" />
                    <span className="font-medium">{calculateTime()} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#efd243]" />
                    <span className="font-medium">€{calculatePrice()}</span>
                  </div>
                </div>
              </div>

              {/* Timeline Steps */}
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-700" />

                {timelineSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = selectedType || step.id === 'select';
                  
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onMouseEnter={() => setHoveredStep(step.id)}
                      onMouseLeave={() => setHoveredStep(null)}
                      className="relative mb-8 last:mb-0"
                    >
                      {/* Timeline Node */}
                      <motion.div
                        animate={{
                          scale: hoveredStep === step.id ? 1.2 : 1,
                          backgroundColor: isActive ? '#18f109' : '#374151',
                        }}
                        className="absolute left-4 w-8 h-8 rounded-full flex items-center justify-center z-10"
                      >
                        <Icon className="w-4 h-4 text-gray-900" />
                      </motion.div>

                      {/* Step Content */}
                      <div className="ml-16">
                        <div className="bg-gray-800/50 rounded-xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold">{step.title}</h4>
                            <span className="text-sm text-gray-400">{step.duration}</span>
                          </div>

                          {/* Step-specific content */}
                          {step.id === 'select' && selectedType && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="flex items-center gap-3"
                            >
                              {(() => {
                                const type = productionTypes.find(t => t.id === selectedType);
                                const TypeIcon = type?.icon || Package;
                                return (
                                  <>
                                    <div className={`p-2 rounded-lg bg-gradient-to-r ${type?.color}`}>
                                      <TypeIcon className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="font-medium">{type?.name}</span>
                                  </>
                                );
                              })()}
                            </motion.div>
                          )}

                          {step.id === 'script' && wordCount > 0 && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="space-y-2"
                            >
                              <p className="text-sm text-gray-400">Script lengte</p>
                              <p className="font-medium">{wordCount} woorden</p>
                            </motion.div>
                          )}

                          {step.id === 'voice' && (
                            <div className="space-y-3">
                              <p className="text-sm text-gray-400 mb-2">Selecteer stem</p>
                              <div className="grid grid-cols-2 gap-2">
                                {voiceOptions.map((voice) => (
                                  <button
                                    key={voice.id}
                                    onClick={() => setSelectedVoice(voice.id)}
                                    disabled={!voice.available}
                                    className={`p-3 rounded-lg flex items-center gap-2 transition-all ${
                                      selectedVoice === voice.id
                                        ? 'bg-[#18f109] text-gray-900'
                                        : voice.available
                                          ? 'bg-gray-700 hover:bg-gray-600'
                                          : 'bg-gray-700/50 opacity-50 cursor-not-allowed'
                                    }`}
                                  >
                                    <span className="text-xl">{voice.avatar}</span>
                                    <span className="text-xs font-medium">{voice.name}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {step.id === 'extras' && (
                            <motion.div
                              animate={{
                                borderColor: draggedExtra ? '#18f109' : 'transparent',
                              }}
                              className="border-2 border-dashed rounded-lg p-4 transition-colors"
                            >
                              {selectedExtras.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center">
                                  Sleep extra\'s hierheen
                                </p>
                              ) : (
                                <div className="space-y-2">
                                  {selectedExtras.map((extraId) => {
                                    const extra = availableExtras.find(e => e.id === extraId);
                                    if (!extra) return null;
                                    const ExtraIcon = extra.icon;
                                    
                                    return (
                                      <motion.div
                                        key={extraId}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3"
                                      >
                                        <div className="flex items-center gap-2">
                                          <ExtraIcon className="w-4 h-4" />
                                          <span className="text-sm font-medium">{extra.name}</span>
                                        </div>
                                        <button
                                          onClick={() => removeExtra(extraId)}
                                          className="p-1 hover:bg-gray-600 rounded"
                                        >
                                          <X className="w-4 h-4" />
                                        </button>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              )}
                            </motion.div>
                          )}

                          {step.id === 'delivery' && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="space-y-3"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-400">Standaard levering</span>
                                <span className="font-medium">48 uur</span>
                              </div>
                              <button className="w-full bg-gray-700 hover:bg-gray-600 rounded-lg p-3 text-sm transition-colors">
                                Upgrade naar 24 uur (+€75)
                              </button>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 text-center"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!selectedType || !selectedVoice}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all ${
                    selectedType && selectedVoice
                      ? 'bg-[#18f109] text-gray-900 hover:bg-[#16d008]'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Start Productie - €{calculatePrice()}
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}