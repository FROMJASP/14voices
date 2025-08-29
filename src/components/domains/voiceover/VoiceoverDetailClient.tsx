'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Infinity, Clock } from 'lucide-react';
import { useCartStore, useDrawerStore } from '@/stores';
import { TransformedVoiceover } from '@/types/voiceover';
import Link from 'next/link';
import Image from 'next/image';
import { Bricolage_Grotesque } from 'next/font/google';
import { VoiceoverPlayerCard } from './VoiceoverPlayerCard';
import { ExtraOptions, EXTRA_OPTIONS_CONFIG, type ProductionType } from './ExtraOptions';
import { SimpleScriptEditor } from './SimpleScriptEditor';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import dynamic from 'next/dynamic';

// Dynamic import to prevent server-side rendering issues with Web Audio API
const AudioNotes = dynamic(
  () => import('./AudioNotes').then((mod) => ({ default: mod.AudioNotes })),
  {
    ssr: false,
    loading: () => <div className="h-32 animate-pulse bg-muted rounded-lg" />,
  }
);

// shadcn/ui components
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { Pill, PillIcon } from '@/components/ui/kibo-ui/pill';

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

// Production types configuration - matches homepage productions with video data
const PRODUCTION_TYPES = [
  {
    value: 'videoproductie',
    label: 'Videoproductie',
    price: 175,
    description: "Video's voor intern gebruik of online plaatsing, zonder advertentiebudget.",
    videoUrl: '/videos/videoproductie.mp4',
    color: '#18f109',
    accentColor: '#14c007',
    requiresWordCount: false,
    requiresDuration: true,
  },
  {
    value: 'e-learning',
    label: 'E-learning',
    price: 200,
    description: "Training, onboarding of instructie video's voor intern of educatief gebruik.",
    videoUrl: '/videos/e-learning.mp4',
    color: '#4b9eff',
    accentColor: '#3a8de8',
    requiresWordCount: true,
  },
  {
    value: 'radiospot',
    label: 'Radiospot',
    price: 150,
    description: 'Voor radio of streamingdiensten om een product, dienst of merk te promoten.',
    videoUrl: '/videos/radiospot.mp4',
    color: '#ff6b6b',
    accentColor: '#e85d5d',
    requiresWordCount: false,
    requiresSeconds: true,
  },
  {
    value: 'tv-commercial',
    label: 'TV Commercial',
    price: 250,
    description:
      'Betaalde videospots voor televisie om een merk landelijk of regionaal te promoten.',
    videoUrl: '/videos/tv-commercial.mp4',
    color: '#a78bfa',
    accentColor: '#9775f5',
    requiresWordCount: false,
    requiresSeconds: true,
  },
  {
    value: 'web-commercial',
    label: 'Web Commercial',
    price: 400,
    description:
      'Online videoadvertenties via internet, sociale media of streaming met advertentiebudget.',
    videoUrl: '/videos/web-commercial.mp4',
    color: '#f59e0b',
    accentColor: '#dc8a09',
    requiresWordCount: false,
    requiresDuration: true,
  },
  {
    value: 'voice-response',
    label: 'Voice Response',
    price: 150,
    description: "Voor keuzemenu's (IVR), voicemails en wachtrijen.",
    videoUrl: '/videos/voice-response.mp4',
    color: '#10b981',
    accentColor: '#0ea571',
    requiresWordCount: false,
    requiresPrompts: true,
  },
] as const;

// Extra options configuration - matches homepage productions
const EXTRA_OPTIONS = [
  { value: 'rush-delivery', label: 'Spoed levering (24u)', price: 50 },
  { value: 'multiple-languages', label: 'Meertalig', price: 25 },
  { value: 'sync-to-picture', label: 'Sync op beeld', price: 35 },
  { value: 'raw-audio', label: 'Ruwe audio bestanden', price: 15 },
  { value: 'studio-recording', label: 'Studio opname', price: 100 },
  { value: 'same-day-delivery', label: 'Levering zelfde dag', price: 75 },
] as const;

