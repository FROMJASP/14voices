'use client';

import Link from 'next/link';

export default function MockupsIndex() {
  const mockupCategories = [
    {
      title: 'Voiceover Card Designs',
      description: 'Various design iterations for voiceover showcase cards',
      items: [
        {
          name: 'Initial Voiceover Cards',
          href: '/navbar-mockups/voiceover-cards',
          description: '5 initial mockup designs with different styles',
        },
        {
          name: 'Complete Voiceover Cards',
          href: '/navbar-mockups/voiceover-cards-complete',
          description: '5 designs with all required elements (play, demos, tags, book button)',
        },
        {
          name: 'Footer-Inspired Cards',
          href: '/navbar-mockups/voiceover-cards-footer',
          description: '5 clean designs inspired by the footer aesthetic',
        },
        {
          name: 'Sophisticated Cards',
          href: '/navbar-mockups/voiceover-cards-sophisticated',
          description: '5 premium designs optimized for grid display with portrait ratio',
        },
        {
          name: 'Glassmorphic Variations',
          href: '/navbar-mockups/voiceover-cards-glassmorphic',
          description: '5 variations with improved visibility and editorial typography',
        },
      ],
    },
    {
      title: 'Navigation Designs',
      description: 'Navbar and navigation mockups',
      items: [
        {
          name: 'Transparent Glass Navbar',
          href: '/navbar-mockups',
          description: 'Clean navbar with glass morphism effects and font variations',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          Design Mockups
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Explore all design variations and mockups for the 14voices platform
        </p>

        {mockupCategories.map((category) => (
          <div key={category.title} className="mb-16">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
              {category.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">{category.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.items.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all p-6 cursor-pointer hover:scale-[1.02] h-full">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Quick Stats */}
        <div className="mt-20 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Design Progress
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-primary">25+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Card Variations</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">5</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Design Themes</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">3:4</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Optimized Ratio</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">100%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Grid Ready</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
