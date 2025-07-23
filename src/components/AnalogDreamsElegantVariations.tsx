'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Instrument_Serif, Plus_Jakarta_Sans } from 'next/font/google';
import { ArrowRight, Volume2, Sparkles, Radio, Mic2, AudioLines, Waves } from 'lucide-react';

const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
});

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

// Enhanced Perlin noise with multiple layers
const createLayeredNoise = (seed: number = 0) => {
  return `data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cfilter id='noise${seed}'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${0.01 + seed * 0.005}' numOctaves='${3 + seed}' seed='${seed}'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0'/%3E%3C/filter%3E%3C/defs%3E%3Crect width='100%25' height='100%25' filter='url(%23noise${seed})' opacity='${0.05 + seed * 0.02}'/%3E%3C/svg%3E`;
};

// Film grain generator
const generateFilmGrain = (density: number = 0.8) => {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 300;
  const ctx = canvas.getContext('2d')!;

  // Create grain pattern
  for (let i = 0; i < 15000 * density; i++) {
    const x = Math.random() * 300;
    const y = Math.random() * 300;
    const alpha = Math.random() * 0.4;
    const size = Math.random() * 0.8;

    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fillRect(x, y, size, size);
  }

  // Add occasional scratches
  for (let i = 0; i < 3; i++) {
    ctx.strokeStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
    ctx.lineWidth = Math.random() * 0.5;
    ctx.beginPath();
    ctx.moveTo(Math.random() * 300, 0);
    ctx.lineTo(Math.random() * 300, 300);
    ctx.stroke();
  }

  return canvas.toDataURL();
};

const variations = [
  {
    id: 'editorial-voice',
    title: 'Editorial Voice',
    tagline: 'Where stories find their perfect tone',
    description:
      'Craft narratives that resonate. Professional voice artistry meets editorial excellence in every word delivered.',
    cta: 'Begin Your Story',
    icon: Mic2,
    colors: {
      light: {
        bg: 'from-[#f5f0e8] via-[#fcf9f5] to-[#f5f0e8]',
        accent: '#212121',
        text: '#212121',
        muted: '#666666',
      },
      dark: {
        bg: 'from-gray-900 via-black to-gray-900',
        accent: '#18f109',
        text: '#ffffff',
        muted: '#999999',
      },
    },
    noise: { layers: 2, density: 0.6 },
  },
  {
    id: 'sonic-architecture',
    title: 'Sonic Architecture',
    tagline: 'Building soundscapes, layer by layer',
    description:
      'Engineer audio experiences with precision. Every voice becomes a building block in your sonic masterpiece.',
    cta: 'Construct Sound',
    icon: AudioLines,
    colors: {
      light: {
        bg: 'from-slate-100 via-gray-50 to-slate-100',
        accent: '#1a1a1a',
        text: '#1a1a1a',
        muted: '#71717a',
      },
      dark: {
        bg: 'from-slate-950 via-gray-950 to-slate-950',
        accent: '#60a5fa',
        text: '#f1f5f9',
        muted: '#94a3b8',
      },
    },
    noise: { layers: 3, density: 0.4 },
  },
  {
    id: 'vintage-broadcast',
    title: 'Vintage Broadcast',
    tagline: 'Classic warmth, modern clarity',
    description:
      'Channel the golden age of radio with contemporary quality. Timeless voices for modern audiences.',
    cta: 'On Air Now',
    icon: Radio,
    colors: {
      light: {
        bg: 'from-amber-50 via-orange-50 to-amber-50',
        accent: '#d97706',
        text: '#451a03',
        muted: '#92400e',
      },
      dark: {
        bg: 'from-amber-950 via-orange-950 to-amber-950',
        accent: '#fbbf24',
        text: '#fef3c7',
        muted: '#f59e0b',
      },
    },
    noise: { layers: 4, density: 0.8 },
  },
  {
    id: 'fluid-expression',
    title: 'Fluid Expression',
    tagline: 'Voices that flow like water',
    description:
      'Let your message cascade through perfect vocal delivery. Natural, flowing, unforgettable.',
    cta: 'Flow Forward',
    icon: Waves,
    colors: {
      light: {
        bg: 'from-cyan-50 via-blue-50 to-indigo-50',
        accent: '#0891b2',
        text: '#083344',
        muted: '#0e7490',
      },
      dark: {
        bg: 'from-cyan-950 via-blue-950 to-indigo-950',
        accent: '#22d3ee',
        text: '#cffafe',
        muted: '#06b6d4',
      },
    },
    noise: { layers: 2, density: 0.5 },
  },
  {
    id: 'premium-delivery',
    title: 'Premium Delivery',
    tagline: 'Excellence in every syllable',
    description:
      'Elevate your brand with voices that command attention. Premium quality, delivered with precision.',
    cta: 'Experience Premium',
    icon: Sparkles,
    colors: {
      light: {
        bg: 'from-purple-50 via-pink-50 to-purple-50',
        accent: '#9333ea',
        text: '#3b0764',
        muted: '#7c3aed',
      },
      dark: {
        bg: 'from-purple-950 via-pink-950 to-purple-950',
        accent: '#d946ef',
        text: '#fae8ff',
        muted: '#c026d3',
      },
    },
    noise: { layers: 3, density: 0.3 },
  },
];

