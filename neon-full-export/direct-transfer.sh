#!/bin/bash
# Direct transfer from Neon to self-hosted database
# This uses pipe to minimize intermediate storage

NEON_DB="postgres://neondb_owner:npg_qZ2OGKbv1tMC@ep-spring-sun-a2r5782c-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"
TARGET_DB="$1"

if [ -z "$TARGET_DB" ]; then
  echo "Usage: ./direct-transfer.sh <TARGET_DATABASE_URL>"
  exit 1
fi

echo "🚀 Starting direct database transfer..."
echo "⚠️  This will use network transfer - watch for limits!"

# Method 1: Using pg_dump | psql pipe
echo "📤 Transferring schema and data..."
pg_dump "$NEON_DB" --no-owner --no-privileges | psql "$TARGET_DB"

# Method 2: Table by table (if above fails)
# TABLES=(pages pages_blocks voiceovers productions)
# for table in "${TABLES[@]}"; do
#   echo "📤 Transferring $table..."
#   pg_dump "$NEON_DB" --table="$table" --no-owner | psql "$TARGET_DB"
# done

echo "✅ Transfer complete!"
