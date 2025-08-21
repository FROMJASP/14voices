# Changelog

## [Unreleased] - Platform Agnostic Migration

### Removed

- Vercel-specific deployment configurations
- Neon PostgreSQL integration scripts
- Vercel Blob storage references
- Vercel-specific build and deployment scripts
- Unnecessary telemetry configurations

### Modified

- Updated documentation to be platform-agnostic
- Simplified Sentry configuration
- Removed platform-specific environment variables
- Cleaned up package.json scripts

### Notes

- Project is now fully self-hostable
- Supports standard PostgreSQL and MinIO/S3 storage
- Simplified deployment process
