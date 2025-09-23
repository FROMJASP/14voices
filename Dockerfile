# Build stage
FROM oven/bun:1-alpine AS builder

# Install dependencies for native modules and git
RUN apk add --no-cache libc6-compat python3 make g++ git

WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies using bun
RUN bun install --frozen-lockfile

# Copy application code
COPY . .

# Build the application
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
# Use fake database URL for build time (as per CLAUDE.md)
ENV DATABASE_URL="postgresql://fake:fake@fake:5432/fake"

# Generate Payload types and importMap before building (CRITICAL as per CLAUDE.md)
RUN bun run payload:generate:types || true
RUN bun run payload:generate:importmap

# Build Next.js application
RUN bun run build

# Production stage
FROM node:20-alpine AS runner

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy Payload admin files (REQUIRED - importMap.js must be committed as per CLAUDE.md)
COPY --from=builder /app/src/app/(payload)/admin/importMap.js ./src/app/(payload)/admin/importMap.js

# Create uploads directory for local media (if not using S3)
RUN mkdir -p ./public/media && chown -R nextjs:nodejs ./public/media

# Set correct permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]