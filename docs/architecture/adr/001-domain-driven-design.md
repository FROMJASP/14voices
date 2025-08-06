# ADR 001: Adopt Domain-Driven Design

## Status

Accepted

## Context

The 14voices platform has grown to include multiple business areas: voice-over marketplace, email marketing, bookings, and billing. The codebase was becoming difficult to maintain with business logic scattered across API routes and mixed concerns.

## Decision

We will adopt Domain-Driven Design (DDD) principles to organize the codebase into clearly defined domains, each with its own:

- Types/Models
- Services (business logic)
- Repositories (data access)
- Clear public API

## Consequences

### Positive

- Clear separation of concerns
- Business logic is centralized and testable
- Easy to understand domain boundaries
- Reduced coupling between features
- Easier to onboard new developers
- Better code reusability

### Negative

- Initial refactoring effort required
- Some additional abstraction layers
- Need to educate team on DDD concepts

## Implementation

Created the following domain structure:

```
src/domains/
├── email/       # Email marketing functionality
├── booking/     # Bookings and scripts
├── billing/     # Invoices and payments
└── voiceover/   # Voice talent features
```

Each domain follows the pattern:

- `types/` - Domain models and interfaces
- `services/` - Business logic
- `repositories/` - Data access
- `index.ts` - Public exports
