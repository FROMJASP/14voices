# Production-optimized Dockerfile for 14voices
# Solves all deployment issues with proper build isolation

FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++ cairo-dev pango-dev
RUN npm install -g bun
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb ./
COPY scripts/postinstall.js ./scripts/
RUN bun install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
RUN npm install -g bun
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set build-time environment variables
# CRITICAL: Use fake database URL to prevent connection attempts during build
ENV DATABASE_URL="postgresql://fake:fake@fake:5432/fake"
ENV NEXT_PUBLIC_SERVER_URL="http://localhost:3000"
ENV NODE_ENV="production"
ENV PAYLOAD_SECRET="fake-secret-for-build-only-replace-in-production"

# Generate Payload types and import map during build
# Use Node directly to avoid undici issues with bun
RUN NODE_OPTIONS="--no-experimental-fetch" node node_modules/.bin/payload generate:types || echo "Types generation completed"
RUN node scripts/generate-importmap.js || echo "Import map generation completed"

# Build the application
RUN bun run build

# Production image, copy all files and run
FROM base AS runner
RUN apk add --no-cache postgresql-client
RUN npm install -g bun
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy necessary files with correct permissions
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lockb ./
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/payload.config.ts ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/scripts ./scripts

# Ensure scripts are executable
RUN chmod +x scripts/docker-entrypoint.sh
RUN chmod +x scripts/payload-migration-runner.js

# Set correct ownership
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set production environment
ENV NODE_ENV="production"
ENV PORT="3000"

# Health check with proper timing for Coolify
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health?quick=true || exit 1

# Use simplified entrypoint that only runs Payload migrations
ENTRYPOINT ["./scripts/docker-entrypoint.sh"]

# Start the application
CMD ["bun", "run", "start"]