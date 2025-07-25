'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Space_Grotesk } from 'next/font/google';
import { Zap, Radio, Tv, Headphones, ArrowRight, Plus, Minus } from 'lucide-react';

const spaceGrotesk = Space_Grotesk({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

interface ServiceType {
  id: string;
  name: string;
  icon: React.ReactNode;
  price: number;
  color: string;
  bgPattern: string;
}

const services: ServiceType[] = [
  {
    id: 'video',
    name: 'VIDEO',
    icon: <Tv className="w-8 h-8" />,
    price: 175,
    color: '#FF006E',
    bgPattern: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,0,110,0.1) 10px, rgba(255,0,110,0.1) 20px)',
  },
  {
    id: 'audio',
    name: 'AUDIO',
    icon: <Headphones className="w-8 h-8" />,
    price: 225,
    color: '#8338EC',
    bgPattern: 'repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(131,56,236,0.1) 10px, rgba(131,56,236,0.1) 20px)',
  },
  {
    id: 'radio',
    name: 'RADIO',
    icon: <Radio className="w-8 h-8" />,
    price: 300,
    color: '#3A86FF',
    bgPattern: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(58,134,255,0.1) 10px, rgba(58,134,255,0.1) 20px)',
  },
];

const wordPackages = [
  { id: 'xs', label: 'XS', words: '0-100', price: 0 },
  { id: 's', label: 'S', words: '100-250', price: 50 },
  { id: 'm', label: 'M', words: '250-500', price: 125 },
  { id: 'l', label: 'L', words: '500-1000', price: 225 },
  { id: 'xl', label: 'XL', words: '1000+', price: 350 },
];

const powerUps = [
  { id: 'turbo', name: 'TURBO DELIVERY', price: 100, description: '24H RUSH' },
  { id: 'fx', name: 'SOUND FX', price: 150, description: 'EPIC EFFECTS' },
  { id: 'remix', name: 'REMIX RIGHTS', price: 200, description: 'FULL LICENSE' },
  { id: 'master', name: 'MASTER QUALITY', price: 75, description: 'STUDIO GRADE' },
];

export function RetroFuturisticCalculator() {
  const [selectedService, setSelectedService] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState(1);
  const [selectedPowerUps, setSelectedPowerUps] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  const currentService = services[selectedService];

  const totalPrice = useMemo(() => {
    let base = currentService.price + wordPackages[selectedPackage].price;
    
    selectedPowerUps.forEach(powerUp => {
      const found = powerUps.find(p => p.id === powerUp);
      if (found) base += found.price;
    });

    return base * quantity;
  }, [selectedService, selectedPackage, selectedPowerUps, quantity, currentService]);

  return (
    <div className={`min-h-screen bg-black text-white ${spaceGrotesk.className}`}>
      {/* Grid background */}
      <div className="fixed inset-0 opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Animated neon lines */}
      <div className="fixed inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-primary to-transparent"
            style={{
              width: '200%',
              top: `${30 + i * 20}%`,
            }}
            animate={{
              x: ['-100%', '0%'],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-8xl font-bold mb-4 tracking-tighter">
            <span className="inline-block transform -skew-x-12 bg-gradient-to-r from-primary via-pink-500 to-purple-500 bg-clip-text text-transparent">
              VOICE
            </span>
            <span className="inline-block transform skew-x-12 ml-4">
              SYNTH
            </span>
          </h1>
          <p className="text-xl tracking-widest text-gray-400">
            THE FUTURE OF VOICE-OVER
          </p>
        </motion.div>

        {/* Service Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            SELECT SERVICE
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {services.map((service, index) => (
              <motion.button
                key={service.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedService(index)}
                className="relative overflow-hidden group"
                style={{
                  background: selectedService === index ? service.color : 'transparent',
                  border: `3px solid ${service.color}`,
                }}
              >
                <div
                  className="absolute inset-0 opacity-30"
                  style={{ background: service.bgPattern }}
                />
                <div className="relative p-8">
                  <div className="mb-4 inline-block p-4 bg-black rounded-lg">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold tracking-wider">{service.name}</h3>
                  <p className="text-3xl font-light mt-2">€{service.price}</p>
                </div>
                {selectedService === index && (
                  <motion.div
                    layoutId="serviceSelector"
                    className="absolute inset-0 border-4 border-white"
                    style={{ borderStyle: 'dashed' }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Word Package */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="text-primary">◆</span>
              WORD PACKAGE
            </h2>
            <div className="space-y-3">
              {wordPackages.map((pkg, index) => (
                <motion.button
                  key={pkg.id}
                  whileHover={{ x: 10 }}
                  onClick={() => setSelectedPackage(index)}
                  className={`w-full p-4 border-2 flex items-center justify-between transition-all ${
                    selectedPackage === index
                      ? 'border-primary bg-primary text-black'
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold">{pkg.label}</span>
                    <span className="text-sm opacity-80">{pkg.words} WORDS</span>
                  </div>
                  <span className="text-xl font-bold">
                    {pkg.price > 0 ? `+€${pkg.price}` : 'BASE'}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Power-ups */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="text-primary">▲</span>
              POWER-UPS
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {powerUps.map((powerUp) => {
                const isSelected = selectedPowerUps.includes(powerUp.id);
                return (
                  <motion.button
                    key={powerUp.id}
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedPowerUps(selectedPowerUps.filter(p => p !== powerUp.id));
                      } else {
                        setSelectedPowerUps([...selectedPowerUps, powerUp.id]);
                      }
                    }}
                    className={`p-4 border-2 transition-all ${
                      isSelected
                        ? 'border-primary bg-primary text-black'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                    style={{
                      transform: isSelected ? 'rotate(-2deg)' : 'rotate(0deg)',
                    }}
                  >
                    <p className="font-bold text-sm mb-1">{powerUp.name}</p>
                    <p className="text-xs opacity-80 mb-2">{powerUp.description}</p>
                    <p className="text-lg font-bold">+€{powerUp.price}</p>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quantity and Total */}
        <div className="bg-gradient-to-r from-gray-900 to-black p-8 border-4 border-primary">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Quantity */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-primary">QUANTITY</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 border-2 border-primary flex items-center justify-center hover:bg-primary hover:text-black transition-all"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-3xl font-bold w-16 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 border-2 border-primary flex items-center justify-center hover:bg-primary hover:text-black transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2 text-primary">TOTAL CREDITS</h3>
              <div className="text-6xl font-bold tracking-tighter">
                €{totalPrice}
              </div>
            </div>

            {/* CTA */}
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-primary blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-primary text-black px-8 py-4 font-bold text-xl tracking-wider flex items-center gap-2">
                  LAUNCH PROJECT
                  <ArrowRight className="w-6 h-6" />
                </div>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Footer tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 tracking-widest">
            © 2024 VOICESYNTH™ // THE SOUND OF TOMORROW
          </p>
        </motion.div>
      </div>
    </div>
  );
}