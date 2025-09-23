# Build stage
FROM node:20-alpine AS builder

# Install dependencies for native modules
RUN apk add --no-cache python3 make g++ git libc6-compat

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.14.4 --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Copy only the postinstall script to prevent pnpm install from failing
COPY scripts/postinstall.js scripts/

# Skip postinstall during dependency installation
ENV SKIP_POSTINSTALL=true

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

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

# Set build environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Convert build args to environment variables
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
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN
ENV SENTRY_ORG=$SENTRY_ORG
ENV SENTRY_PROJECT=$SENTRY_PROJECT
ENV NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN
ENV RESEND_API_KEY=$RESEND_API_KEY

# Disable experimental features
ENV NEXT_EXPERIMENTAL_COMPILE=false
ENV FORCE_COLOR=0

# Ensure importMap.js exists (should be committed as per CLAUDE.md)
# But we'll create an empty one if missing as a fallback
RUN if [ ! -f "src/app/(payload)/admin/importMap.js" ]; then \
    mkdir -p src/app/\(payload\)/admin && \
    echo "export const importMap = {};" > src/app/\(payload\)/admin/importMap.js; \
  fi

# Build Next.js application
RUN pnpm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy the standalone build from builder
# The standalone folder contains a minimal Node.js server
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Copy static files
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy public folder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy Payload admin files if they exist in the standalone build
# The standalone build should include necessary files, but we ensure the directory exists
RUN mkdir -p ./src/app/\(payload\)/admin && chown -R nextjs:nodejs ./src

# Create uploads directory
RUN mkdir -p ./public/media && chown -R nextjs:nodejs ./public/media

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the server
CMD ["node", "server.js"]