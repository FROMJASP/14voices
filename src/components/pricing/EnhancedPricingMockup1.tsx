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
  ChevronRight,
  ChevronLeft,
  Check,
  Info,
  Sparkles,
  User,
  Calculator,
  ArrowRight,
} from 'lucide-react';
import Image from 'next/image';

// Using the actual production data from your existing calculator
const productionData = [
  {
    name: 'Videoproductie',
    icon: Video,
    price: 175,
    description: 'Voor bedrijfsfilms, documentaires en online video\'s',
    wordOptions: [
      { label: '0 - 250 woorden', value: '0-250', price: 0 },
      { label: '250 - 500 woorden', value: '250-500', price: 50 },
      { label: '500 - 1000 woorden', value: '500-1000', price: 150 },
      { label: '1000 - 1500 woorden', value: '1000-1500', price: 225 },
      { label: '1500+ woorden', value: '1500+', price: 350 },
    ],
    extras: [
      { name: 'Audio Cleanup', price: 50, description: 'Professionele audio nabewerking' },
      { name: 'Editing', price: 50, description: 'Video editing en montage' },
      { name: 'Mixage', price: 100, description: 'Perfecte audio mixage', requires: ['Editing'] },
      { name: 'Sound Design', price: 100, description: 'Geluidseffecten en muziek', requires: ['Editing', 'Mixage'] },
      { name: 'Klantregie', price: 75, description: 'Live meeluisteren tijdens opname' },
      { name: 'Copywriting', price: 125, description: 'Professionele tekstredactie' },
      { name: 'Inspreken op beeld', price: 75, description: 'Perfecte timing met video' },
    ],
  },
  {
    name: 'E-learning',
    icon: GraduationCap,
    price: 200,
    description: 'Voor online cursussen en trainingsmateriaal',
    wordOptions: [
      { label: '0 - 500 woorden', value: '0-500', price: 0 },
      { label: '500 - 1000 woorden', value: '500-1000', price: 100 },
      { label: '1000 - 1500 woorden', value: '1000-1500', price: 175 },
      { label: '1500 - 2000 woorden', value: '1500-2000', price: 250 },
      { label: '2000+ woorden', value: '2000+', price: 400 },
    ],
    extras: [
      { name: 'Audio Cleanup', price: 50, description: 'Professionele audio nabewerking' },
      { name: 'Editing', price: 50, description: 'Audio editing en montage' },
      { name: 'Mixage', price: 100, description: 'Perfecte audio mixage', requires: ['Editing'] },
      { name: 'Sound Design', price: 100, description: 'Achtergrondmuziek en effecten', requires: ['Editing', 'Mixage'] },
      { name: 'Klantregie', price: 75, description: 'Live meeluisteren tijdens opname' },
      { name: 'Copywriting', price: 125, description: 'Didactische tekstoptimalisatie' },
      { name: 'Inspreken op beeld', price: 75, description: 'Synchronisatie met presentatie' },
    ],
  },
  {
    name: 'Radiocommercial',
    icon: Radio,
    price: 150,
    description: 'Voor radio advertenties en jingles',
    versionOptions: [
      { label: '1 versie', value: '1', price: 0 },
      { label: '2 versies', value: '2', price: 190 },
      { label: '3 versies', value: '3', price: 310 },
      { label: '4 versies', value: '4', price: 410 },
      { label: '5 versies', value: '5', price: 490 },
    ],
    regionOptions: [
      { label: 'Regionaal', value: 'regionaal', price: 0 },
      { label: 'Nationaal', value: 'nationaal', price: 250 },
    ],
    extras: [
      { name: 'Audio Cleanup', price: 75, description: 'Broadcast-ready audio' },
      { name: 'Editing', price: 75, description: 'Professionele montage' },
      { name: 'Mixage', price: 150, description: 'Radio-optimized mix', requires: ['Editing'] },
      { name: 'Sound Design', price: 150, description: 'Jingles en effecten', requires: ['Editing', 'Mixage'] },
      { name: 'Klantregie', price: 75, description: 'Live productie feedback' },
      { name: 'Copywriting', price: 125, description: 'Pakkende radioteksten' },
    ],
  },
];

