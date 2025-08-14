'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, ChevronDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/Checkbox';
import { Label } from '@/components/ui/Label';

// Production type enum for type safety
export type ProductionType = 
  | 'videoproductie' 
  | 'e-learning' 
  | 'radiospot' 
  | 'tv-commercial' 
  | 'web-commercial' 
  | 'voice-response';

// Extra option interface
export interface ExtraOption {
  item: string;
  price: number;
  infoText: string;
  value: string; // for form handling
  dependencies?: string[]; // e.g., mixing requires editing
}

// Extra options configuration by production type
export const EXTRA_OPTIONS_CONFIG: Record<ProductionType, ExtraOption[]> = {
  'videoproductie': [
    {
      item: 'Audio Cleanup',
      value: 'audio-cleanup',
      price: 50,
      infoText: 'Al onze opnames worden standaard onbewerkt opgeleverd. Er kunnen dus ademhalingen, smakjes en andere oneffenheden te horen zijn. Kies Audio Cleanup wanneer je een volledig opgeschoond en geprocessed bestand wilt ontvangen dat kant en klaar te gebruiken is.',
    },
    {
      item: 'Editing',
      value: 'editing',
      price: 50,
      infoText: 'Professionele nabewerking van de audio-opname waarbij timing, pauzes en overgangen worden geoptimaliseerd voor een vloeiend eindresultaat.',
    },
    {
      item: 'Mixage',
      value: 'mixage',
      price: 100,
      infoText: 'Opname uitzendklaar door ons laten afmixen? Wij maken de perfecte radio- tv, of webmixage voor je zodat je productie goed klinkt en meteen gebruikt kan worden. Om mixing als extra dienst te selecteren moet je ook editing afnemen.',
      dependencies: ['editing'],
    },
    {
      item: 'Sound Design',
      value: 'sound-design',
      price: 100,
      infoText: 'Heeft jouw productie een passend geluidsontwerp nodig? Wij voorzien de opnames in overleg met jou van passende geluidseffecten en leveren een kant en klaar eindproduct op. Om sounddesign als extra dienst te selecteren moet je ook editing & mixing afnemen.',
      dependencies: ['editing', 'mixage'],
    },
    {
      item: 'Klantregie',
      value: 'klantregie',
      price: 75,
      infoText: 'Live meeluisteren en regisseren tijdens de opnames? Dat kan met Klantregie. Via een eenvoudige weblink kun je meeluisteren en feedback geven alsof je in de studio zit.',
    },
    {
      item: 'Copywriting',
      value: 'copywriting',
      price: 125,
      infoText: 'Je scripts nog beter laten klinken? Kies Copywriting wanneer je jouw basistekst door ons wilt laten redigeren tot goed in te spreken copy die overbrengt wat de bedoeling is.',
    },
    {
      item: 'Inspreken op beeld',
      value: 'inspreken-op-beeld',
      price: 75,
      infoText: 'Wil je dat jouw script op beeld wordt ingesproken? Stuur ons je video en we dubben de voice-over onder het beeld, zodat je qua timing altijd goed zit!',
    },
  ],
  'e-learning': [
    {
      item: 'Audio Cleanup',
      value: 'audio-cleanup',
      price: 50,
      infoText: 'Al onze opnames worden standaard onbewerkt opgeleverd. Er kunnen dus ademhalingen, smakjes en andere oneffenheden te horen zijn. Kies Audio Cleanup wanneer je een volledig opgeschoond en geprocessed bestand wilt ontvangen dat kant en klaar te gebruiken is.',
    },
    {
      item: 'Editing',
      value: 'editing',
      price: 50,
      infoText: 'Professionele nabewerking van de audio-opname waarbij timing, pauzes en overgangen worden geoptimaliseerd voor een vloeiend eindresultaat.',
    },
    {
      item: 'Mixage',
      value: 'mixage',
      price: 100,
      infoText: 'Opname uitzendklaar door ons laten afmixen? Wij maken de perfecte radio- tv, of webmixage voor je zodat je productie goed klinkt en meteen gebruikt kan worden. Om mixing als extra dienst te selecteren moet je ook editing afnemen.',
      dependencies: ['editing'],
    },
    {
      item: 'Sound Design',
      value: 'sound-design',
      price: 100,
      infoText: 'Heeft jouw productie een passend geluidsontwerp nodig? Wij voorzien de opnames in overleg met jou van passende geluidseffecten en leveren een kant en klaar eindproduct op. Om sounddesign als extra dienst te selecteren moet je ook editing & mixing afnemen.',
      dependencies: ['editing', 'mixage'],
    },
    {
      item: 'Klantregie',
      value: 'klantregie',
      price: 75,
      infoText: 'Live meeluisteren en regisseren tijdens de opnames? Dat kan met Klantregie. Via een eenvoudige weblink kun je meeluisteren en feedback geven alsof je in de studio zit.',
    },
    {
      item: 'Copywriting',
      value: 'copywriting',
      price: 125,
      infoText: 'Je scripts nog beter laten klinken? Kies Copywriting wanneer je jouw basistekst door ons wilt laten redigeren tot goed in te spreken copy die overbrengt wat de bedoeling is.',
    },
    {
      item: 'Inspreken op beeld',
      value: 'inspreken-op-beeld',
      price: 75,
      infoText: 'Wil je dat jouw script op beeld wordt ingesproken? Stuur ons je video en we dubben de voice-over onder het beeld, zodat je qua timing altijd goed zit!',
    },
  ],
  'radiospot': [
    {
      item: 'Audio Cleanup',
      value: 'audio-cleanup',
      price: 75,
      infoText: 'Al onze opnames worden standaard onbewerkt opgeleverd. Er kunnen dus ademhalingen, smakjes en andere oneffenheden te horen zijn. Kies Audio Cleanup wanneer je een volledig opgeschoond en geprocessed bestand wilt ontvangen dat kant en klaar te gebruiken is.',
    },
    {
      item: 'Editing',
      value: 'editing',
      price: 75,
      infoText: 'Professionele nabewerking van de radiospot waarbij timing en ritme worden geoptimaliseerd voor maximale impact.',
    },
    {
      item: 'Mixage',
      value: 'mixage',
      price: 150,
      infoText: 'Opname uitzendklaar door ons laten afmixen? Wij maken de perfecte radio- tv, of webmixage voor je zodat je productie goed klinkt en meteen gebruikt kan worden. Om mixing als extra dienst te selecteren moet je ook editing afnemen.',
      dependencies: ['editing'],
    },
    {
      item: 'Sound Design',
      value: 'sound-design',
      price: 150,
      infoText: 'Heeft jouw productie een passend geluidsontwerp nodig? Wij voorzien de opnames in overleg met jou van passende geluidseffecten en leveren een kant en klaar eindproduct op. Om sounddesign als extra dienst te selecteren moet je ook editing & mixing afnemen.',
      dependencies: ['editing', 'mixage'],
    },
    {
      item: 'Klantregie',
      value: 'klantregie',
      price: 75,
      infoText: 'Live meeluisteren en regisseren tijdens de opnames? Dat kan met Klantregie. Via een eenvoudige weblink kun je meeluisteren en feedback geven alsof je in de studio zit.',
    },
    {
      item: 'Copywriting',
      value: 'copywriting',
      price: 125,
      infoText: 'Je scripts nog beter laten klinken? Kies Copywriting wanneer je jouw basistekst door ons wilt laten redigeren tot goed in te spreken copy die overbrengt wat de bedoeling is.',
    },
  ],
  'tv-commercial': [
    {
      item: 'Audio Cleanup',
      value: 'audio-cleanup',
      price: 75,
      infoText: 'Al onze opnames worden standaard onbewerkt opgeleverd. Er kunnen dus ademhalingen, smakjes en andere oneffenheden te horen zijn. Kies Audio Cleanup wanneer je een volledig opgeschoond en geprocessed bestand wilt ontvangen dat kant en klaar te gebruiken is.',
    },
    {
      item: 'Editing',
      value: 'editing',
      price: 75,
      infoText: 'Professionele nabewerking van de tv-commercial voice-over voor perfecte synchronisatie met beeld.',
    },
    {
      item: 'Mixage',
      value: 'mixage',
      price: 150,
      infoText: 'Opname uitzendklaar door ons laten afmixen? Wij maken de perfecte radio- tv, of webmixage voor je zodat je productie goed klinkt en meteen gebruikt kan worden. Om mixing als extra dienst te selecteren moet je ook editing afnemen.',
      dependencies: ['editing'],
    },
    {
      item: 'Sound Design',
      value: 'sound-design',
      price: 150,
      infoText: 'Heeft jouw productie een passend geluidsontwerp nodig? Wij voorzien de opnames in overleg met jou van passende geluidseffecten en leveren een kant en klaar eindproduct op. Om sounddesign als extra dienst te selecteren moet je ook editing & mixing afnemen.',
      dependencies: ['editing', 'mixage'],
    },
    {
      item: 'Klantregie',
      value: 'klantregie',
      price: 75,
      infoText: 'Live meeluisteren en regisseren tijdens de opnames? Dat kan met Klantregie. Via een eenvoudige weblink kun je meeluisteren en feedback geven alsof je in de studio zit.',
    },
    {
      item: 'Copywriting',
      value: 'copywriting',
      price: 125,
      infoText: 'Je scripts nog beter laten klinken? Kies Copywriting wanneer je jouw basistekst door ons wilt laten redigeren tot goed in te spreken copy die overbrengt wat de bedoeling is.',
    },
    {
      item: 'Inspreken op beeld',
      value: 'inspreken-op-beeld',
      price: 100,
      infoText: 'Wil je dat jouw script op beeld wordt ingesproken? Stuur ons je video en we dubben de voice-over onder het beeld, zodat je qua timing altijd goed zit!',
    },
  ],
  'web-commercial': [
    {
      item: 'Audio Cleanup',
      value: 'audio-cleanup',
      price: 75,
      infoText: 'Al onze opnames worden standaard onbewerkt opgeleverd. Er kunnen dus ademhalingen, smakjes en andere oneffenheden te horen zijn. Kies Audio Cleanup wanneer je een volledig opgeschoond en geprocessed bestand wilt ontvangen dat kant en klaar te gebruiken is.',
    },
    {
      item: 'Editing',
      value: 'editing',
      price: 75,
      infoText: 'Professionele nabewerking speciaal afgestemd op online video content.',
    },
    {
      item: 'Mixage',
      value: 'mixage',
      price: 150,
      infoText: 'Opname uitzendklaar door ons laten afmixen? Wij maken de perfecte radio- tv, of webmixage voor je zodat je productie goed klinkt en meteen gebruikt kan worden. Om mixing als extra dienst te selecteren moet je ook editing afnemen.',
      dependencies: ['editing'],
    },
    {
      item: 'Sound Design',
      value: 'sound-design',
      price: 150,
      infoText: 'Heeft jouw productie een passend geluidsontwerp nodig? Wij voorzien de opnames in overleg met jou van passende geluidseffecten en leveren een kant en klaar eindproduct op. Om sounddesign als extra dienst te selecteren moet je ook editing & mixing afnemen.',
      dependencies: ['editing', 'mixage'],
    },
    {
      item: 'Klantregie',
      value: 'klantregie',
      price: 75,
      infoText: 'Live meeluisteren en regisseren tijdens de opnames? Dat kan met Klantregie. Via een eenvoudige weblink kun je meeluisteren en feedback geven alsof je in de studio zit.',
    },
    {
      item: 'Copywriting',
      value: 'copywriting',
      price: 125,
      infoText: 'Je scripts nog beter laten klinken? Kies Copywriting wanneer je jouw basistekst door ons wilt laten redigeren tot goed in te spreken copy die overbrengt wat de bedoeling is.',
    },
    {
      item: 'Inspreken op beeld',
      value: 'inspreken-op-beeld',
      price: 100,
      infoText: 'Wil je dat jouw script op beeld wordt ingesproken? Stuur ons je video en we dubben de voice-over onder het beeld, zodat je qua timing altijd goed zit!',
    },
  ],
  'voice-response': [
    {
      item: 'Audio Cleanup',
      value: 'audio-cleanup',
      price: 50,
      infoText: 'Al onze opnames worden standaard onbewerkt opgeleverd. Er kunnen dus ademhalingen, smakjes en andere oneffenheden te horen zijn. Kies Audio Cleanup wanneer je een volledig opgeschoond en geprocessed bestand wilt ontvangen dat kant en klaar te gebruiken is.',
    },
    {
      item: 'Editing',
      value: 'editing',
      price: 50,
      infoText: 'Professionele nabewerking voor heldere en duidelijke voice prompts.',
    },
    {
      item: 'Mixage',
      value: 'mixage',
      price: 100,
      infoText: 'Opname uitzendklaar door ons laten afmixen? Wij maken de perfecte radio- tv, of webmixage voor je zodat je productie goed klinkt en meteen gebruikt kan worden. Om mixing als extra dienst te selecteren moet je ook editing afnemen.',
      dependencies: ['editing'],
    },
    {
      item: 'Sound Design',
      value: 'sound-design',
      price: 100,
      infoText: 'Heeft jouw productie een passend geluidsontwerp nodig? Wij voorzien de opnames in overleg met jou van passende geluidseffecten en leveren een kant en klaar eindproduct op. Om sounddesign als extra dienst te selecteren moet je ook editing & mixing afnemen.',
      dependencies: ['editing', 'mixage'],
    },
    {
      item: 'Klantregie',
      value: 'klantregie',
      price: 75,
      infoText: 'Live meeluisteren en regisseren tijdens de opnames? Dat kan met Klantregie. Via een eenvoudige weblink kun je meeluisteren en feedback geven alsof je in de studio zit.',
    },
    {
      item: 'Copywriting',
      value: 'copywriting',
      price: 125,
      infoText: 'Je scripts nog beter laten klinken? Kies Copywriting wanneer je jouw basistekst door ons wilt laten redigeren tot goed in te spreken copy die overbrengt wat de bedoeling is.',
    },
    {
      item: 'Inspreken op beeld',
      value: 'inspreken-op-beeld',
      price: 75,
      infoText: 'Wil je dat jouw script op beeld wordt ingesproken? Stuur ons je video en we dubben de voice-over onder het beeld, zodat je qua timing altijd goed zit!',
    },
  ],
};

