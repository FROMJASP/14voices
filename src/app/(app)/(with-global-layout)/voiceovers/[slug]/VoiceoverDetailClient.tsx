'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Clock, User, Tag, ArrowLeft, FileText, Music } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { TransformedVoiceover } from '@/types/voiceover';
import { BeautifulAudioPlayer } from '@/components/common/widgets/media';
import { Button } from '@/components/common/ui';
import Image from 'next/image';
import Link from 'next/link';

// shadcn/ui components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

// Define a basic Textarea component since it's not available in the UI folder
function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string }) {
  return (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
      {...props}
    />
  );
}

interface VoiceoverDetailClientProps {
  voiceover: TransformedVoiceover;
}

// Production types configuration
// TODO: These should be fetched from admin panel in the future
const PRODUCTION_TYPES = [
  { value: 'commercial', label: 'Commercial', requiresWordCount: true },
  { value: 'documentaire', label: 'Documentaire', requiresWordCount: true },
  { value: 'e-learning', label: 'E-learning', requiresWordCount: true },
  { value: 'ivr', label: 'IVR', requiresWordCount: false, requiresVersions: true },
  { value: 'audiobook', label: 'Audiobook', requiresWordCount: true },
  { value: 'podcast', label: 'Podcast', requiresWordCount: true },
  { value: 'gaming', label: 'Gaming', requiresWordCount: false, requiresVersions: true },
  {
    value: 'telephone',
    label: 'Telefonische boodschappen',
    requiresWordCount: false,
    requiresVersions: true,
  },
] as const;

// Extra options configuration
// TODO: These should be fetched from admin panel in the future
const EXTRA_OPTIONS = [
  { value: 'rush-delivery', label: 'Spoed levering (24u)', price: 50 },
  { value: 'multiple-languages', label: 'Meertalig', price: 25 },
  { value: 'sync-to-picture', label: 'Sync op beeld', price: 35 },
  { value: 'raw-audio', label: 'Ruwe audio bestanden', price: 15 },
  { value: 'studio-recording', label: 'Studio opname', price: 100 },
  { value: 'same-day-delivery', label: 'Levering zelfde dag', price: 75 },
] as const;

