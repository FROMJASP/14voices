#!/bin/bash
# Cleanup redundant files from 14voices project

echo "🧹 Starting project cleanup..."
echo "=============================="

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Files to remove
FILES_TO_REMOVE=(
    # Redundant markdown files
    "COOLIFY_FIX.md"
    "COOLIFY_DEPLOYMENT_FIX.md"
    "CLEANUP_GUIDE.md"
    "ERROR_HANDLING_GUIDE.md"
    
    # Redundant documentation
    "docs/COOLIFY_TROUBLESHOOTING.md"
    "docs/COOLIFY_DATABASE_SETUP.md"
    "docs/DATABASE_MIGRATION_GUIDE.md"
    "docs/DATABASE_MIGRATION_FIX.md"
    "docs/DEPLOYMENT_TROUBLESHOOTING.md"
    "docs/dev-notes.md"
    "docs/rate-limiting.md"
    
    # Old migration scripts (keeping only essential ones)
    "scripts/fix-all-locales-tables.js"
    "scripts/fix-production-database.js"
    "scripts/fix-voiceover-upload-columns.js"
    "scripts/fix-voiceovers-locales.js"
    "scripts/fix-voiceovers-table-final.js"
    "scripts/quick-production-fix.js"
    "scripts/complete-schema-migration.js"
    "scripts/check-database-schema.js"
    
    # Old SQL files
    "apply-indexes.sql"
    "neon-schema.sql"
)

echo -e "${YELLOW}The following files will be removed:${NC}"
for file in "${FILES_TO_REMOVE[@]}"; do
    if [ -f "$file" ]; then
        echo "  - $file"
    fi
done

echo -e "\n${RED}⚠️  WARNING: This action cannot be undone!${NC}"
echo -n "Continue with cleanup? (y/N): "
read -r response

if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "Cleanup cancelled."
    exit 1
fi

echo -e "\n${YELLOW}Removing files...${NC}"

for file in "${FILES_TO_REMOVE[@]}"; do
    if [ -f "$file" ]; then
        rm "$file"
        echo -e "${GREEN}✅ Removed: $file${NC}"
    fi
done

echo -e "\n${YELLOW}Creating consolidated documentation...${NC}"

# Create a single deployment guide
cat > "DEPLOYMENT.md" << 'EOF'
# 14voices Deployment Guide

## Self-Hosted Deployment with Coolify

### Prerequisites
- Coolify instance
- PostgreSQL database
- MinIO (S3-compatible storage)
- Domain with SSL

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Payload CMS
PAYLOAD_SECRET=<32+ character secret>
NEXT_PUBLIC_SERVER_URL=https://yourdomain.com

# Email
RESEND_API_KEY=re_xxxxxxxxxxxx

# Storage (MinIO/S3)
S3_ENDPOINT=http://minio:9000
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
S3_BUCKET=14voices
S3_REGION=us-east-1

# Security
CSRF_SECRET=<generate-strong-secret>

# Redis (optional)
REDIS_URL=redis://redis:6379
```

### Migration from Neon

1. Export your Neon database URL:
   ```bash
   export NEON_DATABASE_URL="your-neon-url"
   export DATABASE_URL="your-self-hosted-url"
   ```

2. Run the migration script:
   ```bash
   ./scripts/migrate-from-neon.sh
   ```

3. Update your .env.local file to use the self-hosted DATABASE_URL

4. Deploy to Coolify and restart the application

### Payload CMS Migrations

The application uses Payload's built-in migration system. Migrations run automatically on deployment.

To create a new migration:
```bash
npx payload migrate:create --name your_migration_name
```

### Troubleshooting

If tables are missing, run:
```bash
npx payload migrate
```

This will create all necessary tables based on your collection definitions.
EOF

echo -e "${GREEN}✅ Created DEPLOYMENT.md${NC}"

echo -e "\n${GREEN}🎉 Cleanup completed!${NC}"
echo "======================"
echo -e "${YELLOW}Summary:${NC}"
echo "- Removed redundant documentation files"
echo "- Removed old migration scripts"
echo "- Created consolidated DEPLOYMENT.md"
echo ""
echo -e "${YELLOW}Keep these essential files:${NC}"
echo "- scripts/migrate-from-neon.sh (for migration)"
echo "- scripts/docker-entrypoint-clean.sh (for Docker)"
echo "- scripts/payload-migrate.js (backup migration)"
echo "- CLAUDE.md (AI instructions)"
echo "- README.md (project documentation)"
echo "- DEPLOYMENT.md (deployment guide)"