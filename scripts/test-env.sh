#!/bin/sh
echo "=== Environment Variable Test ==="
echo "DATABASE_URL is set: ${DATABASE_URL:+yes}"
echo "DATABASE_URL length: $(echo -n "$DATABASE_URL" | wc -c)"
echo "First 50 chars: $(echo "$DATABASE_URL" | cut -c1-50)..."
echo "=== End Test ==="