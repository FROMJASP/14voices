'use client';

import React, { useState, useMemo, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import {
  Calculator,
  Video,
  GraduationCap,
  Radio,
  Tv,
  Globe,
  Phone,
  ChevronRight,
  Sparkles,
  Shield,
  X,
  Check,
  Info,
} from 'lucide-react';
import { productionData, calculateTotal } from './utils';
import type { CartFormData } from './types';

interface PriceCalculatorFormProps {
  onProductionChange?: (index: number) => void;
  onReset?: () => void;
  onAddToCart?: (data: CartFormData) => void;
}

// Memoized production button component
const ProductionButton = memo(({ 
  production, 
  isSelected, 
  onClick 
}: {
  production: any;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'GraduationCap':
        return GraduationCap;
      case 'Radio':
        return Radio;
      case 'Globe':
        return Globe;
      case 'Video':
        return Video;
      case 'Tv':
        return Tv;
      case 'Phone':
        return Phone;
      default:
        return Calculator;
    }
  };

  const Icon = getIcon(production.icon);

  return (
    <button
      onClick={onClick}
      className={`relative p-4 rounded-xl border-2 transition-all ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-lg'
          : 'border-border hover:border-primary/50 hover:bg-accent'
      }`}
    >
      <div className="flex flex-col items-center gap-2">
        <Icon className="w-6 h-6 text-primary" />
        <span className="text-sm font-medium">{production.name}</span>
      </div>
      {isSelected && (
        <motion.div
          layoutId="selected-production"
          className="absolute inset-0 border-2 border-primary rounded-xl"
          initial={false}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </button>
  );
});

ProductionButton.displayName = 'ProductionButton';

// Memoized word count option component
const WordCountOption = memo(({ 
  item, 
  isSelected, 
  onSelect 
}: {
  item: any;
  isSelected: boolean;
  onSelect: () => void;
}) => (
  <label
    className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
      isSelected
        ? 'border-primary bg-primary/5'
        : 'border-border hover:border-primary/50 hover:bg-accent'
    }`}
  >
    <input
      type="radio"
      name="words"
      value={item.item}
      checked={isSelected}
      onChange={onSelect}
      className="sr-only"
    />
    <div className="flex items-center justify-between">
      <span className="font-medium">{item.item}</span>
      {item.price > 0 && (
        <span className="text-primary font-semibold">+€{item.price}</span>
      )}
    </div>
  </label>
));

WordCountOption.displayName = 'WordCountOption';

// Memoized extra option component
const ExtraOption = memo(({ 
  option, 
  isSelected, 
  onToggle, 
  activeTooltip, 
  onTooltipToggle 
}: {
  option: any;
  isSelected: boolean;
  onToggle: () => void;
  activeTooltip: string | null;
  onTooltipToggle: (optionItem: string | null) => void;
}) => (
  <div className="relative">
    <label
      className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50 hover:bg-accent'
      }`}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggle}
        className="sr-only"
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
              isSelected
                ? 'bg-primary border-primary'
                : 'border-border'
            }`}
          >
            {isSelected && (
              <Check className="w-3 h-3 text-primary-foreground" />
            )}
          </div>
          <span className="font-medium">{option.item}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-primary font-semibold">+€{option.price}</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              onTooltipToggle(activeTooltip === option.item ? null : option.item);
            }}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>
    </label>
    {activeTooltip === option.item && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute z-10 top-full mt-2 left-0 right-0 p-3 bg-popover text-popover-foreground rounded-lg shadow-lg border border-border"
      >
        <p className="text-sm">{option.infoText}</p>
        <button
          onClick={() => onTooltipToggle(null)}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    )}
  </div>
));

ExtraOption.displayName = 'ExtraOption';

// Memoized region option component
const RegionOption = memo(({ 
  region, 
  isSelected, 
  onSelect 
}: {
  region: any;
  isSelected: boolean;
  onSelect: () => void;
}) => (
  <label
    className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
      isSelected
        ? 'border-primary bg-primary/5'
        : 'border-border hover:border-primary/50 hover:bg-accent'
    }`}
  >
    <input
      type="radio"
      name="region"
      value={region.name}
      checked={isSelected}
      onChange={onSelect}
      className="sr-only"
    />
    <div className="flex items-center justify-between">
      <span className="font-medium">{region.name}</span>
      {region.price > 0 && (
        <span className="text-primary font-semibold">+€{region.price}</span>
      )}
    </div>
  </label>
));

RegionOption.displayName = 'RegionOption';

