'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Info, Video, Clock, FileText, Infinity } from 'lucide-react';
import { useCartStore, useDrawerStore } from '@/stores';
import { TransformedVoiceover } from '@/types/voiceover';
import { Bricolage_Grotesque } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { VoiceoverPlayerCard } from './VoiceoverPlayerCard';
import { SimpleScriptEditor } from './SimpleScriptEditor';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AudioNotes } from './AudioNotes';
import { useProductions } from '@/hooks/useProductions';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

// Import the CSS for trapezoid shapes
import './custom-card.css';

const bricolageGrotesque = Bricolage_Grotesque({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bricolage',
});

interface VoiceoverDetailClientProps {
  voiceover: TransformedVoiceover;
}

export function VoiceoverDetailClient({ voiceover }: VoiceoverDetailClientProps) {
  const router = useRouter();
  const { productions, extraServices, loading: dataLoading } = useProductions();

  // Create a unique storage key for this voiceover
  const storageKey = `voiceover-form-${voiceover.id}`;

  // Load saved form data from localStorage with auto-selection of first production
  const [savedFormData, setSavedFormData] = useLocalStorage(storageKey, {
    productionId: productions.length > 0 ? productions[0].id : '',
    selectedRegion: 'regional' as 'regional' | 'national',
    script: '',
    selectedExtras: [] as string[],
    instructions: '',
    videoLink: '',
  });

  // Form state
  const [selectedProductionId, setSelectedProductionId] = useState<string>(
    savedFormData.productionId
  );
  const [selectedRegion, setSelectedRegion] = useState<'regional' | 'national'>(
    savedFormData.selectedRegion
  );
  const [script, setScript] = useState<string>(savedFormData.script);
  const [selectedExtras, setSelectedExtras] = useState<string[]>(savedFormData.selectedExtras);
  const [instructions, setInstructions] = useState<string>(savedFormData.instructions);
  const [videoLink, setVideoLink] = useState<string>(savedFormData.videoLink);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProductionError, setShowProductionError] = useState(false);
  const [expandedExtras, setExpandedExtras] = useState<Set<string>>(new Set());

  // Store references
  const addItem = useCartStore((state) => state.addItem);
  const openDrawer = useDrawerStore((state) => state.openDrawer);

  // Get first name only
  const firstName = voiceover.name.split(' ')[0];

  // Find selected production
  const selectedProduction = productions.find((p) => p.id === selectedProductionId);

  // Helper function to check if buyout is infinity
  const isInfinityBuyout = (duration: string | undefined) => {
    return duration?.toLowerCase() === 'oneindig' || duration?.toLowerCase() === 'infinity';
  };

  // Filter extra services based on selected production
  const availableServices = useMemo(() => {
    if (!selectedProductionId) return [];

    return extraServices.filter((service) =>
      service.productions.some((prod) =>
        typeof prod === 'string' ? prod === selectedProductionId : prod.id === selectedProductionId
      )
    );
  }, [selectedProductionId, extraServices]);

  // Handle navigation back to homepage with scroll
  const handleBackToVoiceovers = useCallback(() => {
    sessionStorage.setItem('scrollToVoiceovers', 'true');
    router.push('/');
  }, [router]);

  // Auto-select first production when productions are loaded and none is selected
  useEffect(() => {
    if (!dataLoading && productions.length > 0 && !selectedProductionId) {
      setSelectedProductionId(productions[0].id);
    }
  }, [dataLoading, productions, selectedProductionId]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    setSavedFormData({
      productionId: selectedProductionId,
      selectedRegion,
      script,
      selectedExtras,
      instructions,
      videoLink,
    });
  }, [selectedProductionId, selectedRegion, script, selectedExtras, instructions, videoLink]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    if (!selectedProduction) return 0;

    let price = selectedProduction.basePrice;

    // Calculate based on pricing type
    if (selectedProduction.pricingType === 'wordBased') {
      if (selectedProduction.wordPricingTiers) {
        // Find applicable tier
        for (const tier of selectedProduction.wordPricingTiers) {
          if (wordCount >= tier.minWords && (tier.maxWords === 0 || wordCount <= tier.maxWords)) {
            price += tier.additionalPrice;
            break;
          }
        }

        // Apply formula for words above highest tier
        if (selectedProduction.wordPricingFormula?.enabled) {
          const highestTier =
            selectedProduction.wordPricingTiers[selectedProduction.wordPricingTiers.length - 1];
          if (highestTier && wordCount > highestTier.maxWords && highestTier.maxWords !== 0) {
            const extraWords = wordCount - highestTier.maxWords;
            price += highestTier.additionalPrice;
            price += extraWords * (selectedProduction.wordPricingFormula.pricePerWord || 0);
          }
        }
      }
    } else if (selectedProduction.pricingType === 'versionBased') {
      // For version-based, we use 1 version as default
      const versionPrice = selectedProduction.versionPricing?.find((vp) => vp.versionCount === 1);
      if (versionPrice) {
        if (selectedProduction.requiresRegion) {
          price =
            selectedRegion === 'regional'
              ? versionPrice.regionalPrice || 0
              : versionPrice.nationalPrice || 0;
        } else {
          price = versionPrice.price || 0;
        }
      }
    }

    // Add extra services
    selectedExtras.forEach((serviceId) => {
      const service = availableServices.find((s) => s.id === serviceId);
      if (service) {
        // Check for production-specific pricing
        const override = service.productionPriceOverrides?.find((po) =>
          typeof po.production === 'string'
            ? po.production === selectedProductionId
            : po.production.id === selectedProductionId
        );
        price += override ? override.overridePrice : service.basePrice;
      }
    });

    return price;
  }, [
    selectedProduction,
    wordCount,
    selectedRegion,
    selectedExtras,
    availableServices,
    selectedProductionId,
  ]);

  // Handle extra service toggle
  const handleExtraToggle = (serviceId: string) => {
    const service = availableServices.find((s) => s.id === serviceId);
    if (!service) return;

    const newExtras = new Set(selectedExtras);

    if (newExtras.has(serviceId)) {
      // Remove the service and any services that depend on it
      newExtras.delete(serviceId);
      availableServices.forEach((s) => {
        if (
          s.dependencies?.some((depId) =>
            typeof depId === 'string' ? depId === serviceId : depId.id === serviceId
          )
        ) {
          newExtras.delete(s.id);
        }
      });
    } else {
      // Add the service and its dependencies
      newExtras.add(serviceId);
      service.dependencies?.forEach((depId) => {
        const depIdStr = typeof depId === 'string' ? depId : depId.id;
        newExtras.add(depIdStr);
      });
    }

    setSelectedExtras(Array.from(newExtras));
  };

  // Toggle extra info
  const toggleExtraInfo = (serviceId: string) => {
    const newExpanded = new Set(expandedExtras);
    if (newExpanded.has(serviceId)) {
      newExpanded.delete(serviceId);
    } else {
      newExpanded.add(serviceId);
    }
    setExpandedExtras(newExpanded);
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!selectedProductionId || !selectedProduction) {
      setShowProductionError(true);
      const productionElement = document.getElementById('production-selector');
      if (productionElement) {
        productionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      setTimeout(() => setShowProductionError(false), 3000);
      return;
    }

    if (!script.trim()) {
      alert('Voer een script in');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare cart item details
      const details = [
        `Productiesoort: ${selectedProduction.name}`,
        `Aantal woorden: ${wordCount}`,
      ];

      if (selectedProduction.requiresRegion) {
        details.push(`Bereik: ${selectedRegion === 'regional' ? 'Regionaal' : 'Nationaal'}`);
      }

      selectedExtras.forEach((serviceId) => {
        const service = availableServices.find((s) => s.id === serviceId);
        if (service) {
          details.push(`${service.name} (+€${service.basePrice})`);
        }
      });

      if (instructions.trim()) {
        details.push(`Instructies: ${instructions}`);
      }

      if (videoLink.trim()) {
        details.push(`Videolink: ${videoLink}`);
      }

      addItem({
        id: `${voiceover.id}-${Date.now()}`,
        name: `${voiceover.name} - ${selectedProduction.name}`,
        price: totalPrice,
        details,
      });

      // Clear form
      setSelectedProductionId('');
      setScript('');
      setSelectedExtras([]);
      setInstructions('');
      setVideoLink('');
      setAudioFile(null);
      setWordCount(0);

      // Clear saved form data
      setSavedFormData({
        productionId: '',
        selectedRegion: 'regional',
        script: '',
        selectedExtras: [],
        instructions: '',
        videoLink: '',
      });

      // Show success feedback
      alert('Toegevoegd aan winkelwagen!');

      // Open cart drawer
      openDrawer('cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Er is iets misgegaan. Probeer het opnieuw.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${bricolageGrotesque.variable} font-sans min-h-screen bg-background text-foreground`}
    >
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        {/* Back button */}
        <div className="mb-8">
          <button
            onClick={handleBackToVoiceovers}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Terug naar alle stemmen</span>
          </button>
        </div>

        {/* Mobile voiceover card */}
        <div className="lg:hidden mb-8">
          <VoiceoverPlayerCard voiceover={voiceover} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* LEFT SIDE - Booking Form (Desktop) */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            <motion.div
              id="booking-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Boek {firstName}
                </h1>
                <p className="text-muted-foreground text-lg">
                  Vul onderstaand formulier in om {firstName} te boeken voor jouw project.
                </p>
              </div>

              {/* Step 1: Production Type Selection */}
              <div className="space-y-6" id="production-selector">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                    1
                  </div>
                  <h2 className="text-lg font-semibold">Kies je productiesoort</h2>
                </div>

                {showProductionError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive"
                  >
                    Selecteer eerst een productiesoort
                  </motion.div>
                )}

                {/* Desktop Layout - Split View */}
                <div className="hidden lg:grid lg:grid-cols-5 gap-6">
                  {/* Left Side - Selected Production Detail */}
                  <div className="lg:col-span-3">
                    {selectedProduction ? (
                      <motion.div
                        key={selectedProduction.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        {/* Selected Production Video */}
                        <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-muted">
                          {selectedProduction.videoUrl ? (
                            <video
                              src={
                                typeof selectedProduction.videoUrl === 'object'
                                  ? selectedProduction.videoUrl.url
                                  : selectedProduction.videoUrl
                              }
                              muted
                              playsInline
                              loop
                              autoPlay
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Video className="w-12 h-12 text-muted-foreground" />
                            </div>
                          )}

                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                          {/* Title Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h3 className="text-2xl font-bold text-white mb-2">
                              {selectedProduction.name}
                            </h3>
                            <p className="text-lg text-white/90">
                              Vanaf €{selectedProduction.basePrice}
                            </p>
                          </div>
                        </div>

                        {/* Full Description */}
                        <div className="bg-muted/30 rounded-lg p-4">
                          <h4 className="text-base font-semibold text-foreground mb-2">
                            Wat is een {selectedProduction.name}?
                          </h4>
                          <p className="text-sm text-foreground leading-relaxed mb-3">
                            {selectedProduction.description}
                          </p>

                          {/* Buyout Information */}
                          <div className="mt-3 pt-3 border-t border-border/50">
                            <p className="text-xs font-medium text-muted-foreground mb-2">
                              Hoe lang mag ik de opnames gebruiken? (buy-out)
                            </p>
                            <Badge variant="secondary">
                              {isInfinityBuyout(selectedProduction.buyoutDuration) ? (
                                <>
                                  <Infinity className="w-3 h-3 mr-1" />
                                  {selectedProduction.buyoutDuration}
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3 mr-1" />
                                  {selectedProduction.buyoutDuration || '12 maanden'}
                                </>
                              )}
                            </Badge>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="aspect-[16/9] rounded-lg bg-muted/30 flex items-center justify-center">
                        <p className="text-muted-foreground text-center px-4">
                          Selecteer een productiesoort om details te bekijken
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Side - Production List */}
                  <div className="lg:col-span-2">
                    <div className="space-y-2">
                      {productions.map((production) => {
                        const isSelected = selectedProductionId === production.id;
                        const videoUrl =
                          typeof production.videoUrl === 'object'
                            ? production.videoUrl?.url
                            : production.videoUrl;

                        return (
                          <motion.button
                            key={production.id}
                            className={`w-full text-left rounded-lg border transition-all ${
                              isSelected
                                ? 'border-primary bg-primary/10'
                                : 'border-border hover:border-border/60 hover:bg-muted/30'
                            }`}
                            onClick={() => {
                              setSelectedProductionId(production.id);
                              setShowProductionError(false);
                              setSelectedExtras([]);
                            }}
                            whileHover={{ x: 2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center gap-3 p-3">
                              {/* Mini Video Thumbnail */}
                              <div className="relative w-20 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
                                {videoUrl ? (
                                  <video
                                    src={videoUrl}
                                    muted
                                    playsInline
                                    loop
                                    autoPlay
                                    className="absolute inset-0 w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <Video className="w-6 h-6 text-muted-foreground" />
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-black/20" />
                              </div>

                              {/* Production Info */}
                              <div className="flex-1 min-w-0">
                                <h4
                                  className={`font-medium text-sm ${
                                    isSelected ? 'text-primary' : 'text-foreground'
                                  }`}
                                >
                                  {production.name}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  Vanaf €{production.basePrice}
                                </p>
                              </div>

                              {/* Selected Indicator */}
                              {isSelected && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="p-1 bg-primary text-primary-foreground rounded-full flex-shrink-0"
                                >
                                  <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </motion.div>
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Mobile/Tablet Layout - Grid View */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:hidden">
                  {productions.map((production) => {
                    const isSelected = selectedProductionId === production.id;
                    const videoUrl =
                      typeof production.videoUrl === 'object'
                        ? production.videoUrl?.url
                        : production.videoUrl;

                    return (
                      <motion.button
                        key={production.id}
                        className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50 bg-card'
                        }`}
                        onClick={() => {
                          setSelectedProductionId(production.id);
                          setShowProductionError(false);
                          setSelectedExtras([]);
                        }}
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3 p-3">
                          {/* Mini Video Thumbnail */}
                          <div className="relative w-20 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
                            {videoUrl ? (
                              <video
                                src={videoUrl}
                                muted
                                playsInline
                                loop
                                autoPlay
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Video className="w-6 h-6 text-muted-foreground" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/20" />
                          </div>

                          {/* Production Info */}
                          <div className="flex-1 min-w-0 text-left">
                            <h4
                              className={`font-medium text-sm ${
                                isSelected ? 'text-primary' : 'text-foreground'
                              }`}
                            >
                              {production.name}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              Vanaf €{production.basePrice}
                            </p>
                          </div>

                          {/* Selected Indicator */}
                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="p-1 bg-primary text-primary-foreground rounded-full flex-shrink-0"
                            >
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Production Description & Buyout Info - Mobile Only */}
                {selectedProduction && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-muted/30 rounded-lg p-4 space-y-3 lg:hidden"
                  >
                    <p className="text-sm text-muted-foreground">
                      {selectedProduction.description}
                    </p>
                    <div className="pt-3 border-t border-border/50">
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Hoe lang mag ik de opnames gebruiken? (buy-out)
                      </p>
                      <Badge variant="secondary">
                        {isInfinityBuyout(selectedProduction.buyoutDuration) ? (
                          <>
                            <Infinity className="w-3 h-3 mr-1" />
                            {selectedProduction.buyoutDuration}
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 mr-1" />
                            {selectedProduction.buyoutDuration || '12 maanden'}
                          </>
                        )}
                      </Badge>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Step 2: Regional/National Selection (for applicable productions) */}
              {selectedProduction?.pricingType === 'versionBased' &&
                selectedProduction.requiresRegion && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                        2
                      </div>
                      <h2 className="text-lg font-semibold">Bereik</h2>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedRegion('regional')}
                        className={`px-4 py-2 rounded-md border-2 font-medium transition-all ${
                          selectedRegion === 'regional'
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        Regionaal
                      </button>
                      <button
                        onClick={() => setSelectedRegion('national')}
                        className={`px-4 py-2 rounded-md border-2 font-medium transition-all ${
                          selectedRegion === 'national'
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        Nationaal
                      </button>
                    </div>
                  </motion.div>
                )}

              {/* Step 2: Script, Instructions & Video Link */}
              {selectedProduction && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                      {selectedProduction.requiresRegion ? 3 : 2}
                    </div>
                    <h2 className="text-lg font-semibold">Script & Instructies</h2>
                  </div>

                  {/* Script Section */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Script (alleen tekst voor voice-over)
                      </h3>
                      <span className="text-sm text-muted-foreground">{wordCount} woorden</span>
                    </div>
                    <SimpleScriptEditor
                      value={script}
                      onChange={setScript}
                      onWordCountChange={setWordCount}
                      placeholder={
                        selectedProduction.formSettings?.scriptPlaceholder?.replace(
                          '{voiceoverName}',
                          firstName
                        ) || `Plak of schrijf hier het script dat ${firstName} zal inspreken...`
                      }
                      voiceoverName={firstName}
                    />
                  </div>

                  {/* Instructions Section */}
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-foreground mb-3">
                      Instructies (optioneel)
                    </h3>
                    <AudioNotes
                      textValue={instructions}
                      onTextChange={setInstructions}
                      audioFile={audioFile}
                      onAudioFileChange={setAudioFile}
                      placeholder={(() => {
                        const placeholderText =
                          selectedProduction.formSettings?.instructionsPlaceholder;

                        // Check if placeholder is just HTML tags without content
                        if (
                          placeholderText &&
                          placeholderText.replace(/<[^>]*>/g, '').trim() === ''
                        ) {
                          // Use default placeholder if only HTML tags
                          return 'Je kunt hier instructies typen en/of een audiobestand uploaden met aanwijzingen';
                        }

                        // Otherwise use the placeholder from settings or default
                        return placeholderText
                          ? placeholderText.replace('{voiceoverName}', firstName)
                          : 'Je kunt hier instructies typen en/of een audiobestand uploaden met aanwijzingen';
                      })()}
                    />
                  </div>

                  {/* Video Link Section */}
                  {selectedProduction?.formSettings?.showVideoLinkField !== false && (
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-foreground mb-3">
                        Videolink (optioneel)
                      </h3>
                      <Input
                        type="url"
                        value={videoLink}
                        onChange={(e) => setVideoLink(e.target.value)}
                        placeholder={
                          selectedProduction.formSettings?.videoLinkPlaceholder ||
                          'Link naar referentievideo (optioneel)'
                        }
                        className="w-full border-0"
                      />
                    </div>
                  )}
                </motion.div>
              )}

              {/* Info text between sections */}
              {selectedProduction && availableServices.length > 0 && (
                <div className="text-sm text-muted-foreground text-center py-2">
                  Je kunt extra services toevoegen aan je bestelling
                </div>
              )}

              {/* Step 3: Extra Services */}
              {selectedProduction && availableServices.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                      {selectedProduction.requiresRegion ? 4 : 3}
                    </div>
                    <h2 className="text-lg font-semibold">Extra diensten (optioneel)</h2>
                  </div>
                  <div className="bg-card border rounded-lg p-4 space-y-3">
                    {availableServices.map((service) => {
                      const isSelected = selectedExtras.includes(service.id);
                      const isDisabled = service.dependencies?.some((dep) => {
                        const depId = typeof dep === 'string' ? dep : dep.id;
                        return !selectedExtras.includes(depId);
                      });
                      const isExpanded = expandedExtras.has(service.id);

                      return (
                        <div key={service.id} className={isDisabled ? 'opacity-50' : ''}>
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              id={service.id}
                              checked={isSelected}
                              onChange={() => handleExtraToggle(service.id)}
                              disabled={isDisabled}
                              className="mt-1 rounded border-gray-300"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <label
                                  htmlFor={service.id}
                                  className="font-medium cursor-pointer text-sm"
                                >
                                  {service.name}
                                </label>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">+€{service.basePrice}</span>
                                  {service.infoText && (
                                    <button
                                      onClick={() => toggleExtraInfo(service.id)}
                                      className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                      <Info className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                              {service.description && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {service.description}
                                </p>
                              )}
                              {isDisabled && service.dependencies && (
                                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                  Vereist:{' '}
                                  {service.dependencies
                                    .map((dep) => {
                                      const depService = extraServices.find(
                                        (s) => s.id === (typeof dep === 'string' ? dep : dep.id)
                                      );
                                      return depService?.name;
                                    })
                                    .filter(Boolean)
                                    .join(', ')}
                                </p>
                              )}
                              <AnimatePresence>
                                {isExpanded && service.infoText && (
                                  <motion.p
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="text-xs text-muted-foreground mt-2"
                                  >
                                    {service.infoText}
                                  </motion.p>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Add to cart button */}
              <div className="mb-6 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedProductionId || !script.trim() || isSubmitting}
                  className="w-full h-12 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    'Toevoegen...'
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Toevoegen aan winkelwagen
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDE - Voiceover Card + Price Summary (Desktop) */}
          <div className="lg:col-span-4 order-1 lg:order-2">
            <div className="lg:sticky lg:top-24">
              {/* Desktop Voiceover Player Card */}
              <div className="hidden lg:block mb-6">
                <VoiceoverPlayerCard voiceover={voiceover} />
              </div>

              {/* Price Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-muted/30 rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">Prijsoverzicht</h3>

                {!selectedProductionId ? (
                  <div className="text-center py-6">
                    <p className="text-sm text-muted-foreground">
                      Selecteer een productiesoort om de prijs te zien
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Production type */}
                    <div className="flex justify-between items-center">
                      <span className="text-foreground">{selectedProduction?.name}</span>
                      <span className="font-medium text-foreground">
                        €{selectedProduction?.basePrice}
                      </span>
                    </div>

                    {/* Word count pricing */}
                    {selectedProduction?.pricingType === 'wordBased' && wordCount > 0 && (
                      <>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">{wordCount} woorden</span>
                          <span className="text-muted-foreground">
                            {(() => {
                              const tier = selectedProduction.wordPricingTiers?.find(
                                (t) =>
                                  wordCount >= t.minWords &&
                                  (t.maxWords === 0 || wordCount <= t.maxWords)
                              );
                              return tier && tier.additionalPrice > 0
                                ? `+€${tier.additionalPrice}`
                                : 'inbegrepen';
                            })()}
                          </span>
                        </div>
                        {selectedProduction.wordPricingFormula?.explanation && (
                          <p className="text-xs text-muted-foreground italic">
                            {selectedProduction.wordPricingFormula.explanation}
                          </p>
                        )}
                      </>
                    )}

                    {/* Regional/National pricing */}
                    {selectedProduction?.requiresRegion && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                          {selectedRegion === 'regional' ? 'Regionaal' : 'Nationaal'}
                        </span>
                        <span className="text-muted-foreground">inbegrepen</span>
                      </div>
                    )}

                    {/* Extra services */}
                    {selectedExtras.length > 0 && (
                      <div className="border-t pt-3 mt-3">
                        {selectedExtras.map((serviceId) => {
                          const service = availableServices.find((s) => s.id === serviceId);
                          return service ? (
                            <div
                              key={service.id}
                              className="flex justify-between items-center mb-2 text-sm"
                            >
                              <span className="text-muted-foreground">{service.name}</span>
                              <span className="font-medium text-foreground">
                                +€{service.basePrice}
                              </span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    )}

                    {/* Total */}
                    <div className="flex justify-between items-center text-lg font-semibold border-t pt-3 mt-3">
                      <span className="text-foreground">Totaal</span>
                      <span className="text-primary">€{totalPrice}</span>
                    </div>
                  </div>
                )}

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Prijzen zijn exclusief BTW
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
