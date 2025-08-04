import { z } from 'zod';

/**
 * Environment variable schema for runtime validation
 */
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url().optional(),
  POSTGRES_URL: z.string().url().optional(),
  
  // Required secrets
  PAYLOAD_SECRET: z.string().min(32, 'PAYLOAD_SECRET must be at least 32 characters'),
  
  // API Keys
  RESEND_API_KEY: z.string().regex(/^re_[a-zA-Z0-9]+$/, 'Invalid Resend API key format'),
  BLOB_READ_WRITE_TOKEN: z.string().regex(/^vercel_blob_rw_[a-zA-Z0-9]+$/, 'Invalid Vercel Blob token format').optional(),
  
  // Webhooks
  RESEND_WEBHOOK_SECRET: z.string().min(16, 'Webhook secret must be at least 16 characters').optional(),
  STRIPE_WEBHOOK_SECRET: z.string().regex(/^whsec_[a-zA-Z0-9]+$/, 'Invalid Stripe webhook secret format').optional(),
  
  // URLs
  NEXT_PUBLIC_SERVER_URL: z.string().url(),
  
  // Environment
  NODE_ENV: z.enum(['development', 'test', 'production']),
  
  // Optional monitoring
  SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
}).refine(
  (data) => data.DATABASE_URL || data.POSTGRES_URL,
  'Either DATABASE_URL or POSTGRES_URL must be provided'
);

/**
 * Validate environment variables at startup
 */
export function validateEnv() {
  try {
    const env = envSchema.parse(process.env);
    
    // Additional security checks
    if (env.NODE_ENV === 'production') {
      if (!env.RESEND_WEBHOOK_SECRET) {
        console.warn('[SECURITY] RESEND_WEBHOOK_SECRET not set in production');
      }
      
      if (env.PAYLOAD_SECRET.length < 64) {
        console.warn('[SECURITY] PAYLOAD_SECRET should be at least 64 characters in production');
      }
      
      // Check for default/weak values
      const weakSecrets = ['secret', 'password', 'changeme', 'default'];
      if (weakSecrets.some(weak => env.PAYLOAD_SECRET.toLowerCase().includes(weak))) {
        throw new Error('PAYLOAD_SECRET contains weak/default value');
      }
    }
    
    return env;
  } catch (error) {
    console.error('Environment validation failed:', error);
    
    if (process.env.NODE_ENV === 'production') {
      // Don't start the app with invalid env in production
      process.exit(1);
    }
    
    throw error;
  }
}

// Export typed environment
export const env = validateEnv();