import { s3Storage } from '@payloadcms/storage-s3';
import type { Plugin } from 'payload';

interface MinIOConfig {
  collections: Record<string, boolean | { prefix?: string }>;
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  region?: string;
  useSSL?: boolean;
  publicUrl?: string;
  // Performance optimizations
  maxRetries?: number;
  requestTimeout?: number;
  enableMultipartUploads?: boolean;
  partSize?: number;
}

export const minioStorage = (config: MinIOConfig): Plugin => {
  const {
    endpoint,
    accessKeyId,
    secretAccessKey,
    bucketName,
    region = 'us-east-1',
    useSSL = false,
    publicUrl,
    collections,
  } = config;

  // Parse endpoint to ensure proper format
  let formattedEndpoint = endpoint;
  if (!endpoint.startsWith('http://') && !endpoint.startsWith('https://')) {
    formattedEndpoint = useSSL ? `https://${endpoint}` : `http://${endpoint}`;
  }

  // Remove trailing slash if present
  formattedEndpoint = formattedEndpoint.replace(/\/$/, '');

  // Log configuration in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[MinIO] Configuration:', {
      endpoint: formattedEndpoint,
      bucket: bucketName,
      region,
      publicUrl: publicUrl || 'Not configured',
    });
  }

  return s3Storage({
    collections,
    config: {
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      region, // MinIO requires a region even though it's not used
      endpoint: formattedEndpoint,
      forcePathStyle: true, // Required for MinIO
      // Note: Some AWS SDK v3 options may not be supported by Payload's S3 adapter
      // Keep configuration minimal for compatibility
    },
    bucket: bucketName,
    // If public URL is provided, use it for serving files
    ...(publicUrl && {
      generateFileURL: (args: any) => {
        const { filename, prefix = '' } = args;
        const path = prefix ? `${prefix}/${filename}` : filename;
        // For MinIO, we typically use the endpoint URL for public access
        const baseUrl = publicUrl || formattedEndpoint;
        return `${baseUrl}/${bucketName}/${path}`;
      },
    }),
  });
};

// Error handler wrapper for MinIO storage
export const wrappedMinioStorage = (config: {
  collections: Record<string, boolean>;
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  region?: string;
  useSSL?: boolean;
  publicUrl?: string;
}): Plugin => {
  try {
    // Log configuration for debugging (mask sensitive data)
    console.log('[MinIO Storage] Initializing with config:', {
      endpoint: config.endpoint,
      bucket: config.bucketName,
      region: config.region || 'us-east-1',
      publicUrl: config.publicUrl || 'Not set',
      hasAccessKey: !!config.accessKeyId && config.accessKeyId.length > 0,
      hasSecretKey: !!config.secretAccessKey && config.secretAccessKey.length > 0,
      accessKeyLength: config.accessKeyId?.length || 0,
      collections: Object.keys(config.collections),
    });

    return minioStorage(config);
  } catch (error) {
    console.error('Failed to initialize MinIO storage:', error);
    throw error;
  }
};
