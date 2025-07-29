# NavigationBar Test Suite

## Test Structure

### Files

- `NavigationBar.test.tsx` - Main test suite with comprehensive tests
- `NavigationBar.tdd-example.test.tsx` - TDD examples for new features (skipped by default)

### Test Utilities

- `/src/test/setup.ts` - Global test setup (mocks, DOM polyfills)
- `/src/test/utils.tsx` - Common test utilities and custom render functions
- `/src/test/mocks/navigation.ts` - Mock data and helpers for navigation tests

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (recommended for TDD)
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Coverage

Current test coverage includes:

- Component rendering
- Scroll behavior and style changes
- Mobile menu interactions
- Language switching
- Navigation links
- Accessibility (basic)
- Cleanup and unmounting

## TDD Workflow

1. Write a failing test for new feature
2. Run `npm run test:watch`
3. Implement minimal code to pass test
4. Refactor while keeping tests green
5. Repeat

## Writing New Tests

Example test structure:

```typescript
describe('Feature Name', () => {
  it('should do something specific', async () => {
    // Arrange
    render(<NavigationBar />)

    // Act
    await user.click(screen.getByRole('button'))

    // Assert
    expect(screen.getByText('Expected')).toBeInTheDocument()
  })
})
```

## Common Patterns

### Finding Elements

```typescript
// By role (preferred)
screen.getByRole('button', { name: /submit/i });

// By text
screen.getByText('14voices');

// By test id (last resort)
screen.getByTestId('navigation-menu');
```

### User Interactions

```typescript
// Click
await user.click(element);

// Type
await user.type(input, 'text');

// Keyboard
await user.keyboard('{Escape}');
```

### Waiting for Changes

```typescript
// Wait for element
await screen.findByText('Loading...');

// Wait for condition
await waitFor(() => {
  expect(element).toHaveClass('active');
});
```

## Mocking

### Next.js Components

```typescript
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))
```

### Framer Motion

```typescript
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => children,
}))
```

## Debugging Tests

```typescript
// Print DOM
screen.debug()

// Print specific element
screen.debug(element)

// Use test UI for visual debugging
npm run test:ui
```
