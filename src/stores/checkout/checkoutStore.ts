import { createStore } from '../lib/createStore';

interface CheckoutFormData {
  script?: string;
  toneOfVoice?: string;
  referenceExamples?: string;
  deliveryDate?: string;
}

interface ProductionConfig {
  productionName?: string;
  wordCount?: string;
  region?: string;
  extras?: string[];
}

interface CheckoutState {
  formData: CheckoutFormData;
  productionConfig: ProductionConfig;

  // Form actions
  updateFormField: (field: keyof CheckoutFormData, value: string) => void;
  setFormData: (data: CheckoutFormData) => void;
  resetForm: () => void;

  // Production config actions
  setProductionName: (name: string | undefined) => void;
  setWordCount: (count: string | undefined) => void;
  setRegion: (region: string | undefined) => void;
  setExtras: (extras: string[] | undefined) => void;
  resetProductionConfig: () => void;
}

export const useCheckoutStore = createStore<CheckoutState>('checkout', (set) => ({
  formData: {},
  productionConfig: {},

  // Form actions
  updateFormField: (field, value) => {
    set((state) => {
      state.formData[field] = value;
    });
  },

  setFormData: (data) => {
    set((state) => {
      state.formData = data;
    });
  },

  resetForm: () => {
    set((state) => {
      state.formData = {};
    });
  },

  // Production config actions
  setProductionName: (name) => {
    set((state) => {
      state.productionConfig.productionName = name;
    });
  },

  setWordCount: (count) => {
    set((state) => {
      state.productionConfig.wordCount = count;
    });
  },

  setRegion: (region) => {
    set((state) => {
      state.productionConfig.region = region;
    });
  },

  setExtras: (extras) => {
    set((state) => {
      state.productionConfig.extras = extras;
    });
  },

  resetProductionConfig: () => {
    set((state) => {
      state.productionConfig = {};
    });
  },
}));
