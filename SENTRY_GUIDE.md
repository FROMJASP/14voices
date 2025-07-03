# 🚨 Sentry Guide for 14Voices

## Quick Reference

### Development Environment

- **Errors logged to console** (not sent to Sentry unless "Test error")
- **No session replay** (saves bandwidth)
- **100% performance tracking** (helps identify issues early)
- **Debug mode ON** (see Sentry operations in console)

### Production Environment

- **Real errors sent to Sentry** (filtered for noise)
- **10% session replay** (to debug user issues)
- **10% performance tracking** (balanced for cost)
- **Discord alerts** for new errors

## 📋 What Gets Captured

### ✅ Automatically Captured

- Unhandled errors (throw new Error)
- Promise rejections
- Console errors (in production)
- Network failures (500 errors)
- Performance metrics

### ❌ Filtered Out (Noise)

- Browser extension errors
- Network connection issues
- ResizeObserver warnings
- 404 errors
- Script errors from third-party

## 🎯 When to Use Sentry

### 1. **API Errors**

```typescript
try {
  const data = await fetchAPI();
} catch (error) {
  Sentry.captureException(error, {
    tags: { section: 'api', endpoint: '/voices' },
  });
}
```

### 2. **Critical Business Logic**

```typescript
// Payment processing, booking creation, etc.
Sentry.withScope((scope) => {
  scope.setLevel('error');
  scope.setTag('critical', true);
  Sentry.captureException(error);
});
```

### 3. **User Actions Tracking**

```typescript
Sentry.addBreadcrumb({
  message: 'User played demo',
  category: 'action',
  data: { demoId, voiceActor },
});
```

### 4. **Performance Issues**

```typescript
const transaction = Sentry.startTransaction({
  name: 'audio-processing',
  op: 'process',
});
// ... slow operation
transaction.finish();
```

## 🏷️ Tagging Best Practices

Always add context to errors:

```typescript
Sentry.captureException(error, {
  tags: {
    section: 'booking', // Where it happened
    action: 'create', // What was happening
    user_type: 'client', // Who was affected
  },
  extra: {
    bookingData: data, // Relevant data
    timestamp: Date.now(), // When it happened
  },
});
```

## 📊 Sentry Dashboard Tips

### Finding Errors

1. Go to **Issues** tab
2. Filter by:
   - Environment: `production` or `development`
   - Time range: Last 24h
   - Tags: Use your custom tags

### Understanding Errors

- **Events**: How many times it occurred
- **Users**: How many users affected
- **First/Last Seen**: Timeline
- **Tags**: Your custom context

### Useful Filters

- `is:unresolved` - Active issues
- `assigned:me` - Your assignments
- `level:error` - Skip warnings
- `tag:critical:true` - Critical issues

## 🚀 Pre-Production Checklist

Before deploying:

1. **Remove test pages**:

   ```bash
   rm -rf src/app/test-sentry
   rm -rf src/app/sentry-debug
   ```

2. **Update Discord alerts**:
   - Create separate rule for production
   - Set environment filter to "production"
   - Adjust notification frequency

3. **Configure sampling**:
   - Reduce `tracesSampleRate` if needed
   - Adjust `replaysSessionSampleRate`

4. **Test critical paths**:
   - Booking flow
   - Payment processing
   - Contact forms

## 🔧 Troubleshooting

### Errors not appearing in Sentry?

1. Check browser console for CSP errors
2. Verify DSN is correct
3. Check environment (dev vs prod)
4. Look for `beforeSend` filtering

### Too many alerts?

1. Adjust alert rules in Sentry
2. Add more specific filters
3. Group similar errors with fingerprinting
4. Increase action interval

### Performance impact?

1. Reduce `tracesSampleRate`
2. Disable session replay in dev
3. Filter out more error types

## 📱 Mobile & Browser Support

Sentry works on:

- ✅ All modern browsers
- ✅ Mobile Safari/Chrome
- ✅ Server-side (Node.js)
- ✅ Edge functions

## 💡 Pro Tips

1. **Use Error Boundaries** around unstable components
2. **Add breadcrumbs** before complex operations
3. **Set user context** after login
4. **Monitor performance** of critical paths
5. **Review weekly** in Sentry dashboard

Remember: Sentry is for **real errors** affecting users, not for debugging during development!
