import { useState, useEffect } from 'react';

export interface Production {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  description?: string;
  videoUrl?: any;
  buyoutDuration?: string;
  pricingType: 'wordBased' | 'versionBased';
  requiresRegion?: boolean;
  wordPricingTiers?: Array<{
    minWords: number;
    maxWords: number;
    additionalPrice: number;
  }>;
  wordPricingFormula?: {
    enabled: boolean;
    pricePerWord?: number;
    explanation?: string;
  };
  versionPricing?: Array<{
    versionCount: number;
    regionalPrice?: number;
    nationalPrice?: number;
    price?: number;
  }>;
  formSettings?: {
    scriptPlaceholder?: string;
    instructionsPlaceholder?: string;
    maxRecordingMinutes?: number;
    showVideoLinkField?: boolean;
    videoLinkPlaceholder?: string;
  };
  status: string;
  sortOrder?: number;
}

export interface ExtraService {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  description?: string;
  infoText?: string;
  productions: Array<string | { id: string }>;
  productionPriceOverrides?: Array<{
    production: string | { id: string };
    overridePrice: number;
  }>;
  dependencies?: Array<string | { id: string }>;
  status: string;
  sortOrder?: number;
}

export function useProductions() {
  const [productions, setProductions] = useState<Production[]>([]);
  const [extraServices, setExtraServices] = useState<ExtraService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch productions
        const [productionsRes, servicesRes] = await Promise.all([
          fetch('/api/public/productions'),
          fetch('/api/public/extra-services'),
        ]);

        if (!productionsRes.ok || !servicesRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const productionsData = await productionsRes.json();
        const servicesData = await servicesRes.json();

        console.log('Productions from API:', productionsData.docs);

        setProductions(productionsData.docs || []);
        setExtraServices(servicesData.docs || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load production data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { productions, extraServices, loading, error };
}