interface ExtraOptionsProps {
  productionType: ProductionType | '';
  selectedExtras: string[];
  onExtraToggle: (extraValue: string) => void;
}

interface OptionItemProps {
  option: ExtraOption;
  isSelected: boolean;
  isDisabled: boolean;
  onToggle: () => void;
  productionType: ProductionType | '';
}

function OptionItem({ option, isSelected, isDisabled, onToggle, productionType }: OptionItemProps) {
  // Auto-expand selected items
  const [isExpanded, setIsExpanded] = useState(isSelected);
  
  // Update expanded state when selection changes
  useEffect(() => {
    if (isSelected) {
      setIsExpanded(true);
    }
  }, [isSelected]);

  return (
    <motion.div
      layout
      className={`border rounded-lg transition-all ${
        isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-border/60'
      } ${isDisabled ? 'opacity-50' : ''}`}
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Placeholder image */}
          <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0 flex items-center justify-center">
            <div className="text-xs text-muted-foreground">IMG</div>
          </div>
          <Checkbox
            id={option.value}
            checked={isSelected}
            onCheckedChange={onToggle}
            disabled={isDisabled}
            className="mt-0.5"
          />
          <div className="flex-1 space-y-2">
            <Label
              htmlFor={option.value}
              className={`text-sm font-medium cursor-pointer flex items-center justify-between ${
                isDisabled ? 'cursor-not-allowed' : ''
              }`}
            >
              <span className="text-foreground">
                {option.item}
                <span className="text-primary font-semibold ml-2">+€{option.price}</span>
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsExpanded(!isExpanded);
                }}
                className="ml-2 p-1 hover:bg-muted rounded-md transition-colors"
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </motion.div>
              </button>
            </Label>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="text-sm text-muted-foreground leading-relaxed pt-2">
                    {option.infoText}
                  </p>
                  {option.dependencies && option.dependencies.length > 0 && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      Vereist: {option.dependencies.map((dep) => {
                        if (!productionType) return '';
                        const depOption = EXTRA_OPTIONS_CONFIG[productionType as ProductionType]?.find(
                          (opt) => opt.value === dep
                        );
                        return depOption?.item;
                      }).filter(Boolean).join(' & ')}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ExtraOptions({ productionType, selectedExtras, onExtraToggle }: ExtraOptionsProps) {
  if (!productionType) {
    return (
      <div className="space-y-4">
        <Label className="text-sm font-medium text-foreground">Extra diensten</Label>
        <div className="border border-dashed border-border rounded-lg p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Selecteer eerst een productiesoort om de beschikbare extra diensten te zien
          </p>
        </div>
      </div>
    );
  }

  const options = EXTRA_OPTIONS_CONFIG[productionType as ProductionType] || [];

  // Check dependencies - an option is disabled if its dependencies are not selected
  const isOptionDisabled = (option: ExtraOption): boolean => {
    if (!option.dependencies || option.dependencies.length === 0) return false;
    return !option.dependencies.every((dep) => selectedExtras.includes(dep));
  };

  // When an option is deselected, also deselect options that depend on it
  const handleToggle = (optionValue: string) => {
    const option = options.find((opt) => opt.value === optionValue);
    const isCurrentlySelected = selectedExtras.includes(optionValue);
    
    if (isCurrentlySelected && option) {
      // If deselecting, also deselect all options that depend on this one
      const dependentOptions = options.filter((opt) => 
        opt.dependencies?.includes(optionValue)
      );
      
      // Remove this option and all dependent options
      const optionsToRemove = [optionValue, ...dependentOptions.map((opt) => opt.value)];
      optionsToRemove.forEach((value) => {
        if (selectedExtras.includes(value)) {
          onExtraToggle(value);
        }
      });
    } else {
      // If selecting, just toggle this option
      onExtraToggle(optionValue);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium text-foreground">2. Extra diensten</Label>
        <span className="text-xs text-muted-foreground">(optioneel)</span>
      </div>
      
      <div className="space-y-3">
        {options.map((option) => (
          <OptionItem
            key={option.value}
            option={option}
            isSelected={selectedExtras.includes(option.value)}
            isDisabled={isOptionDisabled(option)}
            onToggle={() => handleToggle(option.value)}
            productionType={productionType}
          />
        ))}
      </div>
      
      {options.length === 0 && (
        <div className="border border-dashed border-border rounded-lg p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Geen extra diensten beschikbaar voor deze productiesoort
          </p>
        </div>
      )}
    </div>
  );
}