export function VoiceoverDetailClient({ voiceover }: VoiceoverDetailClientProps) {
  // Create a unique storage key for this voiceover
  const storageKey = `voiceover-form-${voiceover.id}`;

  // Load saved form data from localStorage
  const [savedFormData, setSavedFormData] = useLocalStorage(storageKey, {
    productionType: 'videoproductie',
    wordCount: '',
    versionCount: '',
    selectedExtras: [] as string[],
    script: '',
    additionalNotes: '',
    audioFile: null as File | null,
  });

  const [productionType, setProductionType] = useState<string>(savedFormData.productionType);
  const [wordCount, setWordCount] = useState<string>(savedFormData.wordCount);
  const [versionCount, setVersionCount] = useState<string>(savedFormData.versionCount);
  const [selectedExtras, setSelectedExtras] = useState<string[]>(savedFormData.selectedExtras);
  const [script, setScript] = useState<string>(savedFormData.script);
  const [additionalNotes, setAdditionalNotes] = useState<string>(savedFormData.additionalNotes);
  const [audioFile, setAudioFile] = useState<File | null>(savedFormData.audioFile);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProductionError, setShowProductionError] = useState(false);

  // Helper function to get first name only
  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0];
  };

  const addItem = useCartStore((state) => state.addItem);
  const openDrawer = useDrawerStore((state) => state.openDrawer);
  const firstName = getFirstName(voiceover.name);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    setSavedFormData({
      productionType,
      wordCount,
      versionCount,
      selectedExtras,
      script,
      additionalNotes,
      audioFile,
    });
  }, [
    productionType,
    wordCount,
    versionCount,
    selectedExtras,
    script,
    additionalNotes,
    audioFile,
    setSavedFormData,
  ]);

  // Get current production type config
  const currentProductionType = PRODUCTION_TYPES.find((type) => type.value === productionType);

  // Calculate pricing
  const basePrice = useMemo(() => {
    if (!productionType) return 0;
    const selectedProduction = PRODUCTION_TYPES.find((p) => p.value === productionType);
    return selectedProduction?.price || 100;
  }, [productionType]);

  const wordCountMultiplier = useMemo(() => {
    const count = parseInt(wordCount);
    if (isNaN(count) || count <= 0) return 1;

    // Pricing tiers based on word count
    if (count <= 100) return 1;
    if (count <= 300) return 1.5;
    if (count <= 500) return 2;
    if (count <= 1000) return 3;
    return Math.ceil(count / 1000) * 3;
  }, [wordCount]);

  const versionMultiplier = useMemo(() => {
    const count = parseInt(versionCount);
    if (isNaN(count) || count <= 0) return 1;
    return count;
  }, [versionCount]);

  const extrasPrice = useMemo(() => {
    return selectedExtras.reduce((total, extraValue) => {
      const extra = EXTRA_OPTIONS.find((opt) => opt.value === extraValue);
      return total + (extra?.price || 0);
    }, 0);
  }, [selectedExtras]);

  const totalPrice = useMemo(() => {
    const multiplier =
      currentProductionType &&
      'requiresVersions' in currentProductionType &&
      currentProductionType.requiresVersions
        ? versionMultiplier
        : wordCountMultiplier;
    return basePrice * multiplier + extrasPrice;
  }, [basePrice, wordCountMultiplier, versionMultiplier, extrasPrice, currentProductionType]);

  const handleExtraToggle = (extraValue: string) => {
    setSelectedExtras((prev) =>
      prev.includes(extraValue) ? prev.filter((v) => v !== extraValue) : [...prev, extraValue]
    );
  };

  // Handle word count update from script editor
  const handleWordCountUpdate = (count: number) => {
    // Only update if using word count (not version count)
    if (currentProductionType && currentProductionType.requiresWordCount) {
      setWordCount(count.toString());
    }
  };

  const handleAddToCart = async () => {
    if (!productionType) {
      setShowProductionError(true);
      // Scroll to production selector
      const productionElement = document.getElementById('production-selector');
      if (productionElement) {
        productionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      setTimeout(() => setShowProductionError(false), 3000);
      return;
    }

    const isVersionBased =
      currentProductionType &&
      'requiresVersions' in currentProductionType &&
      currentProductionType.requiresVersions;
    const inputValue = isVersionBased ? versionCount : wordCount;
    if (!inputValue || parseInt(inputValue) <= 0) {
      alert(isVersionBased ? 'Voer het aantal versies in' : 'Voer het aantal woorden in');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare cart item details
      const details = [
        `Productiesoort: ${currentProductionType?.label}`,
        currentProductionType &&
        'requiresVersions' in currentProductionType &&
        currentProductionType.requiresVersions
          ? `Aantal versies: ${versionCount}`
          : `Aantal woorden: ${wordCount}`,
        ...selectedExtras.map((extraValue) => {
          const options = EXTRA_OPTIONS_CONFIG[productionType as ProductionType] || [];
          const extra = options.find((opt) => opt.value === extraValue);
          return `${extra?.item} (+€${extra?.price})`;
        }),
      ];

      // Add script and tone of voice if provided
      if (script.trim()) {
        details.push(`Script: ${script.substring(0, 100)}${script.length > 100 ? '...' : ''}`);
      }
      if (additionalNotes.trim()) {
        details.push(`Aanvullende informatie: ${additionalNotes}`);
      }
      if (audioFile) {
        details.push(`Audio referentie: ${audioFile.name}`);
      }

      // Add to cart
      const cartItem = {
        id: `${voiceover.id}-${productionType}-${Date.now()}`,
        name: `${voiceover.name} - ${currentProductionType?.label}`,
        price: totalPrice,
        details,
      };

      // Add item to cart
      addItem(cartItem);

      // Open drawer with voiceover selection
      openDrawer('production', {
        id: voiceover.id,
        name: voiceover.name,
        slug: voiceover.slug,
        profilePhoto: voiceover.profilePhoto?.url,
        tags: voiceover.styleTags?.map((tag) => tag.tag),
        demos: voiceover.demos.map((demo) => ({
          id: demo.id,
          title: demo.title,
          audioFile: { url: demo.audioFile.url },
          duration: demo.duration || '0:00',
        })),
      });

      // Show success feedback
      alert('Toegevoegd aan winkelwagen!');

      // Reset form
      setProductionType('');
      setWordCount('');
      setVersionCount('');
      setSelectedExtras([]);
      setScript('');
      setAdditionalNotes('');
      setAudioFile(null);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Er ging iets mis. Probeer het opnieuw.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen bg-background ${bricolageGrotesque.variable} font-bricolage`}>
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          href="/#voiceovers"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-medium">Terug naar alle stemmen</span>
        </Link>
      </div>

      {/* Mobile Header - Shows name and key info without full card */}
      <div className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          {voiceover.profilePhoto?.url && (
            <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
              <Image
                src={voiceover.profilePhoto.url}
                alt={firstName}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground mb-1">{firstName}</h1>
            {voiceover.cohort && (
              <Badge
                variant="outline"
                className="text-xs border-current mb-2"
                style={{
                  borderColor: voiceover.cohort.color,
                  color: voiceover.cohort.color,
                  backgroundColor: `${voiceover.cohort.color}20`,
                }}
              >
                {voiceover.cohort.name}
              </Badge>
            )}
          </div>
          {voiceover.beschikbaar && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-foreground">
                {voiceover.availabilityText || 'Nu beschikbaar'}
              </span>
            </div>
          )}
        </motion.div>

        {/* Mobile Player Card */}
        <VoiceoverPlayerCard voiceover={voiceover} />
      </div>

      {/* Main Content - REDESIGNED LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 text-primary">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">Boek {firstName}</h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Configureer je voice-over bestelling
                  </p>
                </div>
              </div>

              {/* Production Type Selector - LIST DESIGN */}
              <div id="production-selector" className="space-y-4 mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Label className="text-sm font-medium text-foreground">
                    1. Kies je productiesoort *
                  </Label>
                  {showProductionError && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-red-500 text-sm font-medium"
                    >
                      Selecteer eerst een productiesoort
                    </motion.div>
                  )}
                </div>

                {/* Split Layout Container */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Left Side - Selected Production Detail */}
                  <div className="lg:col-span-3">
                    {currentProductionType ? (
                      <motion.div
                        key={currentProductionType.value}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        {/* Selected Production Video */}
                        <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-muted">
                          <video
                            src={currentProductionType.videoUrl}
                            muted
                            playsInline
                            loop
                            autoPlay
                            className="absolute inset-0 w-full h-full object-cover"
                          />

                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                          {/* Title Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h3 className="text-2xl font-bold text-white mb-2">
                              {currentProductionType.label}
                            </h3>
                            <p className="text-lg text-white/90">
                              Vanaf €{currentProductionType.price}
                            </p>
                          </div>
                        </div>

                        {/* Full Description */}
                        <div className="bg-muted/30 rounded-lg p-4">
                          <h4 className="text-base font-semibold text-foreground mb-2">
                            Wat is een {currentProductionType.label}?
                          </h4>
                          <p className="text-sm text-foreground leading-relaxed mb-3">
                            {currentProductionType.description}
                          </p>

                          {/* Buyout Information */}
                          <div className="mt-3 pt-3 border-t border-border/50">
                            <p className="text-xs font-medium text-muted-foreground mb-2">
                              Hoe lang mag ik de opnames gebruiken? (buy-out)
                            </p>

                            {/* Videoproductie */}
                            {currentProductionType.value === 'videoproductie' && (
                              <Pill
                                variant="secondary"
                                className="px-2 py-0.5 h-6 bg-muted border-border"
                              >
                                <PillIcon icon={Infinity} className="text-foreground" />
                                <span className="text-xs">Oneindig</span>
                              </Pill>
                            )}

                            {/* E-learning */}
                            {currentProductionType.value === 'e-learning' && (
                              <Pill
                                variant="secondary"
                                className="px-2 py-0.5 h-6 bg-muted border-border"
                              >
                                <PillIcon icon={Infinity} className="text-foreground" />
                                <span className="text-xs">Oneindig</span>
                              </Pill>
                            )}

                            {/* Radiospot */}
                            {currentProductionType.value === 'radiospot' && (
                              <Pill
                                variant="outline"
                                className="px-2 py-0.5 h-6 bg-background border-border"
                              >
                                <PillIcon icon={Clock} className="text-muted-foreground" />
                                <span className="text-xs">1 jaar</span>
                              </Pill>
                            )}

                            {/* TV Commercial */}
                            {currentProductionType.value === 'tv-commercial' && (
                              <Pill
                                variant="outline"
                                className="px-2 py-0.5 h-6 bg-background border-border"
                              >
                                <PillIcon icon={Clock} className="text-muted-foreground" />
                                <span className="text-xs">1 jaar</span>
                              </Pill>
                            )}

                            {/* Web Commercial */}
                            {currentProductionType.value === 'web-commercial' && (
                              <Pill
                                variant="outline"
                                className="px-2 py-0.5 h-6 bg-background border-border"
                              >
                                <PillIcon icon={Clock} className="text-muted-foreground" />
                                <span className="text-xs">1 jaar</span>
                              </Pill>
                            )}

                            {/* Voice Response */}
                            {currentProductionType.value === 'voice-response' && (
                              <Pill
                                variant="secondary"
                                className="px-2 py-0.5 h-6 bg-muted border-border"
                              >
                                <PillIcon icon={Infinity} className="text-foreground" />
                                <span className="text-xs">Oneindig</span>
                              </Pill>
                            )}
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
                      {PRODUCTION_TYPES.map((production) => {
                        const isSelected = productionType === production.value;
                        return (
                          <motion.button
                            key={production.value}
                            className={`w-full text-left rounded-lg border transition-all ${
                              isSelected
                                ? 'border-primary bg-primary/10'
                                : 'border-border hover:border-border/60 hover:bg-muted/30'
                            }`}
                            onClick={() => {
                              setProductionType(production.value);
                              setShowProductionError(false);
                              // Clear selected extras when production type changes
                              setSelectedExtras([]);
                            }}
                            whileHover={{ x: 2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center gap-3 p-3">
                              {/* Mini Video Thumbnail */}
                              <div className="relative w-20 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
                                <video
                                  src={production.videoUrl}
                                  muted
                                  playsInline
                                  loop
                                  autoPlay
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20" />
                              </div>

                              {/* Production Info */}
                              <div className="flex-1 min-w-0">
                                <h4
                                  className={`font-medium text-sm ${
                                    isSelected ? 'text-primary' : 'text-foreground'
                                  }`}
                                >
                                  {production.label}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  Vanaf €{production.price}
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
              </div>

              {/* Extra Options - Right after production type */}
              <div className="mb-8">
                <ExtraOptions
                  productionType={productionType as ProductionType | ''}
                  selectedExtras={selectedExtras}
                  onExtraToggle={handleExtraToggle}
                />
              </div>

              {/* Form Grid - 2 columns on larger screens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Word Count or Version Count Input */}
                {currentProductionType && (
                  <div className="space-y-3">
                    <Label htmlFor="count-input" className="text-sm font-medium text-foreground">
                      3.{' '}
                      {'requiresVersions' in currentProductionType &&
                      currentProductionType.requiresVersions
                        ? 'Aantal versies'
                        : 'Aantal woorden'}{' '}
                      *
                    </Label>
                    <Input
                      id="count-input"
                      type="number"
                      min="1"
                      className="h-11"
                      placeholder={
                        'requiresVersions' in currentProductionType &&
                        currentProductionType.requiresVersions
                          ? 'bijv. 3'
                          : 'bijv. 250'
                      }
                      value={
                        'requiresVersions' in currentProductionType &&
                        currentProductionType.requiresVersions
                          ? versionCount
                          : wordCount
                      }
                      onChange={(e) =>
                        'requiresVersions' in currentProductionType &&
                        currentProductionType.requiresVersions
                          ? setVersionCount(e.target.value)
                          : setWordCount(e.target.value)
                      }
                    />
                  </div>
                )}
              </div>

              {/* Script Field */}
              <div className="mb-8">
                <SimpleScriptEditor
                  value={script}
                  onChange={setScript}
                  onWordCountChange={handleWordCountUpdate}
                  placeholder={`Plak of schrijf hier het script dat ${firstName} zal inspreken...`}
                  voiceoverName={firstName}
                />
              </div>

              {/* Additional Notes and Audio Field */}
              <div className="mb-8">
                <AudioNotes
                  textValue={additionalNotes}
                  onTextChange={setAdditionalNotes}
                  audioFile={audioFile}
                  onAudioFileChange={setAudioFile}
                />
              </div>

              {/* Add to cart button - moved to bottom of form */}
              <div className="mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={
                    !productionType ||
                    isSubmitting ||
                    (currentProductionType &&
                    'requiresVersions' in currentProductionType &&
                    currentProductionType.requiresVersions
                      ? !versionCount || parseInt(versionCount) <= 0
                      : !wordCount || parseInt(wordCount) <= 0)
                  }
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
            {/* Sticky wrapper for desktop */}
            <div className="lg:sticky lg:top-24">
              {/* Desktop Voiceover Player Card */}
              <div className="hidden lg:block mb-6">
                <VoiceoverPlayerCard voiceover={voiceover} />
              </div>

              {/* Price Summary - BELOW voiceover card on desktop, shows on mobile too */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-muted/30 rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">Prijsoverzicht</h3>

                {!productionType ? (
                  <div className="text-center py-6">
                    <p className="text-sm text-muted-foreground">
                      Selecteer een productiesoort om de prijs te zien
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Production type */}
                    <div className="flex justify-between items-center">
                      <span className="text-foreground">{currentProductionType?.label}</span>
                      <span className="font-medium text-foreground">€{basePrice}</span>
                    </div>

                    {/* Word count or version count */}
                    {currentProductionType &&
                    'requiresVersions' in currentProductionType &&
                    currentProductionType.requiresVersions
                      ? versionCount &&
                        parseInt(versionCount) > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">
                              {versionCount} {parseInt(versionCount) === 1 ? 'versie' : 'versies'}
                            </span>
                            <span className="font-medium text-foreground">
                              ×{versionMultiplier}
                            </span>
                          </div>
                        )
                      : wordCount &&
                        parseInt(wordCount) > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">{wordCount} woorden</span>
                            <span className="font-medium text-foreground">
                              ×{wordCountMultiplier}
                            </span>
                          </div>
                        )}

                    {/* Extra options */}
                    {selectedExtras.length > 0 && productionType && (
                      <div className="border-t pt-3 mt-3">
                        {selectedExtras.map((extraValue) => {
                          const options =
                            EXTRA_OPTIONS_CONFIG[productionType as ProductionType] || [];
                          const extra = options.find((opt) => opt.value === extraValue);
                          return extra ? (
                            <div
                              key={extra.value}
                              className="flex justify-between items-center mb-2"
                            >
                              <span className="text-muted-foreground text-sm">{extra.item}</span>
                              <span className="font-medium text-foreground">+€{extra.price}</span>
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

                {/* Add to cart button in price summary */}
                <button
                  onClick={handleAddToCart}
                  disabled={
                    !productionType ||
                    isSubmitting ||
                    (currentProductionType &&
                    'requiresVersions' in currentProductionType &&
                    currentProductionType.requiresVersions
                      ? !versionCount || parseInt(versionCount) <= 0
                      : !wordCount || parseInt(wordCount) <= 0)
                  }
                  className="w-full h-11 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  {isSubmitting ? (
                    'Toevoegen...'
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Toevoegen aan winkelwagen
                    </>
                  )}
                </button>
              </motion.div>
            </div>{' '}
            {/* End of sticky wrapper */}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
