# 14Voices Development Standards

## Git Safety Protocol

1. Always commit before Claude Code sessions
2. Create feature branches for experiments
3. Push frequently to GitHub
4. Tag stable versions

## Build Validation

1. `bun run build` must succeed locally
2. `bun payload generate:types` after schema changes
3. ESLint and TypeScript strict mode
4. Test with `bun test` before deployment

## Testing Strategy

- Vitest for unit tests
- Testing Library for component tests
- Coverage reports required
- E2E testing for critical flows

## Performance Standards

- API responses: <200ms
- Database queries: <50ms
- Cache hit rate: >80%
- Email processing: 1000+/min