// Mock voiceover data
const mockVoiceovers = [
  { id: 1, name: 'Emma van Dijk', gender: 'Vrouw', age: '25-35', style: 'Warm & Vriendelijk', profilePhoto: '/api/placeholder/64/64' },
  { id: 2, name: 'Thomas Bakker', gender: 'Man', age: '35-45', style: 'Zakelijk & Betrouwbaar', profilePhoto: '/api/placeholder/64/64' },
  { id: 3, name: 'Sophie Jansen', gender: 'Vrouw', age: '20-30', style: 'Jong & Energiek', profilePhoto: '/api/placeholder/64/64' },
];

const steps = [
  { id: 1, title: 'Productie Type', icon: Video },
  { id: 2, title: 'Details', icon: Calculator },
  { id: 3, title: 'Extra\'s', icon: Sparkles },
  { id: 4, title: 'Voice-over', icon: User },
  { id: 5, title: 'Overzicht', icon: Check },
];

export function EnhancedPricingMockup1() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProduction, setSelectedProduction] = useState<string>('');
  const [selectedWordCount, setSelectedWordCount] = useState('');
  const [selectedVersions, setSelectedVersions] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('regionaal');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [selectedVoiceover, setSelectedVoiceover] = useState<any>(null);

  const currentProductionData = productionData.find(p => p.name === selectedProduction);

  const calculateTotal = () => {
    let total = currentProductionData?.price || 0;
    
    // Add word/version price
    if (currentProductionData?.wordOptions) {
      const wordOption = currentProductionData.wordOptions.find(w => w.value === selectedWordCount);
      if (wordOption) total += wordOption.price;
    } else if (currentProductionData?.versionOptions) {
      const versionOption = currentProductionData.versionOptions.find(v => v.value === selectedVersions);
      if (versionOption) total += versionOption.price;
    }
    
    // Add region price
    if (currentProductionData?.regionOptions) {
      const regionOption = currentProductionData.regionOptions.find(r => r.value === selectedRegion);
      if (regionOption) total += regionOption.price;
    }
    
    // Add extras
    selectedExtras.forEach(extra => {
      const extraData = currentProductionData?.extras.find(e => e.name === extra);
      if (extraData) total += extraData.price;
    });
    
    return total;
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedProduction !== '';
      case 2: return selectedWordCount !== '' || selectedVersions !== '';
      case 3: return true; // Extras are optional
      case 4: return selectedVoiceover !== null;
      default: return true;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleExtra = (extraName: string) => {
    const extra = currentProductionData?.extras.find(e => e.name === extraName);
    if (!extra) return;

    if (selectedExtras.includes(extraName)) {
      // Remove extra and dependent extras
      const newExtras = selectedExtras.filter(e => {
        const extraData = currentProductionData?.extras.find(ex => ex.name === e);
        return e !== extraName && !extraData?.requires?.includes(extraName);
      });
      setSelectedExtras(newExtras);
    } else {
      // Add extra and required extras
      const newExtras = [...selectedExtras];
      if (extra.requires) {
        extra.requires.forEach(req => {
          if (!newExtras.includes(req)) newExtras.push(req);
        });
      }
      newExtras.push(extraName);
      setSelectedExtras(newExtras);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Configureer Je <span className="text-[#18f109]">Voice-Over Project</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stap voor stap naar de perfecte voice-over productie
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex-1"
                >
                  <div className="relative">
                    {index < steps.length - 1 && (
                      <div 
                        className={`absolute left-1/2 top-6 w-full h-0.5 transition-all duration-500 ${
                          isCompleted ? 'bg-[#18f109]' : 'bg-gray-300'
                        }`}
                      />
                    )}
                    
                    <div className="relative flex flex-col items-center">
                      <motion.div
                        animate={{
                          scale: isActive ? 1.2 : 1,
                          backgroundColor: isActive ? '#18f109' : isCompleted ? '#18f109' : '#e5e7eb',
                        }}
                        className="w-12 h-12 rounded-full flex items-center justify-center relative z-10"
                      >
                        {isCompleted ? (
                          <Check className="w-6 h-6 text-white" />
                        ) : (
                          <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                        )}
                      </motion.div>
                      <span className={`text-sm mt-2 font-medium ${
                        isActive ? 'text-[#18f109]' : isCompleted ? 'text-gray-700' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <AnimatePresence mode="wait">
            {/* Step 1: Production Type */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-2xl font-bold mb-8 text-center">Kies je productiesoort</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {productionData.map((production) => {
                    const Icon = production.icon;
                    const isSelected = selectedProduction === production.name;
                    
                    return (
                      <motion.button
                        key={production.name}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedProduction(production.name);
                          // Reset dependent selections
                          setSelectedWordCount('');
                          setSelectedVersions('');
                          setSelectedExtras([]);
                        }}
                        className={`p-8 rounded-2xl border-2 transition-all text-left ${
                          isSelected 
                            ? 'border-[#18f109] bg-[#18f109]/5 shadow-lg' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className={`w-12 h-12 mb-4 ${isSelected ? 'text-[#18f109]' : 'text-gray-600'}`} />
                        <h4 className="text-xl font-semibold mb-2">{production.name}</h4>
                        <p className="text-gray-600 mb-4">{production.description}</p>
                        <p className="text-2xl font-bold">
                          Vanaf €{production.price}
                        </p>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-4 right-4 w-8 h-8 bg-[#18f109] rounded-full flex items-center justify-center"
                          >
                            <Check className="w-5 h-5 text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 2: Word Count / Versions */}
            {currentStep === 2 && currentProductionData && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-2xl font-bold mb-8 text-center">
                  {currentProductionData.wordOptions ? 'Aantal woorden' : 'Aantal versies'}
                </h3>
                
                {/* Word count options */}
                {currentProductionData.wordOptions && (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {currentProductionData.wordOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedWordCount(option.value)}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          selectedWordCount === option.value
                            ? 'border-[#18f109] bg-[#18f109]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="font-medium mb-2">{option.label}</p>
                        <p className="text-xl font-bold">
                          {option.price > 0 ? `+€${option.price}` : 'Basis'}
                        </p>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Version options */}
                {currentProductionData.versionOptions && (
                  <>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                      {currentProductionData.versionOptions.map((option) => (
                        <motion.button
                          key={option.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedVersions(option.value)}
                          className={`p-6 rounded-xl border-2 transition-all ${
                            selectedVersions === option.value
                              ? 'border-[#18f109] bg-[#18f109]/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <p className="font-medium mb-2">{option.label}</p>
                          <p className="text-xl font-bold">
                            {option.price > 0 ? `+€${option.price}` : 'Basis'}
                          </p>
                        </motion.button>
                      ))}
                    </div>

                    {/* Region options for commercials */}
                    {currentProductionData.regionOptions && (
                      <div>
                        <h4 className="text-lg font-semibold mb-4">Uitzendgebied</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          {currentProductionData.regionOptions.map((option) => (
                            <motion.button
                              key={option.value}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSelectedRegion(option.value)}
                              className={`p-6 rounded-xl border-2 transition-all ${
                                selectedRegion === option.value
                                  ? 'border-[#18f109] bg-[#18f109]/5'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <p className="font-medium mb-2">{option.label}</p>
                              <p className="text-xl font-bold">
                                {option.price > 0 ? `+€${option.price}` : 'Inclusief'}
                              </p>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {/* Step 3: Extras */}
            {currentStep === 3 && currentProductionData && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-2xl font-bold mb-8 text-center">Extra opties</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {currentProductionData.extras.map((extra) => {
                    const isSelected = selectedExtras.includes(extra.name);
                    const isDisabled = extra.requires?.some(req => !selectedExtras.includes(req));
                    
                    return (
                      <motion.div
                        key={extra.name}
                        whileHover={{ scale: !isDisabled ? 1.02 : 1 }}
                        className="relative"
                      >
                        <button
                          onClick={() => !isDisabled && toggleExtra(extra.name)}
                          disabled={isDisabled}
                          className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                            isSelected
                              ? 'border-[#18f109] bg-[#18f109]/5'
                              : isDisabled
                                ? 'border-gray-200 bg-gray-50 opacity-50'
                                : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center ${
                              isSelected
                                ? 'bg-[#18f109] border-[#18f109]'
                                : 'border-gray-400'
                            }`}>
                              {isSelected && <Check className="w-4 h-4 text-white" />}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">{extra.name}</h4>
                              <p className="text-sm text-gray-600 mb-2">{extra.description}</p>
                              <p className="text-lg font-bold">+€{extra.price}</p>
                              {extra.requires && (
                                <p className="text-xs text-[#18f109] mt-2">
                                  Vereist: {extra.requires.join(', ')}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 4: Voice Selection */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-2xl font-bold mb-8 text-center">Kies je voice-over artiest</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockVoiceovers.map((voice) => (
                    <motion.button
                      key={voice.id}
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedVoiceover(voice)}
                      className={`p-6 rounded-2xl border-2 transition-all ${
                        selectedVoiceover?.id === voice.id
                          ? 'border-[#18f109] bg-[#18f109]/5 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-12 h-12 text-gray-400" />
                        </div>
                      </div>
                      <h4 className="font-semibold text-lg mb-2">{voice.name}</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>{voice.gender} • {voice.age} jaar</p>
                        <p className="font-medium">{voice.style}</p>
                      </div>
                      <div className="mt-4 flex gap-2 justify-center">
                        <button className="px-3 py-1 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">
                          Beluister
                        </button>
                        <button className="px-3 py-1 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">
                          Profiel
                        </button>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 5: Summary */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-2xl font-bold mb-8 text-center">Overzicht van je project</h3>
                
                <div className="max-w-3xl mx-auto">
                  <div className="bg-gray-50 rounded-2xl p-8 mb-8">
                    {/* Production Type */}
                    <div className="mb-6 pb-6 border-b border-gray-200">
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Productiesoort</h4>
                      <p className="text-lg font-semibold">{selectedProduction}</p>
                    </div>

                    {/* Details */}
                    <div className="mb-6 pb-6 border-b border-gray-200">
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Details</h4>
                      {currentProductionData?.wordOptions && (
                        <p className="text-lg font-semibold">
                          {currentProductionData.wordOptions.find(w => w.value === selectedWordCount)?.label}
                        </p>
                      )}
                      {currentProductionData?.versionOptions && (
                        <>
                          <p className="text-lg font-semibold">
                            {currentProductionData.versionOptions.find(v => v.value === selectedVersions)?.label}
                          </p>
                          {currentProductionData.regionOptions && (
                            <p className="text-lg font-semibold mt-2">
                              Uitzendgebied: {currentProductionData.regionOptions.find(r => r.value === selectedRegion)?.label}
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    {/* Extras */}
                    {selectedExtras.length > 0 && (
                      <div className="mb-6 pb-6 border-b border-gray-200">
                        <h4 className="text-sm font-medium text-gray-600 mb-2">Extra opties</h4>
                        <ul className="space-y-2">
                          {selectedExtras.map(extra => (
                            <li key={extra} className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-[#18f109]" />
                              <span className="font-medium">{extra}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Voice-over */}
                    <div className="mb-6 pb-6 border-b border-gray-200">
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Voice-over artiest</h4>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-semibold">{selectedVoiceover?.name}</p>
                          <p className="text-sm text-gray-600">{selectedVoiceover?.style}</p>
                        </div>
                      </div>
                    </div>

                    {/* Total Price */}
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Totale investering</p>
                      <motion.p 
                        key={calculateTotal()}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="text-5xl font-bold text-[#18f109]"
                      >
                        €{calculateTotal()}
                      </motion.p>
                      <p className="text-sm text-gray-500 mt-1">Excl. BTW</p>
                    </div>
                  </div>

                  <button className="w-full bg-[#18f109] text-white font-semibold py-4 rounded-xl hover:bg-[#16d008] transition-colors">
                    Project Boeken
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Vorige
          </button>

          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index + 1 === currentStep ? 'w-8 bg-[#18f109]' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              canProceed()
                ? 'bg-[#18f109] text-white hover:bg-[#16d008]'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {currentStep === steps.length ? 'Voltooien' : 'Volgende'}
            {currentStep < steps.length && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </section>
  );
}