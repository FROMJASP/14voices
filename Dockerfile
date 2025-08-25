# Stage 1: Dependencies
FROM oven/bun:1.1.38-alpine AS deps
WORKDIR /app

# Copy package files and scripts needed for postinstall
COPY package.json bun.lockb ./
COPY scripts ./scripts

# Install dependencies
RUN bun install --frozen-lockfile

# Stage 2: Builder
FROM oven/bun:1.1.38-alpine AS builder
WORKDIR /app

# CRITICAL FIX: Handle Coolify's environment variable approach
# Coolify may not pass build args properly, so we need to handle both cases
ARG NEXT_PUBLIC_SERVER_URL
ARG COOLIFY_URL
ARG COOLIFY_FQDN

# If NEXT_PUBLIC_SERVER_URL is not provided as build arg, try to use COOLIFY_URL or COOLIFY_FQDN
# This handles Coolify's dynamic URL assignment
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL:-${COOLIFY_URL:-${COOLIFY_FQDN:-http://localhost:3000}}}

# Debug build environment
RUN echo "=== BUILD ENVIRONMENT DEBUG ===" && \
    echo "NEXT_PUBLIC_SERVER_URL ARG: '${NEXT_PUBLIC_SERVER_URL}'" && \
    echo "COOLIFY_URL ARG: '${COOLIFY_URL}'" && \
    echo "COOLIFY_FQDN ARG: '${COOLIFY_FQDN}'" && \
    echo "Final NEXT_PUBLIC_SERVER_URL: '${NEXT_PUBLIC_SERVER_URL}'" && \
    echo "==================================="

# Install Node.js 20 for Payload CLI compatibility
RUN apk add --no-cache nodejs=~20 npm

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source files first (excluding node_modules via .dockerignore)
COPY . .

# Ensure directory structure exists
RUN mkdir -p "src/app/(payload)/admin"

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV CSRF_SECRET=dummy-csrf-secret-for-build

# Skip separate import map generation - it's now included in the build script

# Install platform-specific sharp binary for Alpine
RUN npm install --os=linux --cpu=x64 sharp --force

# Build the application using Docker-optimized build process
# Use the actual NEXT_PUBLIC_SERVER_URL from build args
RUN DATABASE_URL=postgresql://fake:fake@fake:5432/fake \
    PAYLOAD_SECRET=dummy-secret-for-build \
    CSRF_SECRET=dummy-csrf-secret-for-build \
    RESEND_API_KEY=re_dummy_build_key \
    node scripts/validate-test-dependencies.js && \
    DATABASE_URL=postgresql://fake:fake@fake:5432/fake \
    PAYLOAD_SECRET=dummy-secret-for-build \
    CSRF_SECRET=dummy-csrf-secret-for-build \
    RESEND_API_KEY=re_dummy_build_key \
    bun run build

# Stage 3: Runner
FROM oven/bun:1.1.38-alpine AS runner
WORKDIR /app

# Install runtime dependencies
# Install Node.js for better compatibility with Next.js standalone server
# Install npm for running migration scripts that use npx
# Install both wget and curl for maximum compatibility with different health check systems
# Install PostgreSQL client for database connectivity check
RUN apk add --no-cache tini nodejs=~20 npm wget curl postgresql-client

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy node_modules for Payload CLI (needed for migrations)
COPY --from=builder /app/node_modules ./node_modules

# Copy configuration files needed for Payload CLI
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/src/payload.config.ts ./src/payload.config.ts
COPY --from=builder /app/package.json ./package.json

# Copy only essential scripts
COPY --from=builder /app/scripts/direct-db-init.js ./scripts/direct-db-init.js
COPY --from=builder /app/scripts/generate-importmap.js ./scripts/generate-importmap.js
COPY --from=builder /app/scripts/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
# Also copy the entire src directory for TypeScript imports and migrations
COPY --from=builder /app/src ./src
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Create upload directories with correct permissions
RUN mkdir -p public/uploads/media public/uploads/scripts public/uploads/invoices

# Give ownership of the entire app directory to nextjs user
RUN chown -R nextjs:nodejs /app

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# Workaround for undici CacheStorage error
ENV NODE_OPTIONS="--no-experimental-global-webcrypto"

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Use tini to handle signals properly
ENTRYPOINT ["/sbin/tini", "--", "/usr/local/bin/docker-entrypoint.sh"]

# Start the application using Node.js for better compatibility
CMD ["node", "server.js"]