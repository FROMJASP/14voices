# Development Notes

## OpenTelemetry and Sentry Webpack Warnings

### Problem

During development, you may encounter webpack warnings related to OpenTelemetry instrumentation:

```
Critical dependency: the request of a dependency is an expression
```

### Solution

We've added webpack configuration in `next.config.ts` to suppress these warnings:

```typescript
webpack: (config, { isServer }) => {
  config.ignoreWarnings = [
    ...(config.ignoreWarnings || []),
    /Critical dependency: the request of a dependency is an expression/,
    /Module not found: Can't resolve/,
  ];

  return config;
};
```

### Background

These warnings are typically harmless and stem from how OpenTelemetry and Sentry perform dynamic imports for instrumentation. The webpack configuration allows the build to proceed without interrupting the development workflow.

### Recommendations

- Monitor these warnings for any actual issues
- If problems persist, consider updating OpenTelemetry and Sentry dependencies
