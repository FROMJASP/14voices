# React Bits Documentation

React Bits - Open source collection of high quality, animated, interactive & fully customizable React components.

## Component Categories

### Layout Components
- **Hero Sections** - Full-width hero layouts with various styles
- **Feature Sections** - Showcase features with icons/images
- **Grid Layouts** - Responsive grid systems
- **Split Layouts** - Two-column layouts with content/media
- **Bento Grids** - Modern asymmetric grid layouts

### Navigation
- **Navbars** - Sticky/transparent navigation bars
- **Sidebars** - Collapsible side navigation
- **Tab Navigation** - Animated tab systems
- **Breadcrumbs** - Path navigation components
- **Mobile Menus** - Hamburger and slide-out menus

### Content Display
- **Cards** - Product/blog/profile cards with hover effects
- **Testimonials** - Quote carousels and grids
- **Pricing Tables** - Comparison and pricing components
- **Timelines** - Vertical/horizontal progress displays
- **Stats/Metrics** - Animated number displays

### Interactive Elements
- **Buttons** - Various styles with micro-animations
- **Forms** - Animated input fields and validation
- **Modals/Dialogs** - Popup overlays with transitions
- **Tooltips** - Contextual help popups
- **Accordions** - Expandable content sections

### Media Components
- **Image Galleries** - Lightbox and grid galleries
- **Video Players** - Custom video controls
- **Carousels/Sliders** - Image and content sliders
- **Before/After** - Comparison sliders
- **Image Effects** - Parallax, zoom, reveal animations

### Feedback & Status
- **Alerts/Toasts** - Notification components
- **Progress Bars** - Loading and completion indicators
- **Spinners/Loaders** - Loading animations
- **Empty States** - No-content displays
- **Error Pages** - 404/500 error designs

### Data Visualization
- **Charts** - Animated charts and graphs
- **Tables** - Sortable/filterable data tables
- **Dashboards** - Admin panel components
- **KPI Cards** - Key metric displays

### Marketing Components
- **CTAs** - Call-to-action sections
- **Newsletter Forms** - Email capture components
- **Social Proof** - Trust badges and counters
- **FAQ Sections** - Q&A layouts
- **Contact Forms** - Multi-step contact flows

## Integration Patterns

### Basic Usage
```tsx
import { HeroSection } from '@/components/react-bits/hero'
import { FeatureGrid } from '@/components/react-bits/features'

export default function LandingPage() {
  return (
    <>
      <HeroSection 
        title="Build Beautiful UIs"
        subtitle="With React Bits components"
        ctaText="Get Started"
      />
      <FeatureGrid features={features} />
    </>
  )
}
```

### With Tailwind Customization
```tsx
<Card className="bg-gradient-to-r from-purple-500 to-pink-500">
  <CardContent className="text-white">
    Custom styled React Bits component
  </CardContent>
</Card>
```

### Animation Control
```tsx
<AnimatedSection
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Content with custom animation
</AnimatedSection>
```

## Design System Integration

### Typography Scale
React Bits components use CSS variables for consistent typography:
- `--rb-font-heading`: Heading font family
- `--rb-font-body`: Body text font family
- `--rb-text-scale`: Base text scaling factor

### Color System
Components adapt to your color scheme:
- Use Tailwind classes for overrides
- Components respect dark mode automatically
- CSS variables for global theming

### Spacing System
Consistent spacing using Tailwind's spacing scale:
- Components use standard padding/margin values
- Responsive spacing built-in
- Easy to override with utility classes

## Performance Considerations

### Code Splitting
```tsx
const HeroSection = lazy(() => import('@/components/react-bits/hero'))
```

### Animation Performance
- Components use GPU-accelerated transforms
- Intersection Observer for scroll animations
- RequestAnimationFrame for smooth transitions

### Bundle Size
- Tree-shakeable exports
- Minimal dependencies
- CSS-in-JS free (uses Tailwind)

## Common Patterns

### Responsive Design
All components are mobile-first with breakpoints:
- `sm`: 640px
- `md`: 768px  
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Dark Mode Support
```tsx
<Card className="bg-white dark:bg-gray-800">
  Automatic dark mode support
</Card>
```

### Accessibility
- ARIA labels included
- Keyboard navigation support
- Screen reader friendly
- Focus management

## Customization Tips

### Extending Components
```tsx
const CustomHero = ({ ...props }) => (
  <HeroSection
    {...props}
    className="relative overflow-hidden"
    containerClass="max-w-7xl"
  />
)
```

### Theme Overrides
```css
:root {
  --rb-primary: #6366f1;
  --rb-radius: 0.75rem;
  --rb-transition: 200ms ease;
}
```

### Animation Variants
```tsx
const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}
```

## Best Practices

1. **Import only what you need** - Use specific imports
2. **Customize don't recreate** - Extend existing components
3. **Maintain consistency** - Use the same variants across pages
4. **Test on devices** - Components are responsive but verify
5. **Optimize images** - Use next/image for media components
6. **Consider loading states** - Add skeletons for dynamic content
7. **Accessibility first** - Don't remove ARIA attributes

## Resources

- Official Docs: https://reactbits.dev
- GitHub: https://github.com/reactbits/components
- Examples: https://reactbits.dev/examples
- Discord: https://discord.gg/reactbits