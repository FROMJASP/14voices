# Security Implementation Guide

## Overview

This document outlines the security measures implemented in the 14voices application and explains certain design decisions.

## Content Security Policy (CSP)

### Current Implementation

The application uses a Content Security Policy with `'unsafe-inline'` for scripts. While nonce-based CSP would be more secure, Next.js requires `'unsafe-inline'` for its hydration and runtime scripts to function properly.

### Why 'unsafe-inline' is Required

1. **Next.js Hydration**: Next.js injects inline scripts for React hydration
2. **Runtime Scripts**: Dynamic imports and code splitting require inline script execution
3. **Development Experience**: Implementing strict CSP with Next.js significantly complicates development

### Mitigation Strategies

Despite using `'unsafe-inline'`, we implement several measures to maintain security:

- Strict input validation and sanitization
- CSRF protection on all state-changing operations
- Comprehensive security headers
- Regular security audits
- XSS protection through proper output encoding

### Future Considerations

When Next.js provides better nonce-based CSP support, we can migrate to a stricter policy. For now, the trade-off between functionality and security has been carefully considered.

## CSRF Protection

### Implementation

- **Dedicated Secret**: Use `CSRF_SECRET` environment variable (falls back to `PAYLOAD_SECRET` if not set)
- **Token Generation**: Cryptographically secure tokens with HMAC signatures
- **Token Validation**: Timing-safe comparison to prevent timing attacks
- **Cookie Settings**: `sameSite: 'strict'` and `httpOnly: true`

### Configuration

Add to your `.env` file:
```
CSRF_SECRET=<generate-different-secret-from-payload-secret>
```

## Session Security

### Configuration

Sessions are configured with maximum security:

- `sameSite: 'strict'` - Prevents CSRF attacks
- `secure: true` - HTTPS only in production
- `httpOnly: true` - Not accessible via JavaScript
- `maxAge: 7 days` - Reasonable session duration

## Security Headers

The following security headers are implemented via middleware:

### Standard Headers

- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-XSS-Protection: 1; mode=block` - Legacy XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information
- `Permissions-Policy` - Restricts browser features

### HTTPS Headers

- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` - Forces HTTPS
- `upgrade-insecure-requests` - Upgrades HTTP to HTTPS (production only)

### Cross-Origin Headers

- `Cross-Origin-Opener-Policy: same-origin` - Isolates browsing context
- `Cross-Origin-Resource-Policy: same-origin` - Prevents resource loading from other origins
- `Cross-Origin-Embedder-Policy: require-corp` - Requires explicit permission for embedding

### Additional Headers

- `X-DNS-Prefetch-Control: off` - Disables DNS prefetching
- `X-Download-Options: noopen` - Prevents IE from executing downloads
- `X-Permitted-Cross-Domain-Policies: none` - Restricts Adobe cross-domain policies

## Rate Limiting

Comprehensive rate limiting is implemented for different endpoint types:

- **Public endpoints**: 60 requests/minute
- **Authenticated endpoints**: 100 requests/minute
- **Form submissions**: 10 requests/minute
- **Auth endpoints**: 5 requests/15 minutes
- **File uploads**: 20 requests/5 minutes

## Input Validation

All user input is validated and sanitized:

- Maximum string lengths enforced
- HTML stripping where appropriate
- SQL injection pattern detection (for logging)
- Parameterized queries for database operations

## Monitoring

Security events are logged for monitoring:

- Failed authentication attempts
- Admin access logs
- Suspicious query parameters
- Blocked user agents and paths

## Best Practices

1. **Environment Variables**: Always use strong, unique secrets
2. **HTTPS**: Ensure production uses HTTPS exclusively
3. **Updates**: Keep dependencies updated for security patches
4. **Audits**: Regular security audits and penetration testing
5. **Principle of Least Privilege**: Limit access and permissions

## Known Limitations

1. **CSP 'unsafe-inline'**: Required for Next.js compatibility
2. **CORS in Development**: Relaxed for local development

These limitations are documented and monitored, with compensating controls in place.