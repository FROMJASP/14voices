# Build stage
FROM oven/bun:1-alpine AS builder

# Install dependencies for native modules and git
RUN apk add --no-cache libc6-compat python3 make g++ git

WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies using bun (skip postinstall since we're in Linux container)
RUN bun install --frozen-lockfile --ignore-scripts

# Copy application code
COPY . .

# Accept all build arguments from Coolify
ARG CSRF_SECRET
ARG DATABASE_URL
ARG NEXT_PUBLIC_SENTRY_DSN
ARG NEXT_PUBLIC_SERVER_URL
ARG PAYLOAD_SECRET
ARG RESEND_API_KEY
ARG S3_ACCESS_KEY
ARG S3_BUCKET
ARG S3_ENDPOINT
ARG S3_PUBLIC_URL
ARG S3_REGION
ARG S3_SECRET_KEY
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_ORG
ARG SENTRY_PROJECT

# Build the application
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Convert build args to environment variables for the build process
ENV DATABASE_URL=$DATABASE_URL
ENV PAYLOAD_SECRET=$PAYLOAD_SECRET
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
ENV CSRF_SECRET=$CSRF_SECRET
ENV S3_ENDPOINT=$S3_ENDPOINT
ENV S3_ACCESS_KEY=$S3_ACCESS_KEY
ENV S3_SECRET_KEY=$S3_SECRET_KEY
ENV S3_BUCKET=$S3_BUCKET
ENV S3_REGION=$S3_REGION
ENV S3_PUBLIC_URL=$S3_PUBLIC_URL

# Skip experimental features during build to avoid issues
ENV NEXT_EXPERIMENTAL_COMPILE=false

# Skip Payload generation - files should already be committed as per CLAUDE.md
# Just build the Next.js application
RUN bun run build

# Production stage
FROM node:20-alpine AS runner

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

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

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]