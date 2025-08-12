'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, User, Tag, ArrowLeft, FileText, Music } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { TransformedVoiceover } from '@/types/voiceover';
import { SmartAudioPlayer } from './SmartAudioPlayer';
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

// Production types configuration - matches homepage productions
const PRODUCTION_TYPES = [
  { value: 'e-learning', label: 'E-learning', requiresWordCount: true },
  { value: 'radiospot', label: 'Radiospot', requiresWordCount: false, requiresSeconds: true },
  {
    value: 'web-commercial',
    label: 'Web/online commercial',
    requiresWordCount: false,
    requiresDuration: true,
  },
  {
    value: 'videoproductie',
    label: 'Videoproductie',
    requiresWordCount: false,
    requiresDuration: true,
  },
  {
    value: 'tv-commercial',
    label: 'TV commercial',
    requiresWordCount: false,
    requiresSeconds: true,
  },
  {
    value: 'voice-response',
    label: 'Voice response (IVR)',
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

  // Download function for demo files
  const handleDownloadDemo = async (audioUrl: string, title: string) => {
    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${getFirstName(voiceover.name)}_${title.replace(/[^a-zA-Z0-9]/g, '_')}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download mislukt. Probeer het opnieuw.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          href="/#voiceovers"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-medium">Terug naar alle stemmen</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Left Column - Booking Form (Takes 2 columns) */}
          <div className="lg:col-span-2 space-y-12">
            {/* Booking Form Section */}
            <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 text-primary">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Boek {getFirstName(voiceover.name)}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Configureer je voice-over bestelling
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Production Type Selector */}
                <div className="space-y-3">
                  <Label
                    htmlFor="production-type"
                    className="text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Productiesoort *
                  </Label>
                  <Select value={productionType} onValueChange={setProductionType}>
                    <SelectTrigger
                      id="production-type"
                      className="h-11 border-gray-200 dark:border-gray-800"
                    >
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
                    <Label
                      htmlFor="count-input"
                      className="text-sm font-medium text-gray-900 dark:text-white"
                    >
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
                      className="h-11 border-gray-200 dark:border-gray-800"
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
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-900 dark:text-white">
                    Extra opties
                  </Label>
                  <div className="border border-gray-200 dark:border-gray-800 rounded-md p-4 space-y-4">
                    {EXTRA_OPTIONS.map((option) => (
                      <div key={option.value} className="flex items-center space-x-3">
                        <Checkbox
                          id={option.value}
                          checked={selectedExtras.includes(option.value)}
                          onCheckedChange={() => handleExtraToggle(option.value)}
                        />
                        <Label
                          htmlFor={option.value}
                          className="text-sm font-normal flex-1 cursor-pointer text-gray-700 dark:text-gray-300"
                        >
                          {option.label}
                          <span className="text-primary font-medium ml-2">+€{option.price}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Script Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="script"
                    className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Script (optioneel)
                  </Label>
                  <Textarea
                    id="script"
                    placeholder="Voer hier je script in..."
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    className="min-h-[120px] resize-none border-gray-200 dark:border-gray-800"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Je kunt je script nu invoeren of later toevoegen via je bestelling.
                  </p>
                </div>

                {/* Tone of Voice Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="tone"
                    className="text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Toon van stem (optioneel)
                  </Label>
                  <Input
                    id="tone"
                    placeholder="bijv. professioneel, vriendelijk, energiek..."
                    value={toneOfVoice}
                    onChange={(e) => setToneOfVoice(e.target.value)}
                    className="h-11 border-gray-200 dark:border-gray-800"
                  />
                </div>
              </div>
            </motion.section>

            {/* Price Summary */}
            {productionType && (
              <motion.section
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border-t border-gray-200 dark:border-gray-800 pt-8"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Prijsoverzicht
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Basisprijs:</span>
                    <span className="font-medium text-gray-900 dark:text-white">€{basePrice}</span>
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
                          <span className="font-medium text-gray-900 dark:text-white">
                            €{basePrice * versionMultiplier}
                          </span>
                        </div>
                      )
                    : wordCount &&
                      wordCountMultiplier > 1 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            {wordCount} woorden:
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            €{basePrice * wordCountMultiplier}
                          </span>
                        </div>
                      )}

                  {selectedExtras.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Extra&apos;s:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        €{extrasPrice}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-xl font-semibold border-t border-gray-200 dark:border-gray-800 pt-4 mt-6">
                    <span className="text-gray-900 dark:text-white">Totaal:</span>
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
                  className="w-full h-12 text-base font-medium mt-8"
                  size="lg"
                >
                  {isSubmitting ? (
                    'Toevoegen...'
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Toevoegen aan winkelwagen
                    </>
                  )}
                </Button>

                {/* Help Text */}
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4 leading-relaxed">
                  Prijzen zijn exclusief BTW. Je kunt de bestelling later aanpassen in je
                  winkelwagen.
                </p>
              </motion.section>
            )}
          </div>

          {/* Right Column - Voiceover Profile (Takes 1 column) */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="sticky top-20"
            >
              <div className="space-y-8">
                {/* Profile Header */}
                <section className="text-center space-y-6">
                  {/* Profile Photo */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border border-gray-200 dark:border-gray-800"
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
                        sizes="96px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </motion.div>

                  {/* Profile Info */}
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {getFirstName(voiceover.name)}
                      </h1>
                      {voiceover.cohort && (
                        <Badge
                          variant="outline"
                          className="text-xs mt-2 border-current"
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
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {voiceover.bio}
                      </p>
                    )}

                    {/* Style Tags */}
                    {voiceover.styleTags && voiceover.styleTags.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-2">
                        {voiceover.styleTags.map((tagObj, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs px-2 py-1 border border-gray-200 dark:border-gray-700"
                          >
                            <Tag className="w-2.5 h-2.5 mr-1" />
                            {tagObj.customTag || tagObj.tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </section>

                {/* Demo Players Section */}
                <section className="border-t border-gray-200 dark:border-gray-800 pt-8">
                  <div className="flex items-center gap-2 mb-6">
                    <Music className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Demo&apos;s
                    </h3>
                  </div>

                  <SmartAudioPlayer
                    demos={voiceover.demos}
                    artistName={getFirstName(voiceover.name)}
                    onDownload={handleDownloadDemo}
                  />
                </section>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
