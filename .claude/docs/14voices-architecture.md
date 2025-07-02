# 14Voices Domain-Driven Architecture

## Domain Structure

- `domains/voiceover/` - Core business logic
  - `types/` - Domain type definitions
  - `repositories/` - Data access layer
  - `services/` - Business logic layer

## Component Architecture

- `components/shared/` - UI primitives (Button, Section, Container, Heading, Text)
- `components/unified/` - Consolidated components (UnifiedHero, UnifiedCTA)
- `components/blocks/` - Content blocks
- `components/layout/` - Layout components
- `components/admin/` - Payload admin customizations

## Infrastructure Layers

- `lib/cache/` - Multi-layer caching (LRU + Redis)
- `lib/validation/` - Zod schemas for all endpoints
- `lib/api/` - Reusable API handlers
- `lib/email/` - Batch processing & monitoring
- `lib/payload/` - Query optimization
