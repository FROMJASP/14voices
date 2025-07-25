'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float } from '@react-three/drei';
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
  RotateCcw,
  Download,
  Settings,
} from 'lucide-react';

// Production types with 3D properties
const productionTypes = [
  {
    id: 'video',
    name: 'Videoproductie',
    icon: Video,
    color: '#3B82F6',
    emissive: '#1E40AF',
    price: 175,
    model: 'cube', // Simplified for demo
  },
  {
    id: 'elearning',
    name: 'E-learning',
    icon: GraduationCap,
    color: '#10B981',
    emissive: '#047857',
    price: 200,
    model: 'sphere',
  },
  {
    id: 'radio',
    name: 'Radiocommercial',
    icon: Radio,
    color: '#F97316',
    emissive: '#C2410C',
    price: 150,
    model: 'cone',
  },
  {
    id: 'tv',
    name: 'TV Commercial',
    icon: Tv,
    color: '#EC4899',
    emissive: '#BE185D',
    price: 250,
    model: 'cylinder',
  },
];

// 3D Model Component
function ProductionModel({ type, isSelected, extras }: any) {
  const meshRef = useRef<any>();

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} scale={isSelected ? 1.2 : 1}>
        {type.model === 'cube' && <boxGeometry args={[2, 2, 2]} />}
        {type.model === 'sphere' && <sphereGeometry args={[1.5, 32, 32]} />}
        {type.model === 'cone' && <coneGeometry args={[1.5, 2, 32]} />}
        {type.model === 'cylinder' && <cylinderGeometry args={[1.5, 1.5, 2, 32]} />}
        
        <meshStandardMaterial
          color={type.color}
          emissive={type.emissive}
          emissiveIntensity={isSelected ? 0.5 : 0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Extra layers */}
      {extras.map((extra: string, index: number) => (
        <mesh
          key={extra}
          position={[0, (index + 1) * 0.5, 0]}
          scale={[1.5 - index * 0.1, 0.1, 1.5 - index * 0.1]}
        >
          <cylinderGeometry args={[1, 1, 0.1, 32]} />
          <meshStandardMaterial
            color={extra === 'mixage' ? '#EFD243' : '#18F109'}
            emissive={extra === 'mixage' ? '#CA8A04' : '#15803D'}
            emissiveIntensity={0.3}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </Float>
  );
}

// Audio Preview Component
function AudioPreview({ isPlaying, onToggle }: { isPlaying: boolean; onToggle: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-900/80 backdrop-blur rounded-2xl p-6"
    >
      <h4 className="text-sm font-medium text-gray-400 mb-4">Audio Preview</h4>
      
      {/* Waveform visualization */}
      <div className="flex items-center justify-center gap-1 mb-4 h-16">
        {[...Array(32)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1 bg-[#18f109] rounded-full"
            animate={{
              height: isPlaying ? [16, 40, 16] : 16,
            }}
            transition={{
              duration: 0.5,
              repeat: isPlaying ? Infinity : 0,
              delay: i * 0.05,
            }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onToggle}
          className="p-3 bg-[#18f109] rounded-full text-gray-900 hover:bg-[#16d008] transition-colors"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        <div className="flex items-center gap-2 flex-1">
          <Volume2 className="w-4 h-4 text-gray-400" />
          <div className="flex-1 h-1 bg-gray-700 rounded-full">
            <div className="h-full w-3/4 bg-[#18f109] rounded-full" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function EnhancedPricingMockup3() {
  const [selectedType, setSelectedType] = useState<string>('video');
  const [wordCount, setWordCount] = useState(750);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'3d' | 'layers' | 'preview'>('3d');
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string>('emma');

  const currentType = productionTypes.find(t => t.id === selectedType) || productionTypes[0];

  const extras = [
    { id: 'cleanup', name: 'Audio Cleanup', icon: Headphones, price: 50 },
    { id: 'editing', name: 'Editing', icon: Edit3, price: 50 },
    { id: 'mixage', name: 'Mixage', icon: Music, price: 100 },
    { id: 'sounddesign', name: 'Sound Design', icon: Film, price: 100 },
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
    setSelectedExtras(prev => 
      prev.includes(extraId) 
        ? prev.filter(id => id !== extraId)
        : [...prev, extraId]
    );
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
            <span className="text-[#18f109]">3D</span> Voice-Over Configurator
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Visualiseer je productie in real-time en zie direct het resultaat
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 3D Viewer */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800/30 backdrop-blur rounded-3xl p-4 h-[600px]"
            >
              {/* View Mode Tabs */}
              <div className="flex gap-2 mb-4">
                {[
                  { id: '3d', label: '3D View', icon: Eye },
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

              {/* 3D Canvas */}
              {viewMode === '3d' && (
                <div className="h-full rounded-xl overflow-hidden">
                  <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 8]} />
                    <OrbitControls enableZoom={false} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <ProductionModel
                      type={currentType}
                      isSelected={true}
                      extras={selectedExtras}
                    />
                    <Environment preset="city" />
                  </Canvas>
                </div>
              )}

              {/* Layers View */}
              {viewMode === 'layers' && (
                <div className="h-full flex items-center justify-center">
                  <div className="space-y-4">
                    {/* Base Layer */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative"
                    >
                      <div className="w-64 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <span className="font-semibold">{currentType.name}</span>
                      </div>
                    </motion.div>

                    {/* Extra Layers */}
                    {selectedExtras.map((extraId, index) => {
                      const extra = extras.find(e => e.id === extraId);
                      if (!extra) return null;
                      
                      return (
                        <motion.div
                          key={extraId}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: -index * 40 - 20 }}
                          className="relative"
                          style={{ zIndex: index + 1 }}
                        >
                          <div className="w-64 h-20 bg-gradient-to-r from-[#18f109] to-[#16d008] rounded-xl flex items-center justify-center shadow-lg">
                            <span className="font-medium">{extra.name}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Preview */}
              {viewMode === 'preview' && (
                <div className="h-full flex items-center justify-center">
                  <AudioPreview 
                    isPlaying={isPlaying} 
                    onToggle={() => setIsPlaying(!isPlaying)} 
                  />
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
                  
                  return (
                    <button
                      key={extra.id}
                      onClick={() => toggleExtra(extra.id)}
                      className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${
                        isSelected
                          ? 'bg-[#18f109] text-gray-900'
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