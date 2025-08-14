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
    return minioStorage(config);
  } catch (error) {
    console.error('Failed to initialize MinIO storage:', error);
    throw error;
  }
};
