import { PricingMockup1 } from '@/components/pricing/PricingMockup1';
import { PricingMockup2 } from '@/components/pricing/PricingMockup2';
import { PricingMockup3 } from '@/components/pricing/PricingMockup3';
import { PricingMockup4Simple } from '@/components/pricing/PricingMockup4Simple';
import { PricingMockup5 } from '@/components/pricing/PricingMockup5';

export default function PricingDemoPage() {
  return (
    <div className="space-y-0">
      <div className="bg-white py-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Pricing Section Mockups</h1>
        <p className="text-gray-600 mt-2">Scroll to see all 5 designs</p>
      </div>
      
      <div id="mockup1">
        <h2 className="text-2xl font-bold text-center py-8 bg-gray-100">
          Mockup 1: Modern Cards with Gradient Borders
        </h2>
        <PricingMockup1 />
      </div>
      
      <div id="mockup2">
        <h2 className="text-2xl font-bold text-center py-8 bg-gray-100 text-white">
          Mockup 2: Interactive Slider Pricing
        </h2>
        <PricingMockup2 />
      </div>
      
      <div id="mockup3">
        <h2 className="text-2xl font-bold text-center py-8 bg-gray-100">
          Mockup 3: Minimal Comparison Table
        </h2>
        <PricingMockup3 />
      </div>
      
      <div id="mockup4">
        <h2 className="text-2xl font-bold text-center py-8 bg-gray-100 text-white">
          Mockup 4: Creative 3D Cards
        </h2>
        <PricingMockup4Simple />
      </div>
      
      <div id="mockup5">
        <h2 className="text-2xl font-bold text-center py-8 bg-gray-100">
          Mockup 5: Bento Grid Layout
        </h2>
        <PricingMockup5 />
      </div>
    </div>
  );
}