export function VoiceoverDetailClient({ voiceover }: VoiceoverDetailClientProps) {
  const [productionType, setProductionType] = useState<string>('');
  const [wordCount, setWordCount] = useState<string>('');
  const [versionCount, setVersionCount] = useState<string>('');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [script, setScript] = useState<string>('');
  const [toneOfVoice, setToneOfVoice] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to get first name only
  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0];
  };

  const { addItem, setSelectedVoiceover } = useCart();

  // Get current production type config
  const currentProductionType = PRODUCTION_TYPES.find((type) => type.value === productionType);

  // Calculate pricing
  const basePrice = useMemo(() => {
    if (!productionType) return 0;

    // Base pricing per production type (simplified - should come from admin)
    const basePrices = {
      commercial: 150,
      documentaire: 120,
      'e-learning': 100,
      ivr: 80,
      audiobook: 200,
      podcast: 90,
      gaming: 130,
      telephone: 60,
    };

    return basePrices[productionType as keyof typeof basePrices] || 100;
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

  const handleAddToCart = async () => {
    if (!productionType) {
      alert('Selecteer een productiesoort');
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
          const extra = EXTRA_OPTIONS.find((opt) => opt.value === extraValue);
          return `${extra?.label} (+€${extra?.price})`;
        }),
      ];

      // Add script and tone of voice if provided
      if (script.trim()) {
        details.push(`Script: ${script.substring(0, 100)}${script.length > 100 ? '...' : ''}`);
      }
      if (toneOfVoice.trim()) {
        details.push(`Toon van stem: ${toneOfVoice}`);
      }

      // Add to cart
      const cartItem = {
        id: `${voiceover.id}-${productionType}-${Date.now()}`,
        name: `${voiceover.name} - ${currentProductionType?.label}`,
        price: totalPrice,
        details,
      };

      // Set selected voiceover for context
      setSelectedVoiceover({
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

      addItem(cartItem);

      // Show success feedback
      alert('Toegevoegd aan winkelwagen!');

      // Reset form
      setProductionType('');
      setWordCount('');
      setVersionCount('');
      setSelectedExtras([]);
      setScript('');
      setToneOfVoice('');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Er ging iets mis. Probeer het opnieuw.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          href="/voiceovers"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-medium">Terug naar alle stemmen</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Booking Form */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <ShoppingCart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Boek {getFirstName(voiceover.name)}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Configureer je voice-over bestelling
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Production Type Selector */}
                <div className="space-y-3">
                  <Label htmlFor="production-type" className="text-base font-semibold">
                    Productiesoort *
                  </Label>
                  <Select value={productionType} onValueChange={setProductionType}>
                    <SelectTrigger id="production-type" className="h-12">
                      <SelectValue placeholder="Selecteer productiesoort" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCTION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Word Count or Version Count Input */}
                {currentProductionType && (
                  <div className="space-y-3">
                    <Label htmlFor="count-input" className="text-base font-semibold">
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
                      className="h-12"
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

                {/* Extra Options */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Extra opties</Label>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-3">
                    {EXTRA_OPTIONS.map((option) => (
                      <div key={option.value} className="flex items-center space-x-3">
                        <Checkbox
                          id={option.value}
                          checked={selectedExtras.includes(option.value)}
                          onCheckedChange={() => handleExtraToggle(option.value)}
                        />
                        <Label
                          htmlFor={option.value}
                          className="text-sm font-normal flex-1 cursor-pointer"
                        >
                          {option.label}
                          <span className="text-primary font-semibold ml-2">+€{option.price}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Script Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="script"
                    className="text-base font-semibold flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Script (optioneel)
                  </Label>
                  <Textarea
                    id="script"
                    placeholder="Voer hier je script in..."
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    className="min-h-[120px] resize-none"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Je kunt je script nu invoeren of later toevoegen via je bestelling.
                  </p>
                </div>

                {/* Tone of Voice Field */}
                <div className="space-y-3">
                  <Label htmlFor="tone" className="text-base font-semibold">
                    Toon van stem (optioneel)
                  </Label>
                  <Input
                    id="tone"
                    placeholder="bijv. professioneel, vriendelijk, energiek..."
                    value={toneOfVoice}
                    onChange={(e) => setToneOfVoice(e.target.value)}
                    className="h-12"
                  />
                </div>
              </div>
            </motion.div>

            {/* Price Summary */}
            {productionType && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Prijsoverzicht
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Basisprijs:</span>
                    <span className="font-medium">€{basePrice}</span>
                  </div>

                  {currentProductionType &&
                  'requiresVersions' in currentProductionType &&
                  currentProductionType.requiresVersions
                    ? versionCount &&
                      parseInt(versionCount) > 1 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            {versionCount} versies:
                          </span>
                          <span className="font-medium">€{basePrice * versionMultiplier}</span>
                        </div>
                      )
                    : wordCount &&
                      wordCountMultiplier > 1 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            {wordCount} woorden:
                          </span>
                          <span className="font-medium">€{basePrice * wordCountMultiplier}</span>
                        </div>
                      )}

                  {selectedExtras.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Extra&apos;s:</span>
                      <span className="font-medium">€{extrasPrice}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xl font-bold border-t border-primary/20 pt-3 mt-4">
                    <span>Totaal:</span>
                    <span className="text-primary">€{totalPrice}</span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
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
                  className="w-full h-14 text-lg font-semibold mt-6"
                  size="lg"
                >
                  {isSubmitting ? (
                    'Toevoegen...'
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Toevoegen aan winkelwagen
                    </>
                  )}
                </Button>

                {/* Help Text */}
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4 leading-relaxed">
                  Prijzen zijn exclusief BTW. Je kunt de bestelling later aanpassen in je
                  winkelwagen.
                </p>
              </motion.div>
            )}
          </div>

          {/* Right Column - Voiceover Profile */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="sticky top-20 space-y-6"
            >
              {/* Profile Header */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
                <div className="flex flex-col items-center text-center space-y-6">
                  {/* Profile Photo */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative w-40 h-40 rounded-full overflow-hidden shadow-2xl ring-4 ring-primary/20"
                  >
                    {voiceover.profilePhoto ? (
                      <Image
                        src={voiceover.profilePhoto.url}
                        alt={
                          voiceover.profilePhoto.alt ||
                          `Profile photo of ${getFirstName(voiceover.name)}`
                        }
                        fill
                        className="object-cover"
                        sizes="160px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
                        <User className="w-20 h-20 text-gray-400" />
                      </div>
                    )}
                  </motion.div>

                  {/* Profile Info */}
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {getFirstName(voiceover.name)}
                      </h1>
                      {voiceover.cohort && (
                        <Badge
                          variant="outline"
                          className="text-sm"
                          style={{
                            borderColor: voiceover.cohort.color,
                            color: voiceover.cohort.color,
                          }}
                        >
                          {voiceover.cohort.name}
                        </Badge>
                      )}
                    </div>

                    {/* Bio */}
                    {voiceover.bio && (
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-md">
                        {voiceover.bio}
                      </p>
                    )}

                    {/* Style Tags */}
                    {voiceover.styleTags && voiceover.styleTags.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-2">
                        {voiceover.styleTags.map((tagObj, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {tagObj.customTag || tagObj.tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Demo Players - Integrated */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Music className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Demo&apos;s van {getFirstName(voiceover.name)}
                  </h2>
                </div>

                <div className="space-y-4">
                  {voiceover.demos.map((demo, index) => (
                    <motion.div
                      key={demo.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * (index + 1) }}
                      className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {demo.title}
                          </h3>
                          {demo.description && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {demo.description}
                            </p>
                          )}
                        </div>
                        {demo.duration && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            {demo.duration}
                          </div>
                        )}
                      </div>
                      <BeautifulAudioPlayer
                        src={demo.audioFile.url}
                        title={demo.title}
                        artist={getFirstName(voiceover.name)}
                        variant="compact"
                      />
                    </motion.div>
                  ))}
                </div>

                {voiceover.demos.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Geen demo&apos;s beschikbaar</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
