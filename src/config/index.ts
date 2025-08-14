export * from './constants';

// Re-export environment config
export const config = {
  // Database
  database: {
    url: process.env.DATABASE_URL!,
  },

  // Payload CMS
  payload: {
    secret: process.env.PAYLOAD_SECRET!,
    url: process.env.PAYLOAD_URL || process.env.NEXT_PUBLIC_APP_URL!,
  },

  // Storage
  storage: {
    s3: {
      endpoint: process.env.S3_ENDPOINT,
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
      bucketName: process.env.S3_BUCKET,
      region: process.env.S3_REGION,
      publicUrl: process.env.S3_PUBLIC_URL,
    },
  },

  // Email
  email: {
    resend: {
      apiKey: process.env.RESEND_API_KEY!,
    },
  },

  // Redis
  redis: {
    url: process.env.REDIS_URL,
  },

  // Monitoring
  monitoring: {
    sentry: {
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    },
    otel: {
      endpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
    },
  },

  // Auth
  auth: {
    jwtSecret: process.env.JWT_SECRET || process.env.PAYLOAD_SECRET!,
  },

  // App
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    env: process.env.NODE_ENV || 'development',
    isDev: process.env.NODE_ENV === 'development',
    isProd: process.env.NODE_ENV === 'production',
  },
};
