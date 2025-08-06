/**
 * Data structure for cart form submission
 */
export interface CartFormData {
  productionIndex: number;
  selectedWords?: string;
  selectedRegion?: string;
  selectedOptions: Set<string>;
  total: number;
}

/**
 * Selected voiceover data for cart summary
 */
export interface SelectedVoiceoverData {
  name: string;
  id?: string;
  slug?: string;
}

/**
 * Cart item structure
 */
export interface SimpleCartItem {
  id: string;
  name: string;
  price: number;
  type: 'base' | 'extra';
  description?: string;
}

/**
 * Production data structure used throughout the calculator
 */
export interface ProductionData {
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  pricePerWord?: number;
  extras?: Array<{
    name: string;
    price: number;
    description?: string;
  }>;
  regions?: Array<{
    name: string;
    multiplier: number;
  }>;
}
