'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PriceCalculatorV1 } from '@/components/pricing/PriceCalculatorV1';
import { PriceCalculatorV2 } from '@/components/pricing/PriceCalculatorV2';
import { PriceCalculatorV3 } from '@/components/pricing/PriceCalculatorV3';
import { PriceCalculatorV4 } from '@/components/pricing/PriceCalculatorV4';
import { PriceCalculatorV5 } from '@/components/pricing/PriceCalculatorV5';
import { ChevronLeft, ChevronRight, Sparkles, Box, BookOpen, Gem, Zap } from 'lucide-react';

const mockups = [
  {
    id: 'v1',
    name: 'Modern Minimalist',
    description: 'Clean 3-column layout with gradient accents',
    icon: <Sparkles className="w-5 h-5" />,
    component: PriceCalculatorV1,
    color: 'from-gray-600 to-gray-800',
  },
  {
    id: 'v2',
    name: 'Dark Interactive',
    description: 'Animated cards with particle effects',
    icon: <Box className="w-5 h-5" />,
    component: PriceCalculatorV2,
    color: 'from-purple-600 to-blue-600',
  },
  {
    id: 'v3',
    name: 'Timeline Journey',
    description: 'Step-by-step process with progress tracking',
    icon: <BookOpen className="w-5 h-5" />,
    component: PriceCalculatorV3,
    color: 'from-primary to-green-500',
  },
  {
    id: 'v4',
    name: 'Floating 3D',
    description: 'Circular navigation with floating panels',
    icon: <Gem className="w-5 h-5" />,
    component: PriceCalculatorV4,
    color: 'from-purple-600 to-pink-600',
  },
  {
    id: 'v5',
    name: 'Magazine Style',
    description: 'Editorial layout with vintage typography',
    icon: <Zap className="w-5 h-5" />,
    component: PriceCalculatorV5,
    color: 'from-yellow-600 to-orange-600',
  },
];

export default function PricingMockupsPage() {
  const [currentMockup, setCurrentMockup] = useState(0);
  const CurrentComponent = mockups[currentMockup].component;

  const nextMockup = () => {
    setCurrentMockup((prev) => (prev + 1) % mockups.length);
  };

  const prevMockup = () => {
    setCurrentMockup((prev) => (prev - 1 + mockups.length) % mockups.length);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Price Calculator Mockups</h1>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {mockups.map((mockup, index) => (
                <button
                  key={mockup.id}
                  onClick={() => setCurrentMockup(index)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    currentMockup === index
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-accent'
                  }`}
                >
                  {mockup.name}
                </button>
              ))}
            </div>

            {/* Mobile Navigation */}
            <div className="flex md:hidden items-center gap-4">
              <button
                onClick={prevMockup}
                className="p-2 rounded-lg bg-muted hover:bg-accent transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium">
                {currentMockup + 1} / {mockups.length}
              </span>
              <button
                onClick={nextMockup}
                className="p-2 rounded-lg bg-muted hover:bg-accent transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Current Mockup Info */}
          <div className="mt-4 flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${mockups[currentMockup].color} text-white`}>
              {mockups[currentMockup].icon}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{mockups[currentMockup].name}</h2>
              <p className="text-sm text-muted-foreground">{mockups[currentMockup].description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mockup Display */}
      <div className="pt-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMockup}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentComponent />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Navigation Buttons */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-background/80 backdrop-blur-xl border border-border rounded-full px-6 py-3 shadow-lg">
        <button
          onClick={prevMockup}
          className="p-2 rounded-full hover:bg-muted transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          {mockups.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentMockup(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentMockup === index
                  ? 'w-8 bg-primary'
                  : 'bg-muted-foreground/50 hover:bg-muted-foreground'
              }`}
            />
          ))}
        </div>
        <button
          onClick={nextMockup}
          className="p-2 rounded-full hover:bg-muted transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}