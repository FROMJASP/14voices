// Domain-specific components
export * from './domains/voiceover';
export * from './domains/production';
export * from './domains/cart';
// Pricing - use specific exports to avoid conflicts
export { UnifiedPriceCalculatorOptimized, PriceCalculatorHeader, PriceCalculatorContent, PriceCalculatorFooter, PriceCalculatorForm, PriceCalculatorSummary } from './domains/pricing';
// Use alias for pricing types to avoid conflicts
export type { 
  ExtraOption as PricingExtraOption,
  ProductionType as PricingProductionType,
  PriceItem,
  CartFormData,
  SelectedVoiceoverData,
  SimpleCartItem,
  ProductionData 
} from './domains/pricing';

// Common components
export * from './common/ui';
export * from './common/widgets';
export * from './common/layout';

// Feature components
export * from './features';

// Admin components (only when needed)
// export * from './admin';
