'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus_Jakarta_Sans, Instrument_Serif } from 'next/font/google';
import { ArrowRight, Play, Headphones, Mic2, Radio, Zap, ChevronRight, Volume2, Music2, AudioLines, Waves } from 'lucide-react';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
});

// Enhanced Perlin noise generator
const createPerlinNoise = (frequency: number = 0.02, octaves: number = 4, opacity: number = 0.3) => {
  return `data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${frequency}' numOctaves='${octaves}' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='${opacity}'/%3E%3C/svg%3E`;
};

export default function AnalogDreamsDutchMockups() {
  const [selectedMockup, setSelectedMockup] = useState(1);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const mockups = [
    { id: 1, name: 'Studio Flow', description: 'Vloeiende studio-ervaring' },
    { id: 2, name: 'Voice Canvas', description: 'Stem als kunstwerk' },
    { id: 3, name: 'Audio Cascade', description: 'Waterval van geluid' },
    { id: 4, name: 'Retro Broadcast', description: 'Vintage radio vibes' },
    { id: 5, name: 'Modern Wave', description: 'Futuristische golven' },
  ];

  return (
    <div className={`${plusJakarta.variable} ${instrumentSerif.variable} min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'}`}>
      {/* Navigation */}
      <div className={`sticky top-0 z-50 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Analog Dreams - Nederlandse Variaties</h1>
            <div className="flex items-center gap-4">
              <div className="flex flex-wrap gap-2">
                {mockups.map((mockup) => (
                  <button
                    key={mockup.id}
                    onClick={() => setSelectedMockup(mockup.id)}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-all ${
                      selectedMockup === mockup.id
                        ? 'bg-[#18f109] text-black font-semibold'
                        : theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {mockup.name}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  theme === 'dark' 
                    ? 'bg-white text-black hover:bg-gray-200' 
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mockup Display */}
      <div className="p-4 sm:p-6">
        <AnimatePresence mode="wait">
          {selectedMockup === 1 && <StudioFlow key="1" theme={theme} />}
          {selectedMockup === 2 && <VoiceCanvas key="2" theme={theme} />}
          {selectedMockup === 3 && <AudioCascade key="3" theme={theme} />}
          {selectedMockup === 4 && <RetroBroadcast key="4" theme={theme} />}
          {selectedMockup === 5 && <ModernWave key="5" theme={theme} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Mockup 1: Studio Flow - Professional recording studio aesthetic
function StudioFlow({ theme }: { theme: 'light' | 'dark' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // VU meter animation
      for (let i = 0; i < 20; i++) {
        const height = Math.random() * 150;
        const x = i * 15;
        
        // Green to red gradient
        if (height < 100) {
          ctx.fillStyle = '#18f109';
        } else if (height < 130) {
          ctx.fillStyle = '#efd243';
        } else {
          ctx.fillStyle = '#ff4444';
        }
        
        ctx.fillRect(x, canvas.height - height, 10, height);
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-[90vh] rounded-3xl overflow-hidden"
      style={{
        background: theme === 'dark' 
          ? 'radial-gradient(ellipse at top left, #1a1a1a 0%, #000 50%)' 
          : 'radial-gradient(ellipse at top left, #fafafa 0%, #f0f0f0 50%)'
      }}
    >
      {/* Perlin noise overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${createPerlinNoise(0.015, 3, 0.2)}")`,
          backgroundSize: '400px 400px',
          mixBlendMode: theme === 'dark' ? 'screen' : 'multiply',
        }}
      />

      {/* VU Meter Canvas */}
      <canvas
        ref={canvasRef}
        width={300}
        height={200}
        className="absolute top-8 right-8 opacity-30"
      />

      {/* Floating studio equipment */}
      <motion.div
        className="absolute top-20 right-40"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className={`w-32 h-32 rounded-2xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-200/50'} backdrop-blur-sm flex items-center justify-center`}>
          <Mic2 className={`w-16 h-16 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
        </div>
      </motion.div>

      <div className="relative z-10 h-full flex items-center px-8 lg:px-16">
        <div className="max-w-6xl w-full mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* Steps */}
              <div className="flex flex-col gap-4 mb-8">
                {[
                  { num: '1', text: 'Selecteer stem', active: true },
                  { num: '2', text: 'Upload tekst', active: false },
                  { num: '3', text: 'Ontvang opname', active: false },
                ].map((step, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-center gap-4"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      step.active 
                        ? 'bg-[#18f109] text-black' 
                        : theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step.num}
                    </div>
                    <span className={`font-medium ${
                      step.active 
                        ? theme === 'dark' ? 'text-white' : 'text-gray-900'
                        : theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      {step.text}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Title */}
              <h1 className={`font-instrument-serif text-5xl lg:text-7xl mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Studio kwaliteit,
                <br />
                <span className="text-[#18f109] italic">thuis geleverd</span>
              </h1>

              {/* Description */}
              <p className={`text-xl mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Professionele voice-overs opgenomen in onze state-of-the-art studio. 
                Perfecte akoestiek, kristalheldere kwaliteit, binnen 48 uur.
              </p>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-[#18f109] text-black px-8 py-4 rounded-full font-semibold text-lg inline-flex items-center gap-3"
              >
                <Headphones className="w-5 h-5" />
                Beluister voorbeelden
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </motion.button>
            </motion.div>
          </div>

          {/* Right Visual */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative h-[500px]"
          >
            {/* Sound wave visualization */}
            <svg className="absolute inset-0 w-full h-full">
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#18f109" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#efd243" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              {[...Array(5)].map((_, i) => (
                <motion.path
                  key={i}
                  d={`M0,${250 + i * 20} Q100,${230 + i * 20} 200,${250 + i * 20} T400,${250 + i * 20}`}
                  stroke="url(#waveGradient)"
                  strokeWidth={2 - i * 0.3}
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              ))}
            </svg>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// Mockup 2: Voice Canvas - Artistic voice visualization
function VoiceCanvas({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-[90vh] rounded-3xl overflow-hidden"
      style={{
        background: theme === 'dark'
          ? 'linear-gradient(135deg, #0a0a0a 0%, #1a0f1f 50%, #0f1a1a 100%)'
          : 'linear-gradient(135deg, #fafafa 0%, #f0e6ff 50%, #e6f7ff 100%)'
      }}
    >
      {/* Multiple noise layers */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${createPerlinNoise(0.01, 2, 0.15)}")`,
          backgroundSize: '600px 600px',
          mixBlendMode: theme === 'dark' ? 'screen' : 'multiply',
        }}
      />
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${createPerlinNoise(0.03, 5, 0.1)}")`,
          backgroundSize: '300px 300px',
          mixBlendMode: 'overlay',
        }}
      />

      {/* Animated paint strokes */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="paintGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#18f109" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#efd243" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="paintGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff6b6b" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#4ecdc4" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        <motion.path
          d="M0,100 Q200,50 400,100 T800,100"
          stroke="url(#paintGradient1)"
          strokeWidth="80"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3, ease: "easeOut" }}
        />
        
        <motion.path
          d="M800,300 Q600,250 400,300 T0,300"
          stroke="url(#paintGradient2)"
          strokeWidth="60"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3, delay: 0.5, ease: "easeOut" }}
        />
      </svg>

      <div className="relative z-10 h-full flex items-center justify-center px-8 lg:px-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Artistic Title */}
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className={`font-instrument-serif text-6xl lg:text-8xl mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
          >
            Jouw stem,
            <br />
            <span className="relative">
              <span className="relative z-10 italic">ons canvas</span>
              <motion.div
                className="absolute -inset-4 bg-[#18f109]/20 rounded-2xl -z-10"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              />
            </span>
          </motion.h1>

          {/* Floating voice elements */}
          <div className="relative h-32 mb-8">
            {['Warm', 'Helder', 'Krachtig', 'Authentiek', 'Professioneel'].map((word, idx) => (
              <motion.div
                key={idx}
                className={`absolute px-6 py-3 rounded-full backdrop-blur-sm ${
                  theme === 'dark' ? 'bg-white/10' : 'bg-black/5'
                }`}
                style={{
                  left: `${20 + idx * 15}%`,
                  top: `${Math.sin(idx) * 30 + 50}%`,
                }}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 3,
                  delay: idx * 0.2,
                  repeat: Infinity,
                }}
              >
                <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {word}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Description */}
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`text-xl mb-12 max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Elke stem vertelt een verhaal. Wij transformeren jouw woorden tot een kunstwerk 
            van geluid, met de perfecte toon en emotie.
          </motion.p>

          {/* Interactive CTA */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="inline-block"
          >
            <button className="group relative px-12 py-6 overflow-hidden rounded-full">
              <div className="absolute inset-0 bg-gradient-to-r from-[#18f109] to-[#efd243] opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#efd243] to-[#18f109] opacity-0 group-hover:opacity-80 transition-opacity duration-500" />
              <span className="relative flex items-center gap-3 text-black font-semibold text-lg">
                <Music2 className="w-5 h-5" />
                Start je project
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </span>
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// Mockup 3: Audio Cascade - Waterfall design
function AudioCascade({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-[90vh] rounded-3xl overflow-hidden"
      style={{
        background: theme === 'dark'
          ? 'linear-gradient(to bottom, #0a0a0a 0%, #0f1a2a 50%, #0a0a0a 100%)'
          : 'linear-gradient(to bottom, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)'
      }}
    >
      {/* Perlin noise */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${createPerlinNoise(0.02, 4, 0.25)}")`,
          backgroundSize: '500px 500px',
          mixBlendMode: theme === 'dark' ? 'screen' : 'multiply',
        }}
      />

      {/* Cascading audio bars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2"
            style={{
              left: `${i * 5}%`,
              background: `linear-gradient(to bottom, transparent, ${i % 2 === 0 ? '#18f109' : '#efd243'}, transparent)`,
            }}
            animate={{
              height: ['0%', '100%', '0%'],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 3,
              delay: i * 0.1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 h-full">
        {/* Top Section */}
        <div className="px-8 pt-16 pb-8">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center"
          >
            <h1 className={`font-instrument-serif text-5xl lg:text-7xl mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Laat je boodschap
              <br />
              <span className="text-[#18f109] italic">stromen</span>
            </h1>
          </motion.div>
        </div>

        {/* Cascading Cards */}
        <div className="px-8 pb-16">
          <div className="max-w-6xl mx-auto">
            {[
              {
                icon: Volume2,
                title: 'Kies je geluid',
                desc: 'Meer dan 50 professionele stemmen',
                delay: 0,
              },
              {
                icon: AudioLines,
                title: 'Perfect getimed',
                desc: 'Binnen 48 uur klaar voor gebruik',
                delay: 0.2,
              },
              {
                icon: Waves,
                title: 'Studio kwaliteit',
                desc: 'Kristalhelder geluid, altijd',
                delay: 0.4,
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: item.delay }}
                className={`mb-6 p-8 rounded-2xl backdrop-blur-md ${
                  theme === 'dark' ? 'bg-white/5' : 'bg-black/5'
                }`}
                style={{
                  marginLeft: `${idx * 100}px`,
                }}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                    theme === 'dark' ? 'bg-[#18f109]/20' : 'bg-[#18f109]/10'
                  }`}>
                    <item.icon className="w-8 h-8 text-[#18f109]" />
                  </div>
                  <div>
                    <h3 className={`text-2xl font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {item.title}
                    </h3>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12"
          >
            <button className="bg-[#18f109] text-black px-10 py-5 rounded-full font-semibold text-lg inline-flex items-center gap-3 hover:scale-105 transition-transform">
              <Play className="w-5 h-5" />
              Demo's beluisteren
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// Mockup 4: Retro Broadcast - Vintage radio aesthetic
function RetroBroadcast({ theme }: { theme: 'light' | 'dark' }) {
  const [frequency, setFrequency] = useState(88.5);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-[90vh] rounded-3xl overflow-hidden"
      style={{
        background: theme === 'dark'
          ? 'radial-gradient(ellipse at center, #1a1310 0%, #0a0805 100%)'
          : 'radial-gradient(ellipse at center, #fef3c7 0%, #fde68a 100%)'
      }}
    >
      {/* Heavy grain for vintage feel */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${createPerlinNoise(0.05, 8, 0.4)}")`,
          backgroundSize: '200px 200px',
          mixBlendMode: theme === 'dark' ? 'screen' : 'multiply',
        }}
      />

      {/* Radio static lines */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute h-px w-full ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'}`}
            style={{ top: `${i * 2}%` }}
            animate={{
              opacity: [0, 0.5, 0],
              scaleX: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              delay: i * 0.02,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 h-full flex items-center justify-center px-8 lg:px-16">
        <div className="max-w-6xl mx-auto w-full">
          {/* Radio Interface */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring" }}
            className={`max-w-2xl mx-auto p-12 rounded-3xl ${
              theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-amber-100 to-orange-100'
            } shadow-2xl`}
          >
            {/* Frequency Display */}
            <div className={`mb-8 p-6 rounded-xl ${theme === 'dark' ? 'bg-black/50' : 'bg-black/10'}`}>
              <div className="flex items-center justify-between mb-4">
                <span className={`font-mono text-3xl ${theme === 'dark' ? 'text-[#18f109]' : 'text-orange-600'}`}>
                  {frequency.toFixed(1)} FM
                </span>
                <Radio className={`w-8 h-8 ${theme === 'dark' ? 'text-[#18f109]' : 'text-orange-600'}`} />
              </div>
              
              {/* Frequency Slider */}
              <input
                type="range"
                min="88"
                max="108"
                step="0.1"
                value={frequency}
                onChange={(e) => setFrequency(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Title */}
            <h1 className={`font-instrument-serif text-4xl lg:text-5xl mb-6 text-center ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              On Air:
              <br />
              <span className={theme === 'dark' ? 'text-[#18f109]' : 'text-orange-600'}>
                Jouw Verhaal
              </span>
            </h1>

            {/* Description */}
            <p className={`text-center mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Klassieke radio warmte meets moderne technologie. 
              Laat je boodschap resoneren met nostalgische charme.
            </p>

            {/* Radio Buttons */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {['AM', 'FM', 'SW'].map((band) => (
                <button
                  key={band}
                  className={`py-3 rounded-lg font-semibold transition-all ${
                    band === 'FM'
                      ? theme === 'dark' ? 'bg-[#18f109] text-black' : 'bg-orange-500 text-white'
                      : theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {band}
                </button>
              ))}
            </div>

            {/* CTA */}
            <button className={`w-full py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 ${
              theme === 'dark' ? 'bg-[#18f109] text-black' : 'bg-orange-500 text-white'
            }`}>
              Start uitzending
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// Mockup 5: Modern Wave - Futuristic audio waves
function ModernWave({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-[90vh] rounded-3xl overflow-hidden"
      style={{
        background: theme === 'dark'
          ? 'conic-gradient(from 180deg at 50% 50%, #0a0a0a 0deg, #18f109 90deg, #0a0a0a 180deg, #efd243 270deg, #0a0a0a 360deg)'
          : 'conic-gradient(from 180deg at 50% 50%, #ffffff 0deg, #18f109 90deg, #ffffff 180deg, #efd243 270deg, #ffffff 360deg)'
      }}
    >
      {/* Subtle noise */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${createPerlinNoise(0.008, 2, 0.1)}")`,
          backgroundSize: '800px 800px',
          mixBlendMode: 'overlay',
        }}
      />

      {/* 3D Wave Grid */}
      <div className="absolute inset-0" style={{ perspective: '1000px' }}>
        <motion.div
          className="w-full h-full"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateX(60deg)',
          }}
        >
          <svg className="w-full h-full">
            <defs>
              <linearGradient id="waveGradient3d" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#18f109" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#efd243" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#18f109" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            
            {[...Array(10)].map((_, i) => (
              <motion.line
                key={i}
                x1="0"
                y1={`${i * 10}%`}
                x2="100%"
                y2={`${i * 10}%`}
                stroke="url(#waveGradient3d)"
                strokeWidth="1"
                animate={{
                  strokeDasharray: ['0 100', '100 0', '0 100'],
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.1,
                  repeat: Infinity,
                }}
              />
            ))}
          </svg>
        </motion.div>
      </div>

      <div className="relative z-10 h-full flex items-center px-8 lg:px-16">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <h1 className={`font-plus-jakarta font-black text-6xl lg:text-8xl mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                NEXT
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#18f109] to-[#efd243]">
                  LEVEL
                </span>
                <br />
                AUDIO
              </h1>

              <p className={`text-xl mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Futuristische voice-over technologie. 
                AI-ondersteunde perfectie, menselijke warmte.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3 mb-8">
                {['AI Stem Matching', '3D Audio', 'Instant Delivery', 'Multi-Language'].map((feature) => (
                  <span
                    key={feature}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      theme === 'dark' ? 'bg-white/10 text-white' : 'bg-black/10 text-black'
                    }`}
                  >
                    {feature}
                  </span>
                ))}
              </div>

              <button className="group bg-gradient-to-r from-[#18f109] to-[#efd243] text-black px-8 py-4 rounded-full font-bold text-lg inline-flex items-center gap-3">
                <Zap className="w-5 h-5" />
                Activeer nu
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>

            {/* Right Visual - Interactive Wave */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              className="relative h-[500px]"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full border-2 border-[#18f109]/30"
                    style={{
                      width: `${100 + i * 80}px`,
                      height: `${100 + i * 80}px`,
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3],
                      rotate: i % 2 === 0 ? [0, 360] : [0, -360],
                    }}
                    transition={{
                      duration: 10 + i * 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                ))}
                
                <motion.div
                  className="relative z-10 w-32 h-32 bg-gradient-to-br from-[#18f109] to-[#efd243] rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Play className="w-12 h-12 text-black" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}