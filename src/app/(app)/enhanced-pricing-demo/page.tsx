'use client';

import dynamic from 'next/dynamic';
import { EnhancedPricingMockup1 } from '@/components/pricing/EnhancedPricingMockup1';
import { EnhancedPricingMockup2 } from '@/components/pricing/EnhancedPricingMockup2';

import { EnhancedPricingMockup3Simple } from '@/components/pricing/EnhancedPricingMockup3Simple';

export default function EnhancedPricingDemoPage() {
  return (
    <div className="space-y-0">
      <div className="bg-gray-900 text-white py-8 text-center sticky top-0 z-50">
        <h1 className="text-3xl font-bold">Enhanced Voice-Over Pricing Calculators</h1>
        <p className="text-gray-400 mt-2">Based on your existing "Kies je productiesoort" system</p>
      </div>
      
      <div id="mockup1">
        <h2 className="text-2xl font-bold text-center py-8 bg-gray-100">
          1. Multi-Step Wizard Experience
        </h2>
        <EnhancedPricingMockup1 />
      </div>
      
      <div id="mockup2">
        <h2 className="text-2xl font-bold text-center py-8 bg-gray-800 text-white">
          2. Visual Timeline Builder
        </h2>
        <EnhancedPricingMockup2 />
      </div>
      
      <div id="mockup3">
        <h2 className="text-2xl font-bold text-center py-8 bg-gray-900 text-white">
          3. 3D Interactive Configurator
        </h2>
        <EnhancedPricingMockup3Simple />
      </div>
    </div>
  );
}