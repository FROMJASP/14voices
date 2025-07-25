'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Users, Building2, ArrowRight, Check, Sparkles, 
  Headphones, Mic, Globe, Clock, Shield, Award,
  BarChart3, HeartHandshake, Rocket
} from 'lucide-react';
import { useState } from 'react';

interface BentoItem {
  id: string;
  title: string;
  content: React.ReactNode;
  className: string;
  gradient?: string;
}

const bentoItems: BentoItem[] = [
  {
    id: 'main-pricing',
    title: 'Pricing Plans',
    className: 'col-span-2 lg:col-span-3 row-span-2',
    gradient: 'from-[#18f109]/20 via-[#efd243]/20 to-[#18f109]/20',
    content: (
      <div className="h-full flex flex-col">
        <h3 className="text-3xl font-bold text-gray-900 mb-8">Kies Jouw Plan</h3>
        <div className="grid md:grid-cols-3 gap-4 flex-1">
          {[
            { 
              name: 'Starter', 
              price: '€59', 
              icon: Zap, 
              features: ['500 woorden', '48u levering', 'MP3 export'],
              color: 'text-blue-500'
            },
            { 
              name: 'Pro', 
              price: '€159', 
              icon: Users, 
              features: ['2000 woorden', '24u levering', 'Alle formaten', 'Revisies'],
              color: 'text-[#18f109]',
              popular: true
            },
            { 
              name: 'Studio', 
              price: 'Custom', 
              icon: Building2, 
              features: ['Onbeperkt', 'Direct', 'Full service', 'API'],
              color: 'text-purple-500'
            },
          ].map((plan) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.name}
                whileHover={{ y: -5 }}
                className={`relative p-6 rounded-2xl border-2 transition-all ${
                  plan.popular 
                    ? 'border-[#18f109] bg-gradient-to-br from-[#18f109]/5 to-[#efd243]/5' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#18f109] text-white text-xs font-semibold px-3 py-1 rounded-full">
                      POPULAIR
                    </span>
                  </div>
                )}
                <Icon className={`w-8 h-8 ${plan.color} mb-4`} />
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h4>
                <p className="text-2xl font-bold text-gray-900 mb-4">{plan.price}</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-[#18f109]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-2 rounded-lg font-medium transition-all ${
                  plan.popular
                    ? 'bg-[#18f109] text-white hover:bg-[#16d008]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                  Selecteer
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    ),
  },
  {
    id: 'calculator',
    title: 'Quick Calculator',
    className: 'col-span-2 lg:col-span-2',
    content: (
      <div className="h-full">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#18f109]" />
          Bereken Direct
        </h4>
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">Aantal woorden:</span>
            <span className="text-2xl font-bold text-gray-900">750</span>
          </div>
          <input
            type="range"
            min="100"
            max="2000"
            defaultValue="750"
            className="w-full mb-4"
            style={{
              background: 'linear-gradient(to right, #18f109 0%, #18f109 35%, #e5e7eb 35%, #e5e7eb 100%)'
            }}
          />
          <div className="pt-3 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Geschatte prijs:</span>
              <span className="text-xl font-bold text-[#18f109]">€89</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'features',
    title: 'Why Choose Us',
    className: 'col-span-1',
    gradient: 'from-purple-500/10 to-pink-500/10',
    content: (
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Waarom 14Voices?</h4>
        {[
          { icon: Award, text: '500+ Stemmen' },
          { icon: Globe, text: '25+ Talen' },
          { icon: Shield, text: '100% Garantie' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.text}
              whileHover={{ x: 5 }}
              className="flex items-center gap-3"
            >
              <Icon className="w-5 h-5 text-purple-500" />
              <span className="text-gray-700">{item.text}</span>
            </motion.div>
          );
        })}
      </div>
    ),
  },
  {
    id: 'testimonial',
    title: 'Customer Love',
    className: 'col-span-2 lg:col-span-3',
    content: (
      <div className="flex items-center gap-6">
        <div className="hidden sm:block">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#18f109] to-[#efd243] flex items-center justify-center">
            <HeartHandshake className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-gray-700 italic mb-2">
            "14Voices heeft onze productietijd met 80% verminderd. De kwaliteit is fantastisch!"
          </p>
          <p className="text-sm text-gray-600">— Marketing Manager, RTL Nederland</p>
        </div>
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <Sparkles className="w-6 h-6 text-[#efd243]" />
        </motion.div>
      </div>
    ),
  },
  {
    id: 'cta',
    title: 'Get Started',
    className: 'col-span-1',
    gradient: 'from-[#18f109]/20 to-[#efd243]/20',
    content: (
      <div className="h-full flex flex-col justify-center">
        <Rocket className="w-8 h-8 text-[#18f109] mb-3" />
        <h4 className="text-lg font-semibold text-gray-900 mb-2">Start Nu</h4>
        <p className="text-sm text-gray-600 mb-4">
          Eerste project gratis proberen
        </p>
        <button className="w-full bg-gradient-to-r from-[#18f109] to-[#efd243] text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 group">
          Probeer Gratis
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    ),
  },
  {
    id: 'stats',
    title: 'Live Stats',
    className: 'col-span-1',
    content: (
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-600 mb-3">Live Statistieken</h4>
        {[
          { label: 'Actieve projecten', value: '127', color: 'text-[#18f109]' },
          { label: 'Stemmen online', value: '45', color: 'text-[#efd243]' },
          { label: 'Gem. levertijd', value: '4.2u', color: 'text-purple-500' },
        ].map((stat) => (
          <div key={stat.label} className="flex justify-between items-center">
            <span className="text-xs text-gray-600">{stat.label}</span>
            <motion.span
              className={`text-lg font-bold ${stat.color}`}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: Math.random() * 2 }}
            >
              {stat.value}
            </motion.span>
          </div>
        ))}
      </div>
    ),
  },
];

export function PricingMockup5() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 bg-[#18f109]/10 backdrop-blur rounded-full px-4 py-2 mb-6"
          >
            <Mic className="w-4 h-4 text-[#18f109]" />
            <span className="text-sm font-medium text-gray-700">Flexibele Prijzen</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-['Plus_Jakarta_Sans']">
            Alles Wat Je Nodig Hebt
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Een complete oplossing voor al je voice-over behoeften
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 auto-rows-[200px]">
          {bentoItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`${item.className} relative group`}
            >
              <motion.div
                className={`h-full rounded-3xl p-6 border-2 transition-all ${
                  hoveredItem === item.id 
                    ? 'border-gray-300 shadow-xl' 
                    : 'border-gray-200 shadow-sm'
                } ${item.gradient ? `bg-gradient-to-br ${item.gradient}` : 'bg-white'}`}
                whileHover={{ y: -2 }}
              >
                {/* Hover effect */}
                <AnimatePresence>
                  {hoveredItem === item.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/50 to-transparent pointer-events-none"
                    />
                  )}
                </AnimatePresence>

                {/* Content */}
                <div className="relative h-full">
                  {item.content}
                </div>

                {/* Corner decoration */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-2 h-2 bg-[#18f109] rounded-full animate-pulse" />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom FAQ */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 mb-4">
            Vragen over prijzen? Check onze{' '}
            <a href="#" className="text-[#18f109] hover:underline font-medium">
              veelgestelde vragen
            </a>{' '}
            of neem{' '}
            <a href="#" className="text-[#18f109] hover:underline font-medium">
              contact
            </a>{' '}
            op.
          </p>
          
          <div className="flex justify-center gap-8 mt-8">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 text-gray-500">
              <Clock className="w-4 h-4" />
              <span className="text-sm">24/7 Support</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 text-gray-500">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Veilig Betalen</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 text-gray-500">
              <Headphones className="w-4 h-4" />
              <span className="text-sm">Direct Contact</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}