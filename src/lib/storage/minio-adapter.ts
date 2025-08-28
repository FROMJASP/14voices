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
  port?: number;
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
    port,
  } = config;

  // Parse endpoint to ensure proper format
  let formattedEndpoint = endpoint;

  // Handle URL parsing more robustly
  try {
    const url = new URL(endpoint);
    // If a specific port is provided in config, use it
    if (port) {
      url.port = String(port);
    }
    formattedEndpoint = url.toString();
  } catch {
    // If endpoint is not a valid URL, construct it
    if (!endpoint.startsWith('http://') && !endpoint.startsWith('https://')) {
      const protocol = useSSL ? 'https://' : 'http://';
      // Add port if specified
      const portSuffix = port ? `:${port}` : '';
      formattedEndpoint = `${protocol}${endpoint}${portSuffix}`;
    } else if (port) {
      // If endpoint has protocol but we need to add/change port
      const url = new URL(endpoint);
      url.port = String(port);
      formattedEndpoint = url.toString();
    }
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
  port?: number;
}): Plugin => {
  try {
    return minioStorage(config);
  } catch (error) {
    console.error('Failed to initialize MinIO storage:', error);
    throw error;
  }
};
