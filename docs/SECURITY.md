# Security Documentation

## Overview

This document outlines the security measures implemented in the 14voices application and provides guidelines for maintaining security.

## Security Features

### 1. Authentication & Authorization

- **Payload CMS Authentication**: Built-in auth with bcrypt password hashing
- **Role-Based Access Control**: admin, editor, user roles
- **Session Management**: Secure sessions with `sameSite: 'strict'`
- **Password Requirements**: Minimum 8 characters, complexity rules enforced

### 2. Input Validation & Sanitization

- **Zod Schema Validation**: All API inputs validated
- **XSS Protection**: Input sanitization for form submissions
- **SQL Injection Prevention**: Using Payload ORM, no raw SQL
- **Path Traversal Protection**: Filename sanitization in uploads

### 3. File Upload Security

- **Magic Number Validation**: Verifies file content matches MIME type
- **Threat Scanning**: Detects embedded executables and malicious patterns
- **Size Limits**: Different limits per file type
- **Filename Sanitization**: Prevents directory traversal attacks

### 4. Rate Limiting

- **Endpoint-Specific Limits**:
  - Auth endpoints: 5 requests per 15 minutes
  - Forms: 10 requests per minute
  - File uploads: 20 requests per 5 minutes
  - Public API: 60 requests per minute
- **Edge-Safe Implementation**: Works in Vercel Edge Runtime
- **Redis Support**: Distributed rate limiting when available

### 5. Security Headers

- **Content Security Policy**: Configured for Next.js compatibility
- **Strict Transport Security**: HSTS with preload
- **X-Frame-Options**: DENY
- **X-Content-Type-Options**: nosniff
- **Cross-Origin Policies**: CORP, COOP, COEP enabled

### 6. CSRF Protection

- **Token-Based Protection**: HMAC-signed tokens
- **Dedicated Secret**: Uses `CSRF_SECRET` environment variable
- **Automatic Validation**: For all state-changing requests

### 7. Environment Security

- **Validation on Startup**: All required variables checked
- **No Hardcoded Secrets**: All sensitive data in environment
- **Docker Security**: No default credentials in production

## Security Checklist

### Before Deployment

- [ ] Run `bun run validate:full` to check for issues
- [ ] Ensure all environment variables are set
- [ ] Generate strong passwords for all services
- [ ] Review dependency vulnerabilities with `npm audit`
- [ ] Test CSP headers don't break functionality
- [ ] Verify file upload restrictions work
- [ ] Check rate limiting is active
- [ ] Ensure Redis is configured for production

### Environment Variables

**Required Security Variables:**

```bash
# Core Security
PAYLOAD_SECRET=         # Min 32 characters
CSRF_SECRET=           # Min 32 characters, different from PAYLOAD_SECRET

# Database
DATABASE_URL=          # Use strong password
POSTGRES_PASSWORD=     # Min 32 characters for Docker

# Storage (if using MinIO)
MINIO_ROOT_USER=       # Not "minioadmin"
MINIO_ROOT_PASSWORD=   # Min 32 characters
S3_ACCESS_KEY=         # Same as MINIO_ROOT_USER
S3_SECRET_KEY=         # Same as MINIO_ROOT_PASSWORD
```

### Docker Security

1. **Never use default credentials**
2. **Always use .env files for secrets**
3. **Run containers as non-root user** (already configured)
4. **Use secrets management in production** (e.g., Vercel env vars)

### Monitoring & Logging

1. **Security Logs Collection**: Tracks security events
2. **Admin Access Monitoring**: Logs all admin panel access
3. **Failed Auth Tracking**: Records authentication failures
4. **File Threat Detection**: Logs blocked uploads

### Known Limitations

1. **CSP 'unsafe-inline'**: Required for Next.js compatibility
   - Mitigation: All user input is sanitized
   - Future: Consider nonce-based CSP when Next.js improves support

2. **File Scanning in Production**: Limited scanning with Vercel Blob
   - Mitigation: Basic MIME type validation still active
   - Recommendation: Implement async scanning service

3. **Edge Runtime Limitations**: No Payload access in middleware
   - Mitigation: Logging to console, manual review needed
   - Future: Implement async security event processing

## Security Contacts

- **Security Issues**: Report to security@14voices.com
- **Vulnerability Disclosure**: 90-day responsible disclosure policy
- **Updates**: Security patches applied within 48 hours of disclosure

## Regular Maintenance

### Weekly

- Review security logs for anomalies
- Check for new dependency vulnerabilities
- Monitor rate limit effectiveness

### Monthly

- Rotate API keys and tokens
- Review user access and permissions
- Audit file upload logs

### Quarterly

- Full security audit
- Penetration testing (if applicable)
- Update security dependencies

## Incident Response

1. **Detection**: Monitor logs and alerts
2. **Containment**: Block affected IPs/users
3. **Investigation**: Review security logs
4. **Remediation**: Apply fixes
5. **Communication**: Notify affected users if required
6. **Review**: Update security measures

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Payload CMS Security](https://payloadcms.com/docs/authentication/overview)
