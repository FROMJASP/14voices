# 14voices Landing Page Components

This directory contains beautiful, modern React components for the 14voices landing page. All components are built with Next.js, TypeScript, Tailwind CSS, and Framer Motion for smooth animations.

## Components

### 1. NavigationBar

A clean, modern navigation bar with:

- Responsive design with mobile hamburger menu
- Smooth scroll-based transparency effect
- Language switcher (NL/EN)
- Beautiful gradient hover effects
- Animated mobile menu with backdrop

### 2. HeroSection

A stunning hero section featuring:

- Animated gradient background blobs
- Gradient text effects
- Two CTA buttons with hover animations
- Floating emoji elements
- Scroll indicator animation
- Fully responsive design

### 3. VoiceoverShowcase

A beautiful grid component that:

- Fetches voiceovers from `/api/voiceovers`
- Shows profile photos with hover effects
- Displays name and style tags
- Includes an integrated audio player
- Shows availability status (Beschikbaar/Niet beschikbaar)
- Has filtering by style tags
- Responsive grid: 3 columns on desktop, 2 on tablet, 1 on mobile
- Loading skeleton states
- Smooth animations with Framer Motion

## Installation

1. Install required dependencies:

```bash
npm install framer-motion
# or
yarn add framer-motion
# or
bun add framer-motion
```

2. Make sure you have the required utility components:

- `/src/components/magicui/shimmer-button.tsx`
- `/src/components/magicui/blur-fade.tsx`
- `/src/components/magicui/animated-gradient-text.tsx`
- `/src/lib/utils.ts` (with `cn` function)

## Usage

### Basic Implementation

```tsx
import { NavigationBar, HeroSection, VoiceoverShowcase } from '@/components/sections';

export default function HomePage() {
  return (
    <>
      <NavigationBar />
      <main>
        <HeroSection />
        <VoiceoverShowcase />
      </main>
    </>
  );
}
```

### Demo Page

A complete demo page is available at `/demo` showing all components in action:

```
/src/app/(app)/demo/page.tsx
```

### Integration with Existing Pages

To integrate with your existing Payload CMS pages:

1. Import the components you need
2. Place them before or after your `<PageRenderer>` component
3. Or create custom blocks in Payload CMS that render these components

Example:

```tsx
import { NavigationBar, HeroSection } from '@/components/sections';
import { PageRenderer } from '@/components/PageRenderer';

export default async function Page() {
  // ... fetch page data

  return (
    <>
      <NavigationBar />
      {/* Use custom hero if no page blocks */}
      {!page.blocks?.length && <HeroSection />}
      <PageRenderer page={page} />
    </>
  );
}
```

## Customization

### Colors and Styling

- All components use Tailwind CSS classes
- Primary gradient: purple-600 to pink-600
- Dark mode is fully supported
- Animations use Framer Motion

### Language Support

The NavigationBar includes a language switcher. To connect it with your i18n setup:

1. Import your i18n hook/context
2. Update the `toggleLanguage` function in NavigationBar
3. Update the navigation items based on current language

### API Integration

The VoiceoverShowcase component expects the API to return data in this format:

```typescript
{
  docs: Array<{
    id: string;
    name: string;
    description?: string;
    profilePhoto?: {
      url: string;
      alt?: string;
    };
    styleTags?: Array<{
      tag: string;
      customTag?: string;
    }>;
    availability?: {
      isAvailable: boolean;
    };
    demos?: Array<{
      id: string;
      title: string;
      audioFile: {
        url: string;
      };
      duration?: string;
      isPrimary?: boolean;
    }>;
  }>;
}
```

## Performance Considerations

- Images are optimized using Next.js Image component
- Components use lazy loading and blur effects
- Audio files are loaded on-demand
- Animations are GPU-accelerated
- Mobile menu prevents body scroll when open

## Browser Support

- All modern browsers
- Mobile responsive
- Touch-friendly interactions
- Keyboard accessible

## Future Enhancements

Consider adding:

- Search functionality in VoiceoverShowcase
- More filter options (language, accent, etc.)
- Pagination or infinite scroll for large datasets
- Analytics tracking on CTA clicks
- A/B testing variants
