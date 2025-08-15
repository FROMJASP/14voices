/**
 * Environment variable validation
 * Ensures all required environment variables are present and valid
 */

import { z } from 'zod';

const envSchema = z
  .object({
    // Database
    DATABASE_URL: z.string().url().optional(),
    POSTGRES_URL: z.string().url().optional(),

    // Payload CMS
    PAYLOAD_SECRET: z.string().min(32, 'PAYLOAD_SECRET must be at least 32 characters'),
    NEXT_PUBLIC_SERVER_URL: z.string().url('NEXT_PUBLIC_SERVER_URL must be a valid URL'),

    // Security
    CSRF_SECRET: z.string().min(32, 'CSRF_SECRET must be at least 32 characters').optional(),

    // Email
    RESEND_API_KEY: z.string().startsWith('re_', 'RESEND_API_KEY must start with re_'),

    // Storage (MinIO/S3) - Optional
    S3_ENDPOINT: z.string().url().optional(),
    S3_ACCESS_KEY: z.string().min(3).optional(),
    S3_SECRET_KEY: z.string().min(8).optional(),
    S3_BUCKET: z.string().optional(),
    S3_REGION: z.string().optional(),
    S3_PUBLIC_URL: z.string().url().optional(),

    // Vercel Blob Storage - Optional
    BLOB_READ_WRITE_TOKEN: z.string().optional(),

    // Admin User - Optional for seeding
    ADMIN_EMAIL: z.string().email().optional(),
    ADMIN_PASSWORD: z.string().min(8).optional(),

    // Stripe - Optional
    STRIPE_SECRET_KEY: z.string().startsWith('sk_').optional(),
    STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_').optional(),

    // Sentry - Optional
    NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
    SENTRY_ORG: z.string().optional(),
    SENTRY_PROJECT: z.string().optional(),
    SENTRY_AUTH_TOKEN: z.string().optional(),

    // Redis - Optional
    REDIS_URL: z.string().url().optional(),

    // Node Environment
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  })
  .refine(
    (data) => data.DATABASE_URL || data.POSTGRES_URL,
    'Either DATABASE_URL or POSTGRES_URL must be provided'
  )
  .refine((data) => {
    // If CSRF_SECRET is not provided, PAYLOAD_SECRET will be used as fallback
    if (!data.CSRF_SECRET && data.NODE_ENV === 'production') {
      console.warn('[SECURITY] Using dedicated CSRF_SECRET is recommended in production');
    }
    return true;
  })
  .refine((data) => {
    // Validate MinIO configuration if any S3 variable is set
    const s3Vars = [data.S3_ENDPOINT, data.S3_ACCESS_KEY, data.S3_SECRET_KEY, data.S3_BUCKET];
    const s3VarsSet = s3Vars.filter(Boolean).length;

    if (s3VarsSet > 0 && s3VarsSet < 4) {
      return false;
    }
    return true;
  }, 'If using MinIO/S3, all of S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY, and S3_BUCKET must be provided');

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | undefined;

export function validateEnv(): Env {
  if (cachedEnv) {
    return cachedEnv;
  }

  try {
    cachedEnv = envSchema.parse(process.env);
    return cachedEnv;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((err) => `  - ${err.path.join('.')}: ${err.message}`)
        .join('\n');

      console.error('❌ Environment validation failed:\n' + missingVars);
      console.error('\n📋 Please check your .env file and ensure all required variables are set.');
      console.error('   See .env.example for reference.\n');

      // In development, provide more helpful error messages
      if (process.env.NODE_ENV === 'development') {
        console.error('💡 Tip: Copy .env.example to .env.local and fill in the values');
      }

      throw new Error('Environment validation failed');
    }
    throw error;
  }
}

/**
 * Get validated environment variables
 * Use this instead of process.env to ensure type safety
 */
export function getEnv(): Env {
  return validateEnv();
}

/**
 * Check if a feature is enabled based on environment variables
 */
export function isFeatureEnabled(feature: 'minio' | 'redis' | 'sentry' | 'stripe'): boolean {
  const env = getEnv();

  switch (feature) {
    case 'minio':
      return !!(env.S3_ACCESS_KEY && env.S3_SECRET_KEY);
    case 'redis':
      return !!env.REDIS_URL;
    case 'sentry':
      return !!env.NEXT_PUBLIC_SENTRY_DSN;
    case 'stripe':
      return !!env.STRIPE_SECRET_KEY;
    default:
      return false;
  }
}