export const PriceCalculatorFormOptimized = memo(function PriceCalculatorForm({
  onProductionChange,
  onReset,
  onAddToCart,
}: PriceCalculatorFormProps) {
  const [selectedProduction, setSelectedProduction] = useState(0);
  const [selectedWords, setSelectedWords] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [customWordCount, setCustomWordCount] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Memoize current production to prevent re-computation
  const currentProduction = useMemo(() => productionData[selectedProduction], [selectedProduction]);

  // Memoize total calculation with dependency optimization
  const total = useMemo(
    () => calculateTotal(currentProduction, selectedWords, selectedOptions, selectedRegion),
    [currentProduction, selectedWords, selectedOptions, selectedRegion]
  );

  // Memoized event handlers
  const handleReset = useCallback(() => {
    setSelectedProduction(0);
    setSelectedWords('');
    setSelectedOptions(new Set());
    setCustomWordCount('');
    setSelectedRegion('');
    onReset?.();
  }, [onReset]);

  const handleProductionChange = useCallback((index: number) => {
    setSelectedProduction(index);
    setSelectedWords('');
    setSelectedOptions(new Set());
    setCustomWordCount('');
    setSelectedRegion('');
    onProductionChange?.(index);
  }, [onProductionChange]);

  const toggleOption = useCallback((option: string) => {
    setSelectedOptions(prev => {
      const newOptions = new Set(prev);
      if (newOptions.has(option)) {
        newOptions.delete(option);
      } else {
        newOptions.add(option);
      }
      return newOptions;
    });
  }, []);

  const handleAddToCart = useCallback(() => {
    onAddToCart?.({
      productionIndex: selectedProduction,
      selectedWords,
      selectedOptions,
      selectedRegion,
      total,
    });
  }, [onAddToCart, selectedProduction, selectedWords, selectedOptions, selectedRegion, total]);

  // Memoize tooltip toggle handler
  const handleTooltipToggle = useCallback((optionItem: string | null) => {
    setActiveTooltip(optionItem);
  }, []);

  // Memoize production selection handlers
  const productionHandlers = useMemo(() => 
    productionData.map((_, index) => () => handleProductionChange(index)),
    [handleProductionChange]
  );

  // Memoize word count selection handlers
  const wordCountHandlers = useMemo(() => 
    currentProduction.itemlistTwo.reduce((acc: Record<string, () => void>, item) => {
      acc[item.item] = () => setSelectedWords(item.item);
      return acc;
    }, {}),
    [currentProduction.itemlistTwo]
  );

  // Memoize region selection handlers
  const regionHandlers = useMemo(() => 
    (currentProduction.uitzendgebied || []).reduce((acc: Record<string, () => void>, region) => {
      acc[region.name] = () => setSelectedRegion(region.name);
      return acc;
    }, {}),
    [currentProduction.uitzendgebied]
  );

  // Memoize option toggle handlers
  const optionToggleHandlers = useMemo(() => 
    currentProduction.itemlistThree.reduce((acc: Record<string, () => void>, option) => {
      acc[option.item] = () => toggleOption(option.item);
      return acc;
    }, {}),
    [currentProduction.itemlistThree, toggleOption]
  );

  // Memoize form validation
  const isFormValid = useMemo(() => 
    selectedWords && selectedWords !== 'Offerte op maat',
    [selectedWords]
  );

  // Memoize show reset button condition
  const showResetButton = useMemo(() => 
    selectedWords || selectedOptions.size > 0,
    [selectedWords, selectedOptions.size]
  );

  return (
    <div className="bg-card rounded-2xl shadow-xl p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Calculator className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">Prijscalculator</h3>
        </div>
        {showResetButton && (
          <button
            onClick={handleReset}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* Step 1: Production Type */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold text-primary">
            1
          </span>
          Kies je productie
        </h4>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {productionData.map((production, index) => (
            <ProductionButton
              key={production.name}
              production={production}
              isSelected={selectedProduction === index}
              onClick={productionHandlers[index]}
            />
          ))}
        </div>
      </div>

      {/* Step 2: Word Count */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold text-primary">
            2
          </span>
          {currentProduction.titleTwo}
        </h4>
        <div className="space-y-3">
          {currentProduction.itemlistTwo.map((item) => (
            <WordCountOption
              key={item.item}
              item={item}
              isSelected={selectedWords === item.item}
              onSelect={wordCountHandlers[item.item]}
            />
          ))}

          {selectedWords === 'Offerte op maat' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3"
            >
              <input
                type="text"
                placeholder="Vul het aantal woorden in..."
                value={customWordCount}
                onChange={(e) => setCustomWordCount(e.target.value)}
                className="w-full p-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Step 3: Extra Options */}
      {currentProduction.itemlistThree.length > 0 && (
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold text-primary">
              3
            </span>
            {currentProduction.titleThree} (optioneel)
          </h4>
          <div className="space-y-3">
            {currentProduction.itemlistThree.map((option) => (
              <ExtraOption
                key={option.item}
                option={option}
                isSelected={selectedOptions.has(option.item)}
                onToggle={optionToggleHandlers[option.item]}
                activeTooltip={activeTooltip}
                onTooltipToggle={handleTooltipToggle}
              />
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Region (if applicable) */}
      {currentProduction.uitzendgebied && (
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold text-primary">
              4
            </span>
            Uitzendgebied
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {currentProduction.uitzendgebied.map((region) => (
              <RegionOption
                key={region.name}
                region={region}
                isSelected={selectedRegion === region.name}
                onSelect={regionHandlers[region.name]}
              />
            ))}
          </div>
        </div>
      )}

      {/* Total Price */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex items-center justify-between mb-6">
          <span className="text-lg font-semibold">Totaalprijs</span>
          <motion.span
            key={total}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-bold text-primary"
          >
            €{total}
          </motion.span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!isFormValid}
          className="w-full bg-primary text-primary-foreground py-4 px-6 rounded-xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          Voeg toe aan winkelwagen
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
          <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>Inclusief professionele opname, editing en levering in gewenst formaat</p>
        </div>
      </div>
    </div>
  );
});

PriceCalculatorFormOptimized.displayName = 'PriceCalculatorForm';