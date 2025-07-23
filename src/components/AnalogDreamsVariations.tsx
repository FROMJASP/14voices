'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, Sparkles, Zap, Layers, Grid3X3, Waves } from 'lucide-react';

// Utility functions for noise generation
const generatePerlinNoise = (width: number, height: number, scale: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  // Simple Perlin-like noise
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const value = Math.sin(x * scale) * Math.cos(y * scale) * 127 + 128;
      const index = (y * width + x) * 4;
      data[index] = value;
      data[index + 1] = value;
      data[index + 2] = value;
      data[index + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
};

const variations = [
  {
    id: 'neon-dreams',
    title: 'Neon Dreams',
    subtitle: 'Where voices paint neon skies',
    description: 'Transform your narrative into luminous soundscapes that pulse with creative energy',
    cta: 'Illuminate Your Story',
    icon: Sparkles,
    gradient: {
      light: 'from-pink-400 via-purple-400 to-indigo-400',
      dark: 'from-pink-600 via-purple-600 to-indigo-600'
    },
    noise: { scale: 0.02, opacity: 0.15 },
    buttonStyle: {
      light: 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600',
      dark: 'bg-gradient-to-r from-pink-400 to-purple-400 text-black hover:from-pink-500 hover:to-purple-500'
    }
  },
  {
    id: 'retro-wave',
    title: 'Retro Wave',
    subtitle: 'Ride the synthwave of storytelling',
    description: 'Craft audio experiences that echo through digital dimensions and nostalgic futures',
    cta: 'Start Your Journey',
    icon: Zap,
    gradient: {
      light: 'from-cyan-400 via-blue-400 to-purple-400',
      dark: 'from-cyan-600 via-blue-600 to-purple-600'
    },
    noise: { scale: 0.03, opacity: 0.2 },
    buttonStyle: {
      light: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600',
      dark: 'bg-gradient-to-r from-cyan-400 to-blue-400 text-black hover:from-cyan-500 hover:to-blue-500'
    }
  },
  {
    id: 'minimal-echo',
    title: 'Minimal Echo',
    subtitle: 'Less noise. More impact.',
    description: 'Distill your message into pure vocal essence. Every word resonates with purpose.',
    cta: 'Amplify Clarity',
    icon: Layers,
    gradient: {
      light: 'from-gray-200 via-gray-300 to-gray-400',
      dark: 'from-gray-700 via-gray-800 to-gray-900'
    },
    noise: { scale: 0.01, opacity: 0.1 },
    buttonStyle: {
      light: 'bg-black text-white hover:bg-gray-800',
      dark: 'bg-white text-black hover:bg-gray-200'
    }
  },
  {
    id: 'organic-flow',
    title: 'Organic Flow',
    subtitle: 'Natural voices, digital canvas',
    description: 'Blend authentic storytelling with fluid soundscapes that breathe life into your content',
    cta: 'Flow Into Sound',
    icon: Waves,
    gradient: {
      light: 'from-green-400 via-teal-400 to-blue-400',
      dark: 'from-green-600 via-teal-600 to-blue-600'
    },
    noise: { scale: 0.025, opacity: 0.18 },
    buttonStyle: {
      light: 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600',
      dark: 'bg-gradient-to-r from-green-400 to-teal-400 text-black hover:from-green-500 hover:to-teal-500'
    }
  },
  {
    id: 'glitch-matrix',
    title: 'Glitch Matrix',
    subtitle: 'Break the sound barrier',
    description: 'Deconstruct traditional voiceovers into avant-garde audio art that defies convention',
    cta: 'Enter the Matrix',
    icon: Grid3X3,
    gradient: {
      light: 'from-red-400 via-orange-400 to-yellow-400',
      dark: 'from-red-600 via-orange-600 to-yellow-600'
    },
    noise: { scale: 0.04, opacity: 0.25 },
    buttonStyle: {
      light: 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600',
      dark: 'bg-gradient-to-r from-red-400 to-orange-400 text-black hover:from-red-500 hover:to-orange-500'
    }
  }
];

export function AnalogDreamsVariations() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [noiseUrls, setNoiseUrls] = useState<Record<string, string>>({});
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  useEffect(() => {
    // Generate noise textures for each variation
    const urls: Record<string, string> = {};
    variations.forEach((variation) => {
      urls[variation.id] = generatePerlinNoise(400, 400, variation.noise.scale);
    });
    setNoiseUrls(urls);
  }, []);

  useEffect(() => {
    // Animate grain effect
    canvasRefs.current.forEach((canvas, index) => {
      if (!canvas) return;
      const ctx = canvas.getContext('2d')!;
      const variation = variations[index];
      
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Add random grain
        for (let i = 0; i < 1000; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const opacity = Math.random() * variation.noise.opacity;
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.fillRect(x, y, 1, 1);
        }
        
        requestAnimationFrame(animate);
      };
      
      animate();
    });
  }, [theme]);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'} transition-colors duration-500`}>
      <div className="fixed top-8 right-8 z-50">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            theme === 'dark' 
              ? 'bg-white text-black hover:bg-gray-200' 
              : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
        {variations.map((variation, index) => {
          const Icon = variation.icon;
          return (
            <div
              key={variation.id}
              className={`relative overflow-hidden rounded-2xl ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
              } transition-all duration-500 hover:scale-105`}
            >
              {/* Background gradient */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${
                  theme === 'dark' ? variation.gradient.dark : variation.gradient.light
                } opacity-30`}
              />
              
              {/* Perlin noise overlay */}
              {noiseUrls[variation.id] && (
                <div
                  className="absolute inset-0 mix-blend-overlay"
                  style={{
                    backgroundImage: `url(${noiseUrls[variation.id]})`,
                    backgroundSize: 'cover',
                    opacity: variation.noise.opacity
                  }}
                />
              )}
              
              {/* Animated grain canvas */}
              <canvas
                ref={(el) => (canvasRefs.current[index] = el)}
                width={400}
                height={600}
                className="absolute inset-0 w-full h-full mix-blend-overlay"
              />
              
              {/* Content */}
              <div className="relative z-10 p-8 flex flex-col h-[600px]">
                <div className="mb-6">
                  <Icon className={`w-12 h-12 mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`} />
                  <h2 className={`text-4xl font-bold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {variation.title}
                  </h2>
                  <p className={`text-xl ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {variation.subtitle}
                  </p>
                </div>
                
                <p className={`text-lg mb-8 flex-grow ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {variation.description}
                </p>
                
                <button className={`
                  w-full py-4 px-6 rounded-xl font-semibold text-lg
                  transition-all duration-300 transform hover:scale-105
                  flex items-center justify-center gap-3
                  ${theme === 'dark' ? variation.buttonStyle.dark : variation.buttonStyle.light}
                  shadow-lg hover:shadow-xl
                `}>
                  <Play className="w-5 h-5" />
                  {variation.cta}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}