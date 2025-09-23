# Build stage
FROM node:20-alpine AS builder

# Install dependencies for native modules
RUN apk add --no-cache python3 make g++ git libc6-compat

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* bun.lockb* ./

# Install dependencies with npm (more compatible for Docker builds)
RUN npm ci || npm install

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
ENV TAILWIND_DISABLE_TOUCH=1
ENV FORCE_COLOR=0

# Skip Payload importMap generation - it should be committed
# If it's missing, create a minimal one
RUN if [ ! -f "src/app/(payload)/admin/importMap.js" ]; then \
    mkdir -p src/app/\(payload\)/admin && \
    echo "export const importMap = {};" > src/app/\(payload\)/admin/importMap.js; \
  fi

# Build Next.js application
RUN npm run build

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

# Copy Payload admin importMap
COPY --from=builder /app/src/app/(payload)/admin/importMap.js ./src/app/(payload)/admin/importMap.js || true

# Create uploads directory
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