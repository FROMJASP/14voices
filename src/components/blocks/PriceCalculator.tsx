'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type {
  PriceCalculatorBlock as PriceCalculatorBlockType,
  Production,
  ExtraService,
} from '@/payload-types';
import { ChevronDown, Info, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useDrawerStore } from '@/stores';

type PriceCalculatorProps = PriceCalculatorBlockType;

export function PriceCalculator({
  title,
  subtitle,
  showAllProductions = true,
  selectedProductions,
  layout = 'cards',
  showVoiceoverSelection = false,
  ctaSettings,
  backgroundColor = 'default',
  anchorId = 'prijzen',
}: PriceCalculatorProps) {
  const [productions, setProductions] = useState<Production[]>([]);
  const [extraServices, setExtraServices] = useState<ExtraService[]>([]);
  const [selectedProduction, setSelectedProduction] = useState<number>(0);
  const [wordCount, setWordCount] = useState<string>('');
  const [versionCount, setVersionCount] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<'regional' | 'national'>('regional');
  const [selectedExtras, setSelectedExtras] = useState<Set<number>>(new Set());
  const [expandedInfo, setExpandedInfo] = useState<Set<number>>(new Set());
  const { openDrawer } = useDrawerStore();

  // Fetch productions and extra services
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch productions
        const productionsResponse = await fetch('/api/public/productions');
        const productionsData = await productionsResponse.json();

        if (showAllProductions) {
          setProductions(productionsData.docs || []);
        } else if (selectedProductions?.length) {
          const filteredProductions = productionsData.docs?.filter((prod: Production) =>
            selectedProductions.some((sp: any) =>
              typeof sp === 'number' ? sp === prod.id : sp.id === prod.id
            )
          );
          setProductions(filteredProductions || []);
        }

        // Fetch extra services
        const servicesResponse = await fetch('/api/public/extra-services');
        const servicesData = await servicesResponse.json();
        setExtraServices(servicesData.docs || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [showAllProductions, selectedProductions]);

  const currentProduction = productions.find((p) => p.id === selectedProduction);

  // Filter extra services based on selected production
  const availableServices = extraServices.filter((service) =>
    service.productions.some((prodId) =>
      typeof prodId === 'number'
        ? prodId === selectedProduction
        : (prodId as Production).id === selectedProduction
    )
  );

  // Calculate price
  const totalPrice = useMemo(() => {
    if (!currentProduction) return 0;

    let price = currentProduction.basePrice;

    // Calculate based on pricing type
    if (currentProduction.pricingType === 'wordBased' && wordCount) {
      const words = parseInt(wordCount);
      if (!isNaN(words) && currentProduction.wordPricingTiers) {
        // Find applicable tier
        for (const tier of currentProduction.wordPricingTiers) {
          if (words >= tier.minWords && (tier.maxWords === 0 || words <= tier.maxWords)) {
            price += tier.additionalPrice;
            break;
          }
        }

        // Apply formula for words above highest tier
        if (currentProduction.wordPricingFormula?.enabled) {
          const highestTier =
            currentProduction.wordPricingTiers[currentProduction.wordPricingTiers.length - 1];
          if (highestTier && words > highestTier.maxWords && highestTier.maxWords !== 0) {
            const extraWords = words - highestTier.maxWords;
            price += highestTier.additionalPrice;
            price += extraWords * (currentProduction.wordPricingFormula.pricePerWord || 0);
          }
        }
      }
    } else if (currentProduction.pricingType === 'versionBased' && versionCount) {
      const versions = parseInt(versionCount);
      if (!isNaN(versions) && currentProduction.versionPricing) {
        const versionPrice = currentProduction.versionPricing.find(
          (vp) => vp.versionCount === versions
        );
        if (versionPrice) {
          if (currentProduction.requiresRegion) {
            price =
              selectedRegion === 'regional'
                ? versionPrice.regionalPrice || 0
                : versionPrice.nationalPrice || 0;
          } else {
            price = versionPrice.price || 0;
          }
        }
      }
    }

    // Add extra services
    selectedExtras.forEach((serviceId) => {
      const service = availableServices.find((s) => s.id === serviceId);
      if (service) {
        // Check for production-specific pricing
        const override = service.productionPriceOverrides?.find((po) =>
          typeof po.production === 'number'
            ? po.production === selectedProduction
            : (po.production as Production).id === selectedProduction
        );
        price += override ? override.overridePrice : service.basePrice;
      }
    });

    return price;
  }, [
    currentProduction,
    wordCount,
    versionCount,
    selectedRegion,
    selectedExtras,
    availableServices,
    selectedProduction,
  ]);

  const handleExtraToggle = (serviceId: number) => {
    const service = availableServices.find((s) => s.id === serviceId);
    if (!service) return;

    const newExtras = new Set(selectedExtras);

    if (newExtras.has(serviceId)) {
      // Remove the service and any services that depend on it
      newExtras.delete(serviceId);
      availableServices.forEach((s) => {
        if (
          s.dependencies?.some((depId) =>
            typeof depId === 'number'
              ? depId === serviceId
              : (depId as ExtraService).id === serviceId
          )
        ) {
          newExtras.delete(s.id);
        }
      });
    } else {
      // Add the service and its dependencies
      newExtras.add(serviceId);
      service.dependencies?.forEach((depId) => {
        const depIdNum = typeof depId === 'number' ? depId : (depId as ExtraService).id;
        newExtras.add(depIdNum);
      });
    }

    setSelectedExtras(newExtras);
  };

  const toggleInfo = (serviceId: number) => {
    const newExpanded = new Set(expandedInfo);
    if (newExpanded.has(serviceId)) {
      newExpanded.delete(serviceId);
    } else {
      newExpanded.add(serviceId);
    }
    setExpandedInfo(newExpanded);
  };

  const backgroundClass = backgroundColor
    ? {
        default: 'bg-background',
        gray: 'bg-muted/30',
        white: 'bg-white dark:bg-gray-950',
      }[backgroundColor]
    : 'bg-background';

  const renderProductionSelector = () => {
    switch (layout) {
      case 'accordion':
        return (
          <div className="space-y-2">
            {productions.map((prod) => (
              <motion.div
                key={prod.id}
                className={`border rounded-lg overflow-hidden transition-colors ${
                  selectedProduction === prod.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <button
                  onClick={() =>
                    setSelectedProduction(selectedProduction === prod.id ? 0 : prod.id)
                  }
                  className="w-full px-4 py-3 flex items-center justify-between text-left"
                >
                  <div>
                    <h3 className="font-semibold text-foreground">{prod.name}</h3>
                    <p className="text-sm text-muted-foreground">Vanaf €{prod.basePrice}</p>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      selectedProduction === prod.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {selectedProduction === prod.id && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-2 border-t">
                        <p className="text-sm text-muted-foreground mb-4">{prod.description}</p>
                        {renderCalculatorContent()}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        );

      case 'tabs':
        return (
          <div>
            <div className="flex flex-wrap gap-2 mb-6 border-b">
              {productions.map((prod) => (
                <button
                  key={prod.id}
                  onClick={() => setSelectedProduction(prod.id)}
                  className={`px-4 py-2 font-medium transition-colors relative ${
                    selectedProduction === prod.id
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {prod.name}
                  {selectedProduction === prod.id && (
                    <motion.div
                      layoutId="active-tab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </button>
              ))}
            </div>
            {selectedProduction && currentProduction && (
              <div>
                <p className="text-muted-foreground mb-6">{currentProduction.description}</p>
                {renderCalculatorContent()}
              </div>
            )}
          </div>
        );

      case 'cards':
      default:
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {productions.map((prod) => (
                <motion.button
                  key={prod.id}
                  onClick={() => setSelectedProduction(prod.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                    selectedProduction === prod.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 bg-card'
                  }`}
                >
                  <h3 className="font-semibold text-foreground mb-1">{prod.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{prod.description}</p>
                  <p className="text-lg font-bold text-primary">Vanaf €{prod.basePrice}</p>
                </motion.button>
              ))}
            </div>
            {selectedProduction && currentProduction && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border rounded-lg p-6"
              >
                {renderCalculatorContent()}
              </motion.div>
            )}
          </div>
        );
    }
  };

  const renderCalculatorContent = () => {
    if (!currentProduction) return null;

    return (
      <div className="space-y-6">
        {/* Region selection for version-based pricing */}
        {currentProduction.pricingType === 'versionBased' && currentProduction.requiresRegion && (
          <div>
            <label className="block text-sm font-medium mb-2">Bereik</label>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedRegion('regional')}
                className={`px-4 py-2 rounded-md border transition-colors ${
                  selectedRegion === 'regional'
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                Regionaal
              </button>
              <button
                onClick={() => setSelectedRegion('national')}
                className={`px-4 py-2 rounded-md border transition-colors ${
                  selectedRegion === 'national'
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                Nationaal
              </button>
            </div>
          </div>
        )}

        {/* Word/Version count input */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {currentProduction.pricingType === 'wordBased' ? 'Aantal woorden' : 'Aantal versies'}
          </label>
          <input
            type="number"
            min="1"
            value={currentProduction.pricingType === 'wordBased' ? wordCount : versionCount}
            onChange={(e) =>
              currentProduction.pricingType === 'wordBased'
                ? setWordCount(e.target.value)
                : setVersionCount(e.target.value)
            }
            placeholder={currentProduction.pricingType === 'wordBased' ? 'bijv. 250' : 'bijv. 3'}
            className="w-full px-4 py-2 border rounded-md bg-background"
          />
          {currentProduction.wordPricingFormula?.explanation && (
            <p className="text-sm text-muted-foreground mt-1">
              {currentProduction.wordPricingFormula.explanation}
            </p>
          )}
        </div>

        {/* Extra services */}
        {availableServices.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">Extra diensten</label>
            <div className="space-y-2">
              {availableServices.map((service) => {
                const isSelected = selectedExtras.has(service.id);
                const isDisabled = service.dependencies?.some((dep) => {
                  const depId = typeof dep === 'number' ? dep : (dep as ExtraService).id;
                  return !selectedExtras.has(depId);
                });

                return (
                  <div key={service.id} className={isDisabled ? 'opacity-50' : ''}>
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id={`service-${service.id}`}
                        checked={isSelected}
                        onChange={() => handleExtraToggle(service.id)}
                        disabled={isDisabled}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor={`service-${service.id}`}
                            className="font-medium cursor-pointer"
                          >
                            {service.name}
                          </label>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              +€
                              {service.productionPriceOverrides?.find((po) =>
                                typeof po.production === 'number'
                                  ? po.production === selectedProduction
                                  : (po.production as Production).id === selectedProduction
                              )?.overridePrice || service.basePrice}
                            </span>
                            {service.infoText && (
                              <button
                                onClick={() => toggleInfo(service.id)}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <Info className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        {service.description && (
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                        )}
                        <AnimatePresence>
                          {expandedInfo.has(service.id) && service.infoText && (
                            <motion.p
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="text-sm text-muted-foreground mt-2"
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
          </div>
        )}

        {/* Price summary */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Totaal (excl. BTW)</span>
            <span className="text-primary">€{totalPrice}</span>
          </div>
        </div>

        {/* CTA */}
        {ctaSettings?.showCTA && (
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={ctaSettings.ctaLink || '/voiceovers'}
              className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium text-center hover:bg-primary/90 transition-colors"
            >
              {ctaSettings.ctaText || 'Bekijk onze voice-overs'}
            </Link>
            {showVoiceoverSelection && (
              <button
                onClick={() => openDrawer('cart')}
                className="flex-1 border border-primary text-primary px-6 py-3 rounded-md font-medium hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Direct bestellen
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <section id={anchorId || 'prijzen'} className={`py-16 ${backgroundClass}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            {title}
          </motion.h2>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {renderProductionSelector()}
      </div>
    </section>
  );
}