export function AnalogDreamsElegantVariations() {
  const [currentVariation, setCurrentVariation] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const containerRef = useRef<HTMLDivElement>(null);
  const grainCanvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollY } = useScroll();

  const variation = variations[currentVariation];
  const colors = variation.colors[theme];
  const Icon = variation.icon;

  // Parallax transforms
  const noiseY = useTransform(scrollY, [0, 1000], [0, -100]);
  const contentY = useTransform(scrollY, [0, 500], [0, 50]);

  // Animated grain effect
  useEffect(() => {
    if (!grainCanvasRef.current) return;
    const ctx = grainCanvasRef.current.getContext('2d')!;
    const grain = generateFilmGrain(variation.noise.density);

    const animate = () => {
      ctx.clearRect(0, 0, 300, 300);

      // Animated grain
      const img = new Image();
      img.onload = () => {
        ctx.globalAlpha = 0.4;
        ctx.drawImage(img, Math.random() * 10 - 5, Math.random() * 10 - 5);
      };
      img.src = grain;

      requestAnimationFrame(animate);
    };

    animate();
  }, [variation.noise.density, theme]);

  return (
    <div
      ref={containerRef}
      className={`${instrumentSerif.variable} ${plusJakarta.variable} min-h-screen relative overflow-hidden transition-all duration-1000 bg-gradient-to-br ${colors.bg}`}
    >
      {/* Theme & Variation Controls */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-4">
        <div className="flex gap-2 bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-full p-1">
          {variations.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentVariation(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentVariation
                  ? `bg-[${colors.accent}] w-8`
                  : 'bg-gray-400/50 hover:bg-gray-400'
              }`}
              style={{
                backgroundColor: idx === currentVariation ? colors.accent : undefined,
              }}
            />
          ))}
        </div>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="px-4 py-2 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105"
          style={{
            backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            color: colors.text,
          }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Multi-layer Perlin Noise */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: noiseY }}>
        {Array.from({ length: variation.noise.layers }).map((_, i) => (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              backgroundImage: `url("${createLayeredNoise(i)}")`,
              backgroundSize: `${400 + i * 100}px ${400 + i * 100}px`,
              opacity: 0.05 + i * 0.02,
              mixBlendMode: theme === 'dark' ? 'screen' : 'multiply',
              transform: `scale(${1 + i * 0.1})`,
            }}
          />
        ))}
      </motion.div>

      {/* Film Grain Canvas */}
      <canvas
        ref={grainCanvasRef}
        width={300}
        height={300}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          opacity: 0.4,
          mixBlendMode: theme === 'dark' ? 'screen' : 'multiply',
        }}
      />

      {/* Main Content */}
      <motion.div
        className="relative z-10 min-h-screen flex items-center justify-center px-6 sm:px-12 lg:px-20"
        style={{ y: contentY }}
      >
        <div className="max-w-6xl mx-auto w-full">
          {/* Animated Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: 'spring', stiffness: 100 }}
            className="mb-8"
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto"
              style={{ backgroundColor: colors.accent + '20' }}
            >
              <Icon className="w-10 h-10" style={{ color: colors.accent }} />
            </div>
          </motion.div>

          {/* Main Title - Inspired by Footer SVG animation */}
          <motion.h1
            className="font-instrument-serif text-6xl sm:text-7xl lg:text-8xl text-center mb-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span style={{ color: colors.text }}>{variation.title}</span>
          </motion.h1>

          {/* Tagline - Banner-inspired hover effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative mb-12 overflow-hidden rounded-2xl mx-auto max-w-2xl"
          >
            <div
              className="px-8 py-4 text-center transition-all duration-300 backdrop-blur-sm"
              style={{
                backgroundColor:
                  theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
              }}
            >
              <p className="font-plus-jakarta text-2xl italic" style={{ color: colors.muted }}>
                {variation.tagline}
              </p>
            </div>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-plus-jakarta text-xl text-center mb-12 max-w-3xl mx-auto leading-relaxed"
            style={{ color: colors.muted }}
          >
            {variation.description}
          </motion.p>

          {/* CTA Button - Enhanced with liquid morph effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-12 py-6 rounded-full font-plus-jakarta font-semibold text-lg overflow-hidden transition-all duration-300"
              style={{
                backgroundColor: colors.accent,
                color: theme === 'dark' ? '#000' : '#fff',
              }}
            >
              {/* Liquid morph background */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
                style={{
                  background: `radial-gradient(circle at 30% 50%, ${colors.accent}40 0%, transparent 50%)`,
                  filter: 'blur(20px)',
                }}
              />

              <span className="relative flex items-center gap-3">
                <Volume2 className="w-5 h-5" />
                {variation.cta}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </span>
            </motion.button>
          </motion.div>

          {/* Animated Steps - Liquid Morph inspired */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            {['Kies je stem', 'Upload script', 'Ontvang audio'].map((step, idx) => (
              <motion.div
                key={idx}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: idx * 0.3,
                }}
                className="flex items-center gap-3"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: idx === 0 ? colors.accent : colors.muted + '40',
                  }}
                />
                <span className="font-plus-jakarta text-sm" style={{ color: colors.muted }}>
                  {step}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
