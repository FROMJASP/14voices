# File Cleanup Guide for 14voices

## Files to KEEP (Essential):

### Docker/Deployment Files

- `Dockerfile` - Required for building your container
- `.dockerignore` - Prevents unnecessary files from being copied to container
- `docker-compose.yml` - Main Docker Compose file (if using locally)

### Documentation (Keep these)

- `docs/architecture/` - Your architecture decisions
- `SECURITY.md` - Security documentation
- `README.md` - Project documentation

### Scripts

- `scripts/docker-entrypoint-fixed.sh` - Your working entrypoint script
- `scripts/run-migrations-simple.js` - Migration runner

## Files to REMOVE (No longer needed):

### Vercel-specific (since you moved to Coolify)

- `vercel.json` - Only for Vercel deployments
- `.vercelignore` - Only for Vercel

### Temporary/Debug Files

- `coolify-labels.txt` - Was just for reference
- `COOLIFY_FIX.md` - Temporary fix guide
- `COOLIFY_DEPLOYMENT_FIX.md` - Temporary fix guide
- `docker-entrypoint.sh` - Old version (using docker-entrypoint-fixed.sh now)
- `docker-compose.coolify-simple.yml` - Test file
- `docker-compose.coolify.yml` - Test file
- `coolify.json` - Not needed
- `coolify-alternative.json` - Not needed

### Old Documentation (Can be removed or archived)

- `docs/COOLIFY_TROUBLESHOOTING.md` - Temporary troubleshooting
- `docs/COOLIFY_DATABASE_SETUP.md` - One-time setup guide
- `docs/DATABASE_MIGRATION_GUIDE.md` - If migrations are working

## Cleanup Commands:

```bash
# Remove Vercel files
rm vercel.json .vercelignore

# Remove temporary Coolify files
rm coolify-labels.txt COOLIFY_FIX.md COOLIFY_DEPLOYMENT_FIX.md
rm docker-compose.coolify-simple.yml docker-compose.coolify.yml
rm coolify.json coolify-alternative.json
rm docker-entrypoint.sh

# Remove old docs (or move to an archive folder)
rm docs/COOLIFY_TROUBLESHOOTING.md
rm docs/COOLIFY_DATABASE_SETUP.md

# Commit the cleanup
git add -A
git commit -m "chore: remove obsolete deployment and configuration files

- Remove Vercel-specific configuration
- Clean up temporary Coolify troubleshooting files
- Remove duplicate docker-compose variants
- Keep only essential deployment files"
git push
```

## Files to UPDATE:

1. **CLAUDE.md** - Remove references to Vercel, update with Coolify info
2. **README.md** - Update deployment instructions for Coolify
3. **.env.example** - Ensure it has all required env vars for Coolify
