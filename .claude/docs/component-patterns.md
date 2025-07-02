# 14Voices Component Patterns

## Shared Primitives

- Always use shared/Button.tsx instead of custom buttons
- Section.tsx for consistent spacing and layout
- Container.tsx for width constraints and padding
- Heading.tsx for typography hierarchy
- Text.tsx for consistent text styling

## Unified Components (Replaced Duplicates)

- UnifiedHero.tsx (replaces Hero + HeroBanner)
- UnifiedCTA.tsx (replaces CTABlock + CallToAction)
- 90% code reduction achieved

## Component Composition

```tsx
// Good: Using shared primitives
<Section>
  <Container>
    <Heading level={2}>Voice Talent</Heading>
    <Text>Browse our curated voices</Text>
    <Button variant="primary">Listen Now</Button>
  </Container>
</Section>

// Avoid: Custom one-off components
```
