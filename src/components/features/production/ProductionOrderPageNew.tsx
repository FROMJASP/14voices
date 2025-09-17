'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bricolage_Grotesque, Instrument_Serif } from 'next/font/google';
import { ChevronDown, Check, ShoppingCart, Users, Mic, CheckCircle2, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  useVoiceoverSelectionStore,
  useCartStore,
  useCheckoutStore,
  useDrawerStore,
} from '@/stores';
import type { TransformedVoiceover } from '@/types/voiceover';
import { useProductions } from '@/hooks/useProductions';

const bricolageGrotesque = Bricolage_Grotesque({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bricolage',
});

const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
});

interface ProductionOrderPageProps {
  productionIndex: number;
  voiceovers: TransformedVoiceover[];
  hideCloseButton?: boolean;
}

export const ProductionOrderPage = React.memo(function ProductionOrderPage({
  productionIndex,
  voiceovers,
  hideCloseButton = false,
}: ProductionOrderPageProps) {
  const router = useRouter();
  const { productions, extraServices, loading: dataLoading } = useProductions();

  // Get production by index
  const production = productions[productionIndex];

  // State management
  const [selectedVoiceover, setSelectedVoiceover] = useState<{
    id: string;
    name: string;
    profilePhoto?: string;
    styleTags?: string[];
  } | null>(null);

  const [selectedWords, setSelectedWords] = useState<string>('');
  const [selectedVersions, setSelectedVersions] = useState<number>(1);
  const [selectedRegion, setSelectedRegion] = useState<'regionaal' | 'nationaal'>('regionaal');
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [voiceDropdownOpen, setVoiceDropdownOpen] = useState(false);
  const [wordsDropdownOpen, setWordsDropdownOpen] = useState(false);
  const [versionsDropdownOpen, setVersionsDropdownOpen] = useState(false);
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set());

  // Outside click handling
  const voiceDropdownRef = useRef<HTMLDivElement>(null);
  const wordsDropdownRef = useRef<HTMLDivElement>(null);
  const versionsDropdownRef = useRef<HTMLDivElement>(null);

  // Store references
  const addItem = useCartStore((state) => state.addItem);
  const openDrawer = useDrawerStore((state) => state.openDrawer);
  const resetCheckoutForm = useCheckoutStore((state) => state.resetForm);
  const resetProductionConfig = useCheckoutStore((state) => state.resetProductionConfig);
  const resetVoiceoverSelection = useVoiceoverSelectionStore((state) => state.clearSelection);

  // Close cart drawer when component mounts (for first-time load)
  useEffect(() => {
    const drawer = useDrawerStore.getState();
    if (drawer.isOpen && drawer.step === 'cart') {
      drawer.closeDrawer();
    }
  }, []);

  // Filter extra services for current production
  const availableServices = useMemo(() => {
    if (!production) return [];

    return extraServices.filter((service) =>
      service.productions.some((prod) =>
        typeof prod === 'string' ? prod === production.id : prod.id === production.id
      )
    );
  }, [production, extraServices]);

  // Calculate total price
  const calculateTotal = useCallback(() => {
    if (!production) return 0;

    let total = production.basePrice;

    // Add word-based pricing
    if (production.pricingType === 'wordBased' && selectedWords) {
      const tier = production.wordPricingTiers?.find((t) => {
        const [min, max] = selectedWords.split(' - ').map((s) => parseInt(s));
        return t.minWords === min && (t.maxWords === max || (!max && t.maxWords === 0));
      });
      if (tier) {
        total += tier.additionalPrice;
      }
    }

    // Add version-based pricing
    if (production.pricingType === 'versionBased') {
      const versionPrice = production.versionPricing?.find(
        (vp) => vp.versionCount === selectedVersions
      );
      if (versionPrice) {
        if (production.requiresRegion) {
          total =
            selectedRegion === 'regionaal'
              ? versionPrice.regionalPrice || 0
              : versionPrice.nationalPrice || 0;
        } else {
          total = versionPrice.price || 0;
        }
      }
    }

    // Add extra options
    selectedOptions.forEach((optionId) => {
      const service = availableServices.find((s) => s.id === optionId);
      if (service) {
        // Check for production-specific pricing
        const override = service.productionPriceOverrides?.find((po) =>
          typeof po.production === 'string'
            ? po.production === production.id
            : po.production.id === production.id
        );
        total += override ? override.overridePrice : service.basePrice;
      }
    });

    return total;
  }, [
    production,
    selectedWords,
    selectedVersions,
    selectedRegion,
    selectedOptions,
    availableServices,
  ]);

  // Handle option toggle
  const handleOptionToggle = (optionId: string) => {
    const service = availableServices.find((s) => s.id === optionId);
    if (!service) return;

    const newOptions = new Set(selectedOptions);

    if (newOptions.has(optionId)) {
      // Remove the option and any options that depend on it
      newOptions.delete(optionId);
      availableServices.forEach((s) => {
        if (
          s.dependencies?.some((depId) =>
            typeof depId === 'string' ? depId === optionId : depId.id === optionId
          )
        ) {
          newOptions.delete(s.id);
        }
      });
    } else {
      // Add the option and its dependencies
      newOptions.add(optionId);
      service.dependencies?.forEach((depId) => {
        const depIdStr = typeof depId === 'string' ? depId : depId.id;
        newOptions.add(depIdStr);
      });
    }

    setSelectedOptions(newOptions);
  };

  // Toggle accordion
  const toggleAccordion = (optionId: string) => {
    const newOpenAccordions = new Set(openAccordions);
    if (newOpenAccordions.has(optionId)) {
      newOpenAccordions.delete(optionId);
    } else {
      newOpenAccordions.add(optionId);
    }
    setOpenAccordions(newOpenAccordions);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!selectedVoiceover || !production) {
      alert('Selecteer een voice-over artiest');
      return;
    }

    if (production.pricingType === 'wordBased' && !selectedWords) {
      alert('Selecteer het aantal woorden');
      return;
    }

    const details = [`Voice-over: ${selectedVoiceover.name}`, `Productie: ${production.name}`];

    if (production.pricingType === 'wordBased') {
      details.push(`Woorden: ${selectedWords}`);
    } else if (production.pricingType === 'versionBased') {
      details.push(`Versies: ${selectedVersions}`);
      if (production.requiresRegion) {
        details.push(`Bereik: ${selectedRegion === 'regionaal' ? 'Regionaal' : 'Nationaal'}`);
      }
    }

    selectedOptions.forEach((optionId) => {
      const service = availableServices.find((s) => s.id === optionId);
      if (service) {
        details.push(`${service.name} (+€${service.basePrice})`);
      }
    });

    addItem({
      id: `${selectedVoiceover.id}-${production.id}-${Date.now()}`,
      name: `${selectedVoiceover.name} - ${production.name}`,
      price: calculateTotal(),
      details,
    });

    // Open cart drawer
    openDrawer('cart');

    // Show success message
    setTimeout(() => {
      alert('Product toegevoegd aan winkelwagen!');
    }, 300);
  };

  // Handle close
  const handleClose = () => {
    resetCheckoutForm();
    resetProductionConfig();
    resetVoiceoverSelection();
    router.push('/');
  };

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (voiceDropdownRef.current && !voiceDropdownRef.current.contains(event.target as Node)) {
        setVoiceDropdownOpen(false);
      }
      if (wordsDropdownRef.current && !wordsDropdownRef.current.contains(event.target as Node)) {
        setWordsDropdownOpen(false);
      }
      if (
        versionsDropdownRef.current &&
        !versionsDropdownRef.current.contains(event.target as Node)
      ) {
        setVersionsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (dataLoading || !production) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Laden...</p>
        </div>
      </div>
    );
  }

  const videoUrl =
    typeof production.videoUrl === 'object' ? production.videoUrl?.url : production.videoUrl;

  return (
    <div
      className={`fixed inset-0 z-[100] overflow-hidden ${bricolageGrotesque.variable} ${instrumentSerif.variable} font-sans`}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80"
        onClick={handleClose}
      />

      {/* Content */}
      <div className="relative h-full flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white dark:bg-gray-900 w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with close button */}
          {!hideCloseButton && (
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={handleClose}
                className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          )}

          <div className="flex flex-col lg:flex-row h-full">
            {/* Left Column - Video and Info */}
            <div className="lg:w-1/2 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
              {/* Background video */}
              <div className="absolute inset-0">
                {videoUrl && (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-30"
                    src={videoUrl}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-between p-8 lg:p-12">
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                    {production.name}
                  </h1>
                  <p className="text-gray-200 text-lg mb-6">{production.description}</p>

                  {/* Features list */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                      <span className="text-gray-200">Professionele kwaliteit gegarandeerd</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                      <span className="text-gray-200">Levering binnen 48 uur mogelijk</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                      <span className="text-gray-200">
                        {production.buyoutDuration || '12 maanden'} gebruiksrecht
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price tag */}
                <div
                  className="mt-8 p-6 rounded-xl backdrop-blur-md"
                  style={{
                    backgroundColor: `${'#18f109'}20`,
                    borderColor: '#18f109',
                    borderWidth: '2px',
                  }}
                >
                  <p className="text-sm text-gray-300 mb-1">Vanaf</p>
                  <p className="text-4xl font-bold text-white">€{production.basePrice}</p>
                  <p className="text-sm text-gray-300 mt-1">excl. BTW</p>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="lg:w-1/2 bg-white dark:bg-gray-800 p-6 lg:p-8 overflow-y-auto">
              <div className="space-y-6">
                {/* Voice-over Selection */}
                <div>
                  <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 block">
                    1. Kies je voice-over artiest
                  </label>
                  <div className="relative" ref={voiceDropdownRef}>
                    <button
                      onClick={() => setVoiceDropdownOpen(!voiceDropdownOpen)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900 transition-all flex items-center justify-between"
                    >
                      {selectedVoiceover ? (
                        <div className="flex items-center gap-3">
                          {selectedVoiceover.profilePhoto && (
                            <Image
                              src={selectedVoiceover.profilePhoto}
                              alt={selectedVoiceover.name}
                              width={40}
                              height={40}
                              className="rounded-full object-cover"
                            />
                          )}
                          <div className="text-left">
                            <p className="font-semibold text-gray-900 dark:text-gray-100">
                              {selectedVoiceover.name}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {selectedVoiceover.styleTags?.slice(0, 2).join(', ')}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400 font-medium">
                          Kies een voice-over artiest
                        </span>
                      )}
                      <ChevronDown
                        className={`w-5 h-5 text-muted-foreground transition-transform ${voiceDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    <AnimatePresence>
                      {voiceDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto"
                        >
                          {voiceovers.map((voice) => (
                            <button
                              key={voice.id}
                              onClick={() => {
                                setSelectedVoiceover({
                                  id: voice.id,
                                  name: voice.name,
                                  profilePhoto: voice.profilePhoto?.url,
                                  styleTags:
                                    voice.styleTags?.map((st) => st.customTag || st.tag) || [],
                                });
                                setVoiceDropdownOpen(false);
                              }}
                              className={`w-full px-4 py-3 transition-colors flex items-center gap-3 ${
                                selectedVoiceover?.id === voice.id
                                  ? 'bg-green-50 dark:bg-green-900/20'
                                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                              }`}
                            >
                              {voice.profilePhoto?.url && (
                                <Image
                                  src={voice.profilePhoto.url}
                                  alt={voice.name}
                                  width={40}
                                  height={40}
                                  className="rounded-full object-cover flex-shrink-0"
                                />
                              )}
                              <div className="flex-1 text-left">
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                  {voice.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {voice.styleTags
                                    ?.slice(0, 3)
                                    .map((st) => st.customTag || st.tag)
                                    .join(', ')}
                                </p>
                              </div>
                              {selectedVoiceover?.id === voice.id && (
                                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                              )}
                            </button>
                          ))}
                          <Link
                            href="/voiceovers"
                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 border-t-2 border-gray-100 dark:border-gray-800"
                          >
                            <Users className="w-4 h-4" />
                            Bekijk alle stemmen
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Region Selection (for applicable productions) */}
                {production.pricingType === 'versionBased' && production.requiresRegion && (
                  <div>
                    <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 block">
                      2. Selecteer bereik
                    </label>
                    <div className="flex gap-3">
                      {['regionaal', 'nationaal'].map((region) => (
                        <button
                          key={region}
                          onClick={() => setSelectedRegion(region as 'regionaal' | 'nationaal')}
                          className={`px-4 py-2.5 rounded-lg border-2 font-medium transition-all capitalize ${
                            selectedRegion === region
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-gray-900 dark:text-gray-100'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {region}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Word/Version Selection */}
                <div>
                  <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 block">
                    {production.requiresRegion ? '3. ' : '2. '}
                    {production.pricingType === 'wordBased' ? 'Aantal woorden' : 'Aantal versies'}
                  </label>

                  {production.pricingType === 'wordBased' ? (
                    <div className="relative" ref={wordsDropdownRef}>
                      <button
                        onClick={() => setWordsDropdownOpen(!wordsDropdownOpen)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900 transition-all flex items-center justify-between text-sm"
                      >
                        <span
                          className={
                            selectedWords
                              ? 'text-gray-900 dark:text-gray-100 font-medium'
                              : 'text-gray-500 dark:text-gray-400'
                          }
                        >
                          {selectedWords || 'Selecteer een optie'}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-muted-foreground transition-transform ${wordsDropdownOpen ? 'rotate-180' : ''}`}
                        />
                      </button>

                      <AnimatePresence>
                        {wordsDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-40 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"
                          >
                            {production.wordPricingTiers?.map((tier) => {
                              const label =
                                tier.maxWords === 0
                                  ? `${tier.minWords}+`
                                  : `${tier.minWords} - ${tier.maxWords}`;
                              return (
                                <button
                                  key={label}
                                  onClick={() => {
                                    setSelectedWords(label);
                                    setWordsDropdownOpen(false);
                                  }}
                                  className="w-full px-3 py-2.5 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex justify-between items-center"
                                >
                                  <span className="text-gray-900 dark:text-gray-100">{label}</span>
                                  <span className="text-gray-500 dark:text-gray-400 text-xs">
                                    {tier.additionalPrice === 0
                                      ? '+€0'
                                      : `+€${tier.additionalPrice}`}
                                  </span>
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="relative" ref={versionsDropdownRef}>
                      <button
                        onClick={() => setVersionsDropdownOpen(!versionsDropdownOpen)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900 transition-all flex items-center justify-between text-sm"
                      >
                        <span className="text-gray-900 dark:text-gray-100 font-medium">
                          {selectedVersions} {selectedVersions === 1 ? 'versie' : 'versies'}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-muted-foreground transition-transform ${versionsDropdownOpen ? 'rotate-180' : ''}`}
                        />
                      </button>

                      <AnimatePresence>
                        {versionsDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-40 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"
                          >
                            {production.versionPricing?.map((vp) => (
                              <button
                                key={vp.versionCount}
                                onClick={() => {
                                  setSelectedVersions(vp.versionCount);
                                  setVersionsDropdownOpen(false);
                                }}
                                className="w-full px-3 py-2.5 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex justify-between items-center"
                              >
                                <span className="text-gray-900 dark:text-gray-100">
                                  {vp.versionCount} {vp.versionCount === 1 ? 'versie' : 'versies'}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400 text-xs">
                                  €
                                  {production.requiresRegion
                                    ? selectedRegion === 'regionaal'
                                      ? vp.regionalPrice
                                      : vp.nationalPrice
                                    : vp.price}
                                </span>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                {/* Extra Options */}
                {availableServices.length > 0 && (
                  <div>
                    <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 block">
                      {production.requiresRegion ? '4. ' : '3. '}Extra diensten
                    </label>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 space-y-2">
                      {availableServices.map((service) => {
                        const isSelected = selectedOptions.has(service.id);
                        const isDisabled =
                          service.dependencies?.some((dep) => {
                            const depId = typeof dep === 'string' ? dep : dep.id;
                            return !selectedOptions.has(depId);
                          }) ?? false;
                        const isOpen = openAccordions.has(service.id);

                        return (
                          <div key={service.id} className={`${isDisabled ? 'opacity-50' : ''}`}>
                            <div className="flex items-start gap-2">
                              <button
                                onClick={() => !isDisabled && handleOptionToggle(service.id)}
                                disabled={isDisabled}
                                className={`relative w-5 h-5 rounded-md flex-shrink-0 mt-0.5 transition-all ${
                                  isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
                                }`}
                              >
                                <div
                                  className={`absolute inset-0 rounded-md border-2 transition-all ${
                                    isSelected
                                      ? 'border-green-500 bg-green-500'
                                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                                  }`}
                                />
                                <AnimatePresence>
                                  {isSelected && (
                                    <motion.div
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      exit={{ scale: 0, opacity: 0 }}
                                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                      className="absolute inset-0 flex items-center justify-center"
                                    >
                                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </button>
                              <div
                                className="flex-1 cursor-pointer"
                                onClick={() => toggleAccordion(service.id)}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <p
                                      className={`text-sm font-medium ${
                                        isSelected
                                          ? 'text-gray-900 dark:text-gray-100'
                                          : 'text-gray-700 dark:text-gray-300'
                                      }`}
                                    >
                                      {service.name}
                                    </p>
                                    {!isOpen &&
                                      service.dependencies &&
                                      service.dependencies.length > 0 && (
                                        <p className="text-xs text-orange-600 dark:text-orange-400 mt-0.5">
                                          Vereist:{' '}
                                          {service.dependencies
                                            .map((dep) => {
                                              const depService = extraServices.find(
                                                (s) =>
                                                  s.id === (typeof dep === 'string' ? dep : dep.id)
                                              );
                                              return depService?.name;
                                            })
                                            .filter(Boolean)
                                            .join(', ')}
                                        </p>
                                      )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      +€{service.basePrice}
                                    </span>
                                    <ChevronDown
                                      className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${
                                        isOpen ? 'rotate-180' : ''
                                      }`}
                                    />
                                  </div>
                                </div>
                                <AnimatePresence>
                                  {isOpen && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="mt-2 text-xs text-gray-600 dark:text-gray-400 overflow-hidden"
                                    >
                                      <p>{service.infoText || service.description}</p>
                                      {service.dependencies && service.dependencies.length > 0 && (
                                        <p className="text-orange-600 dark:text-orange-400 mt-1">
                                          Deze optie vereist:{' '}
                                          {service.dependencies
                                            .map((dep) => {
                                              const depService = extraServices.find(
                                                (s) =>
                                                  s.id === (typeof dep === 'string' ? dep : dep.id)
                                              );
                                              return depService?.name;
                                            })
                                            .filter(Boolean)
                                            .join(', ')}
                                        </p>
                                      )}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer with Total and CTA */}
              <div className="mt-8 p-6 bg-gradient-to-t from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl border border-gray-100 dark:border-gray-800">
                {/* Order Summary */}
                <div className="space-y-2 mb-4">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    Jouw bestelling
                  </p>

                  {/* Selected Items */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{production.name}</span>
                      <span className="font-medium">€{production.basePrice}</span>
                    </div>

                    {selectedVoiceover && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <Mic className="w-3 h-3" />
                          {selectedVoiceover.name}
                        </span>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      </div>
                    )}

                    {production.pricingType === 'wordBased' && selectedWords && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {selectedWords} woorden
                        </span>
                        {production.wordPricingTiers?.find((tier) => {
                          const [min, max] = selectedWords.split(' - ').map((s) => parseInt(s));
                          return (
                            tier.minWords === min &&
                            (tier.maxWords === max || (!max && tier.maxWords === 0))
                          );
                        })?.additionalPrice !== 0 && (
                          <span className="font-medium">
                            +€
                            {production.wordPricingTiers?.find((tier) => {
                              const [min, max] = selectedWords.split(' - ').map((s) => parseInt(s));
                              return (
                                tier.minWords === min &&
                                (tier.maxWords === max || (!max && tier.maxWords === 0))
                              );
                            })?.additionalPrice || 0}
                          </span>
                        )}
                      </div>
                    )}

                    {production.pricingType === 'versionBased' && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {selectedVersions} {selectedVersions === 1 ? 'versie' : 'versies'}
                          {production.requiresRegion && (
                            <span className="ml-1">({selectedRegion})</span>
                          )}
                        </span>
                      </div>
                    )}

                    {Array.from(selectedOptions).map((optionId) => {
                      const service = availableServices.find((s) => s.id === optionId);
                      return service ? (
                        <div key={optionId} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">✓ {service.name}</span>
                          <span className="font-medium">+€{service.basePrice}</span>
                        </div>
                      ) : null;
                    })}
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">Totaal</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      €{calculateTotal()}
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={
                    !selectedVoiceover || (production.pricingType === 'wordBased' && !selectedWords)
                  }
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                    selectedVoiceover && (production.pricingType !== 'wordBased' || selectedWords)
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Toevoegen aan winkelwagen
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
});
