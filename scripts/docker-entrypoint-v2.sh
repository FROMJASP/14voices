#!/bin/sh
set -e

# Color codes for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

log() {
  echo "${2:-$BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

log_section() {
  echo "\n${CYAN}============================================================${NC}"
  echo "${CYAN}  $1${NC}"
  echo "${CYAN}============================================================${NC}\n"
}

# Function to wait for database with exponential backoff
wait_for_database() {
  log_section "WAITING FOR DATABASE"
  
  max_attempts=30
  attempt=1
  base_delay=2
  
  while [ $attempt -le $max_attempts ]; do
    if pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" >/dev/null 2>&1; then
      log "Database is ready!" "$GREEN"
      return 0
    fi
    
    # Calculate delay with exponential backoff (max 60 seconds)
    delay=$((base_delay ** attempt))
    if [ $delay -gt 60 ]; then
      delay=60
    fi
    
    log "Database not ready (attempt $attempt/$max_attempts). Waiting ${delay}s..." "$YELLOW"
    sleep $delay
    attempt=$((attempt + 1))
  done
  
  log "Database connection failed after $max_attempts attempts" "$RED"
  return 1
}

# Main execution
main() {
  log_section "14VOICES DOCKER ENTRYPOINT"
  
  # Parse DATABASE_URL if not already parsed
  if [ -z "$DB_HOST" ] && [ -n "$DATABASE_URL" ]; then
    # Extract components from DATABASE_URL
    DB_USER=$(echo "$DATABASE_URL" | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
    DB_PASS=$(echo "$DATABASE_URL" | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
    DB_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:\/]*\).*/\1/p')
    DB_PORT=$(echo "$DATABASE_URL" | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
    DB_NAME=$(echo "$DATABASE_URL" | sed -n 's/.*\/\([^?]*\).*/\1/p')
    
    # Default port if not specified
    if [ -z "$DB_PORT" ]; then
      DB_PORT=5432
    fi
    
    export DB_USER DB_PASS DB_HOST DB_PORT DB_NAME
    log "Database configuration parsed from DATABASE_URL" "$GREEN"
  fi
  
  # Wait for database
  if ! wait_for_database; then
    log "Exiting due to database connection failure" "$RED"
    exit 1
  fi
  
  # Run Payload migrations (the ONLY migration system we use)
  log_section "RUNNING PAYLOAD MIGRATIONS"
  
  if node scripts/payload-migration-runner.js; then
    log "Payload migrations completed successfully" "$GREEN"
  else
    log "Payload migrations failed" "$RED"
    exit 1
  fi
  
  # Generate import map if needed (should already be done during build)
  if [ ! -f "dist/importMap.js" ]; then
    log_section "GENERATING IMPORT MAP"
    if bun run payload generate:importmap; then
      log "Import map generated successfully" "$GREEN"
    else
      log "Import map generation failed" "$YELLOW"
      # Non-fatal, continue
    fi
  else
    log "Import map already exists" "$GREEN"
  fi
  
  # Start the application
  log_section "STARTING APPLICATION"
  log "Starting Next.js application on port ${PORT:-3000}" "$CYAN"
  
  # Execute the main application
  exec "$@"
}

# Run main function
main "$@"