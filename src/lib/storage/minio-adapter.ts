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
    publicUrl,
    collections,
  } = config;

  // Parse endpoint to ensure proper format
  let formattedEndpoint = endpoint;

  // Remove trailing slash if present
  formattedEndpoint = formattedEndpoint.replace(/\/$/, '');

  // Log configuration
  console.log('[MinIO] Configuration:', {
    endpoint: formattedEndpoint,
    bucket: bucketName,
    region,
    publicUrl: publicUrl || 'Not configured',
  });

  // Warn about potential MinIO console endpoint issue
  if (
    formattedEndpoint.includes('storage.iam-studios.com') &&
    !formattedEndpoint.includes(':9000')
  ) {
    console.warn(
      '[MinIO] WARNING: The endpoint might be pointing to MinIO console instead of API.'
    );
    console.warn(
      '[MinIO] If you see "S3 API Requests must be made to API port" errors, please check:'
    );
    console.warn('[MinIO] 1. Your Coolify MinIO service configuration for the API endpoint');
    console.warn('[MinIO] 2. The API endpoint is typically on port 9000, console on 9001');
    console.warn('[MinIO] 3. Contact your hosting provider for the correct MinIO API endpoint');
  }

  return s3Storage({
    collections,
    config: {
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      region, // MinIO requires a region even though it's not used
      endpoint: formattedEndpoint, // Pass the endpoint as-is, including protocol
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

        // Clean up publicUrl - remove trailing slash
        const cleanPublicUrl = publicUrl.replace(/\/$/, '');

        // For MinIO, use the publicUrl if provided, otherwise use the endpoint
        const baseUrl = cleanPublicUrl || formattedEndpoint;

        // If publicUrl already includes the bucket name, don't add it again
        if (cleanPublicUrl && cleanPublicUrl.includes(bucketName)) {
          return `${baseUrl}/${path}`;
        }
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
    return minioStorage(config);
  } catch (error) {
    console.error('Failed to initialize MinIO storage:', error);
    throw error;
  }
};
