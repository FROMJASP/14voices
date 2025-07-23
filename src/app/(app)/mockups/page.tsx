import Link from 'next/link';

export default function MockupsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Voiceover Section Mockups</h1>
          <p className="text-gray-600">Choose a mockup collection to view</p>
        </div>
        
        <div className="grid gap-6">
          <Link href="/mockups/header-layouts">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer">
              <h2 className="text-2xl font-semibold mb-2">Header Layout Mockups</h2>
              <p className="text-gray-600">5 original mockups for the header section spacing and layout</p>
            </div>
          </Link>
          
          <Link href="/mockups/footer-inspired">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer">
              <h2 className="text-2xl font-semibold mb-2">Footer-Inspired Variations</h2>
              <p className="text-gray-600">5 variations based on mockup 5 with footer design elements</p>
            </div>
          </Link>
          
          <Link href="/mockups/voiceover-sections">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer">
              <h2 className="text-2xl font-semibold mb-2">Complete Section Designs</h2>
              <p className="text-gray-600">5 new mockups with better filter spacing and distinct voiceover sections</p>
              <div className="mt-4 flex gap-2">
                <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full">NEW</span>
                <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full">Improved Spacing</span>
                <span className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full">Distinct Sections</span>
              </div>
            </div>
          </Link>
          
          <Link href="/mockups/responsive-sections">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer">
              <h2 className="text-2xl font-semibold mb-2">Mobile-Responsive Layouts</h2>
              <p className="text-gray-600">5 responsive mockups using existing voiceover cards with proper spacing</p>
              <div className="mt-4 flex gap-2">
                <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full">NEWEST</span>
                <span className="text-xs px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full">Mobile Ready</span>
                <span className="text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded-full">Fixed Spacing</span>
              </div>
            </div>
          </Link>
          
          <Link href="/mockups/cohesive-design">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer">
              <h2 className="text-2xl font-semibold mb-2">Cohesive Design System</h2>
              <p className="text-gray-600">5 unified designs where search, filters, and cards work as one system</p>
              <div className="mt-4 flex gap-2">
                <span className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full">LATEST</span>
                <span className="text-xs px-3 py-1 bg-pink-100 text-pink-700 rounded-full">Unified Design</span>
                <span className="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">Cohesive</span>
              </div>
            </div>
          </Link>
          
          <Link href="/mockups/enhanced-sidebar">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer">
              <h2 className="text-2xl font-semibold mb-2">Enhanced Sidebar Integration</h2>
              <p className="text-gray-600">5 enhanced versions of the sidebar design with Magic UI components</p>
              <div className="mt-4 flex gap-2">
                <span className="text-xs px-3 py-1 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 rounded-full font-bold">NEWEST</span>
                <span className="text-xs px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full">Magic UI</span>
                <span className="text-xs px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full">React Bits</span>
                <span className="text-xs px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full">Theme Colors</span>
              </div>
            </div>
          </Link>
          
          <Link href="/mockups/aurora-theme">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer">
              <h2 className="text-2xl font-semibold mb-2">Aurora Theme Variations</h2>
              <p className="text-gray-600">5 versions with aurora effects using theme colors and search/filter above cards</p>
              <div className="mt-4 flex gap-2">
                <span className="text-xs px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-bold animate-pulse">LATEST</span>
                <span className="text-xs px-3 py-1 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 rounded-full">Aurora Effects</span>
                <span className="text-xs px-3 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 rounded-full">Theme Colors</span>
                <span className="text-xs px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full">Top Filters</span>
              </div>
            </div>
          </Link>
          
          <Link href="/mockups/true-theme">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer">
              <h2 className="text-2xl font-semibold mb-2">True Brand Theme Aurora</h2>
              <p className="text-gray-600">5 versions with actual brand colors: green primary, cream background, golden accents</p>
              <div className="mt-4 flex gap-2">
                <span className="text-xs px-3 py-1 bg-[#18f109] text-black rounded-full font-bold animate-pulse">CORRECTED</span>
                <span className="text-xs px-3 py-1 bg-[#fcf9f5] text-[#76542d] rounded-full border border-[#ebaa3a]">Brand Colors</span>
                <span className="text-xs px-3 py-1 bg-[#efd243] text-black rounded-full">Yellow Accents</span>
                <span className="text-xs px-3 py-1 bg-gradient-to-r from-[#18f109]/20 to-[#ebaa3a]/20 text-gray-700 rounded-full">Aurora Effects</span>
              </div>
            </div>
          </Link>
          
          <Link href="/mockups/different-concepts">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer">
              <h2 className="text-2xl font-semibold mb-2">Completely Different Concepts</h2>
              <p className="text-gray-600">5 unique approaches: Spotify, Magazine, Apple, Radio Station, Netflix styles</p>
              <div className="mt-4 flex gap-2">
                <span className="text-xs px-3 py-1 bg-black text-white rounded-full font-bold">DIFFERENT</span>
                <span className="text-xs px-3 py-1 bg-[#1db954] text-black rounded-full">Spotify</span>
                <span className="text-xs px-3 py-1 bg-gray-100 text-black rounded-full border border-black">Magazine</span>
                <span className="text-xs px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full">Radio</span>
                <span className="text-xs px-3 py-1 bg-[#e50914] text-white rounded-full">Netflix</span>
              </div>
            </div>
          </Link>
          
          <Link href="/mockups/apple-inspired">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer">
              <h2 className="text-2xl font-semibold mb-2">Apple-Inspired Variations</h2>
              <p className="text-gray-600">5 clean designs with dark mode, proper sizing, and multi-select styles</p>
              <div className="mt-4 flex gap-2">
                <span className="text-xs px-3 py-1 bg-black text-white rounded-full font-bold">NEW</span>
                <span className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full border border-gray-300">Dark Mode</span>
                <span className="text-xs px-3 py-1 bg-[#18f109] text-black rounded-full">Multi-Select</span>
                <span className="text-xs px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full">Clean Design</span>
              </div>
            </div>
          </Link>
          
          <Link href="/mockups/swipe-design">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer">
              <h2 className="text-2xl font-semibold mb-2">Card Swipe Designs</h2>
              <p className="text-gray-600">5 swipeable card interfaces with mobile-responsive sidebar and cohesive design</p>
              <div className="mt-4 flex gap-2">
                <span className="text-xs px-3 py-1 bg-[#18f109] text-black rounded-full font-bold animate-pulse">NEWEST</span>
                <span className="text-xs px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full">Card Stack</span>
                <span className="text-xs px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full">3D Carousel</span>
                <span className="text-xs px-3 py-1 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 rounded-full">Tinder Style</span>
                <span className="text-xs px-3 py-1 bg-gray-900 text-white rounded-full text-xs">Mobile Ready</span>
              </div>
            </div>
          </Link>
          
          <Link href="/mockups/grid-layout">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer">
              <h2 className="text-2xl font-semibold mb-2">Grid Layout Designs</h2>
              <p className="text-gray-600">5 grid layouts with hero content from Version 2 and cohesive sidebar designs</p>
              <div className="mt-4 flex gap-2">
                <span className="text-xs px-3 py-1 bg-black text-white rounded-full font-bold">GRID</span>
                <span className="text-xs px-3 py-1 bg-gradient-to-r from-[#fcf9f5] to-white text-gray-700 rounded-full border border-gray-300">Split Screen</span>
                <span className="text-xs px-3 py-1 bg-[#18f109] text-black rounded-full">Hero Content</span>
                <span className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full">Mobile Ready</span>
              </div>
            </div>
          </Link>
          
          <Link href="/mockups/version-4-variations">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer">
              <h2 className="text-2xl font-semibold mb-2">Version 4 Variations</h2>
              <p className="text-gray-600">5 new designs with different hero sections above the voiceover grid</p>
              <div className="mt-4 flex gap-2">
                <span className="text-xs px-3 py-1 bg-[#18f109] text-black rounded-full font-bold animate-pulse">NEW</span>
                <span className="text-xs px-3 py-1 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-full">Minimalist</span>
                <span className="text-xs px-3 py-1 bg-[#efd243] text-black rounded-full">Feature Cards</span>
                <span className="text-xs px-3 py-1 bg-black text-white rounded-full">Video Hero</span>
                <span className="text-xs px-3 py-1 bg-[#ebaa3a] text-white rounded-full">Process Steps</span>
              </div>
            </div>
          </Link>
          
          <Link href="/mockups/testimonial-variations">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer">
              <h2 className="text-2xl font-semibold mb-2">Testimonial Variations</h2>
              <p className="text-gray-600">5 versions of 'De stem die jouw merk versterkt' with multi-select styles and reviews</p>
              <div className="mt-4 flex gap-2">
                <span className="text-xs px-3 py-1 bg-[#18f109] text-black rounded-full font-bold">TESTIMONIAL</span>
                <span className="text-xs px-3 py-1 bg-[#efd243] text-black rounded-full">Multi-Select</span>
                <span className="text-xs px-3 py-1 bg-gradient-to-r from-[#fcf9f5] to-white text-gray-700 rounded-full border border-gray-300">Reviews</span>
                <span className="text-xs px-3 py-1 bg-[#ebaa3a] text-white rounded-full">24u Fixed</span>
              </div>
            </div>
          </Link>
          
          <Link href="/mockups/clean-variations">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer">
              <h2 className="text-2xl font-semibold mb-2">Clean Variations</h2>
              <p className="text-gray-600">5 clean designs based on screenshot with floating testimonials and centered layout</p>
              <div className="mt-4 flex gap-2">
                <span className="text-xs px-3 py-1 bg-[#18f109] text-black rounded-full font-bold">CLEAN</span>
                <span className="text-xs px-3 py-1 bg-gradient-to-r from-gray-50 to-white text-gray-700 rounded-full border border-gray-300">Minimal</span>
                <span className="text-xs px-3 py-1 bg-[#fcf9f5] text-gray-700 rounded-full">Floating Reviews</span>
                <span className="text-xs px-3 py-1 bg-gradient-to-r from-[#18f109] to-[#efd243] bg-clip-text text-transparent font-bold">Gradient</span>
              </div>
            </div>
          </Link>
          
          <Link href="/mockups/search-field-design">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer">
              <h2 className="text-2xl font-semibold mb-2">Search Field Design</h2>
              <p className="text-gray-600">V2-based design with integrated style selector in search field</p>
              <div className="mt-4 flex gap-2">
                <span className="text-xs px-3 py-1 bg-[#18f109] text-black rounded-full font-bold">SEARCH</span>
                <span className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full">Multi-Select</span>
                <span className="text-xs px-3 py-1 bg-[#efd243] text-black rounded-full">9.1/10</span>
                <span className="text-xs px-3 py-1 bg-gray-900 text-white rounded-full">&lt;48u</span>
              </div>
            </div>
          </Link>
          
          <Link href="/mockups/artistic-variations">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer">
              <h2 className="text-2xl font-semibold mb-2">Artistic Variations</h2>
              <p className="text-gray-600">5 artistic designs with voiceover/recording themes and beautiful backgrounds</p>
              <div className="mt-4 flex gap-2">
                <span className="text-xs px-3 py-1 bg-[#18f109] text-black rounded-full font-bold">ARTISTIC</span>
                <span className="text-xs px-3 py-1 bg-[#fcf9f5] text-gray-700 rounded-full border border-gray-300">Sound Waves</span>
                <span className="text-xs px-3 py-1 bg-black text-white rounded-full">Studio</span>
                <span className="text-xs px-3 py-1 bg-gradient-to-r from-[#18f109] to-[#efd243] text-black rounded-full font-bold">Radio</span>
              </div>
            </div>
          </Link>
          
          <Link href="/mockups/unified-design">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer">
              <h2 className="text-2xl font-semibold mb-2">Unified Studio Design</h2>
              <p className="text-gray-600">Complete design with ON AIR, audio levels, frequency analyzer & waveform player</p>
              <div className="mt-4 flex gap-2">
                <span className="text-xs px-3 py-1 bg-red-500 text-white rounded-full font-bold animate-pulse">ON AIR</span>
                <span className="text-xs px-3 py-1 bg-black text-[#18f109] rounded-full font-mono">FREQ</span>
                <span className="text-xs px-3 py-1 bg-gradient-to-r from-[#18f109] to-[#efd243] text-black rounded-full">LEVELS</span>
                <span className="text-xs px-3 py-1 bg-[#18f109] text-black rounded-full">PLAYER</span>
              </div>
            </div>
          </Link>
          
          <Link href="/mockups/hero-distorted">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer">
              <h2 className="text-2xl font-semibold mb-2">Hero Distorted Backgrounds</h2>
              <p className="text-gray-600">5 hero sections with distorted backgrounds, margins, and unique layouts</p>
              <div className="mt-4 flex gap-2">
                <span className="text-xs px-3 py-1 bg-black text-white rounded-full font-bold animate-pulse">DISTORTED</span>
                <span className="text-xs px-3 py-1 bg-gradient-to-r from-[#18f109] to-transparent text-black rounded-full">Asymmetric</span>
                <span className="text-xs px-3 py-1 bg-gradient-to-r from-black to-gray-800 text-white rounded-full">3D Depth</span>
                <span className="text-xs px-3 py-1 bg-[#efd243] text-black rounded-full">Liquid</span>
              </div>
            </div>
          </Link>
          
          <Link href="/mockups/asymmetric-split-variations">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer">
              <h2 className="text-2xl font-semibold mb-2">Asymmetric Split Variations</h2>
              <p className="text-gray-600">5 variations based on asymmetric split design with GSAP animations</p>
              <div className="mt-4 flex gap-2">
                <span className="text-xs px-3 py-1 bg-[#18f109] text-black rounded-full font-bold animate-pulse">NEW</span>
                <span className="text-xs px-3 py-1 bg-black text-[#18f109] rounded-full font-bold">GSAP</span>
                <span className="text-xs px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full">Minimal</span>
                <span className="text-xs px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">Modern</span>
                <span className="text-xs px-3 py-1 bg-black text-white rounded-full">Neon</span>
              </div>
            </div>
          </Link>
          
          <Link href="/mockups/clean-minimal-variations">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer">
              <h2 className="text-2xl font-semibold mb-2">Clean Minimal Variations</h2>
              <p className="text-gray-600">5 clean minimal designs with GSAP 3-step animation and checkmark</p>
              <div className="mt-4 flex gap-2">
                <span className="text-xs px-3 py-1 bg-[#18f109] text-black rounded-full font-bold animate-pulse">LATEST</span>
                <span className="text-xs px-3 py-1 bg-black text-[#18f109] rounded-full font-bold">GSAP</span>
                <span className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full border border-gray-300">Clean</span>
                <span className="text-xs px-3 py-1 bg-white text-gray-700 rounded-full border border-gray-300">Minimal</span>
                <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full">✓ Checkmark</span>
              </div>
            </div>
          </Link>
          
          <Link href="/mockups/liquid-morph-variations">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer">
              <h2 className="text-2xl font-semibold mb-2">Liquid Morph Variations</h2>
              <p className="text-gray-600">5 vintage distorted variations with clear animated steps and mobile-ready design</p>
              <div className="mt-4 flex gap-2">
                <span className="text-xs px-3 py-1 bg-[#18f109] text-black rounded-full font-bold">VINTAGE</span>
                <span className="text-xs px-3 py-1 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-full">Vintage</span>
                <span className="text-xs px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">Retro</span>
                <span className="text-xs px-3 py-1 bg-black text-white rounded-full">Distorted</span>
                <span className="text-xs px-3 py-1 bg-gray-900 text-[#18f109] rounded-full font-mono text-xs">MOBILE</span>
              </div>
            </div>
          </Link>
          
          <Link href="/mockups/gsap-hero">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer">
              <h2 className="text-2xl font-semibold mb-2">GSAP Hero Variations</h2>
              <p className="text-gray-600">5 professional hero sections with advanced GSAP animations and film effects</p>
              <div className="mt-4 flex gap-2">
                <span className="text-xs px-3 py-1 bg-black text-[#18f109] rounded-full font-bold animate-pulse">GSAP</span>
                <span className="text-xs px-3 py-1 bg-gradient-to-r from-gray-900 to-black text-white rounded-full">Cinema</span>
                <span className="text-xs px-3 py-1 bg-red-600 text-white rounded-full">ON AIR</span>
                <span className="text-xs px-3 py-1 bg-gradient-to-r from-[#18f109] to-[#14c208] text-black rounded-full">PRO</span>
                <span className="text-xs px-3 py-1 bg-amber-900 text-amber-100 rounded-full">Film</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}