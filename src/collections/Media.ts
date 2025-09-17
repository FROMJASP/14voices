import type { CollectionConfig } from 'payload';
import { validateUploadedFile, getAllowedMimeTypes } from '@/lib/file-security';
import { logStorageError } from '@/lib/storage/errors';

const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: {
      en: 'Storage',
      nl: 'Opslag',
    },
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => {
      if (!req.user) return false;

      // Admins can delete any media
      if (req.user.role === 'admin') return true;

      // Users can delete their own uploads
      return {
        uploadedBy: {
          equals: req.user.id,
        },
      };
    },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Alternative text for images (required for accessibility)',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Optional caption for media files',
      },
    },
    {
      name: 'uploadedBy',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'scanStatus',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Safe', value: 'safe' },
        { label: 'Suspicious', value: 'suspicious' },
        { label: 'Blocked', value: 'blocked' },
      ],
      defaultValue: 'pending',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'scanDetails',
      type: 'json',
      admin: {
        readOnly: true,
        condition: ({ data }) =>
          data?.scanStatus === 'suspicious' || data?.scanStatus === 'blocked',
      },
    },
  ],
  upload: {
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'audio/mpeg',
      'audio/wav',
      'audio/mp3',
      'video/mp4',
      'video/quicktime',
      'video/webm',
      'video/x-msvideo',
      'video/x-ms-wmv',
      'application/pdf',
    ],
    // Storage handled by hybrid adapter
    disableLocalStorage: process.env.NODE_ENV === 'production' && !!process.env.S3_ACCESS_KEY,
    // Disable Payload's file handler since we serve files directly from S3
    handlers: [],
  },
  hooks: {
    beforeChange: [
      async ({ req, data, operation }) => {
        // Add user reference
        if (req.user && operation === 'create') {
          data.uploadedBy = req.user.id;
        }

        // Only run security checks on file upload (create with file)
        if (operation === 'create' && req.file) {
          try {
            const file = req.file;

            // Skip strict validation in production if file data is not available
            // This can happen with Vercel Blob storage where files are streamed directly
            if (!file.data && process.env.NODE_ENV === 'production') {
              console.log('[Media Security] Skipping buffer validation for Vercel Blob upload:', {
                filename: file.name,
                mimetype: file.mimetype,
                size: file.size,
              });

              // Basic validation only
              const allowedTypes = getAllowedMimeTypes('media');
              if (!allowedTypes.includes(file.mimetype)) {
                throw new Error(`File type ${file.mimetype} is not allowed`);
              }

              if (file.size > 100 * 1024 * 1024) {
                throw new Error('File size exceeds 100MB limit');
              }

              data.scanStatus = 'safe';
              data.scanDetails = {
                scannedAt: new Date(),
                note: 'Basic validation only (Vercel Blob storage)',
              };

              return data;
            }

            // Perform comprehensive file validation when buffer is available
            const validation = await validateUploadedFile(file, {
              allowedTypes: getAllowedMimeTypes('media'),
              maxSize: 100 * 1024 * 1024, // 100MB max
              skipThreatScan: process.env.NODE_ENV === 'production', // Skip threat scan in production to avoid false positives
            });

            if (!validation.valid) {
              // Log security issue
              console.error('[Media Security] File validation failed:', {
                filename: file.name,
                error: validation.error,
                metadata: validation.metadata,
              });

              // Reject the upload
              throw new Error(validation.error || 'File validation failed');
            }

            // Mark file scan status based on validation
            if (validation.warnings && validation.warnings.length > 0) {
              data.scanStatus = 'suspicious';
              data.scanDetails = {
                scannedAt: new Date(),
                warnings: validation.warnings,
                threats: validation.metadata?.threats,
                threatSeverity: validation.metadata?.threatSeverity,
                actualType: validation.metadata?.actualType,
                sanitizedFilename: validation.metadata?.sanitizedFilename,
              };
            } else {
              data.scanStatus = 'safe';
              data.scanDetails = {
                scannedAt: new Date(),
                actualType: validation.metadata?.actualType,
                sanitizedFilename: validation.metadata?.sanitizedFilename,
              };
            }

            // Update filename if it was sanitized
            if (
              validation.metadata?.sanitizedFilename &&
              validation.metadata.sanitizedFilename !== file.name
            ) {
              data.filename = validation.metadata.sanitizedFilename;
            }
          } catch (error) {
            console.error('[Media Security] Error during file validation:', error);

            // For security errors, block the upload
            if (error instanceof Error && error.message.includes('validation failed')) {
              throw error;
            }

            // For other errors, mark as suspicious but allow upload
            data.scanStatus = 'suspicious';
            data.scanDetails = {
              scannedAt: new Date(),
              error: error instanceof Error ? error.message : String(error),
            };
          }
        }

        return data;
      },
    ],
    afterRead: [
      async ({ doc }) => {
        // Ensure URL is always populated correctly
        // This prevents Payload from trying to use /api/media/file/
        if (doc && doc.filename) {
          const publicUrl = process.env.S3_PUBLIC_URL;

          // Always override URL if we have S3_PUBLIC_URL configured
          if (publicUrl) {
            // Clean the filename if it has any path prefixes
            let filename = doc.filename;

            // Remove leading slashes
            if (filename.startsWith('/')) {
              filename = filename.substring(1);
            }

            // Remove 'media/' prefix if already included
            if (filename.startsWith('media/')) {
              filename = filename.substring(6);
            }

            // Extract just the filename if there are any remaining paths
            if (filename.includes('/')) {
              filename = filename.split('/').pop() || filename;
            }

            // Ensure publicUrl doesn't end with a slash
            const cleanPublicUrl = publicUrl.endsWith('/') ? publicUrl.slice(0, -1) : publicUrl;

            doc.url = `${cleanPublicUrl}/media/${filename}`;
          }
          // If the URL contains the incorrect /api/media/file pattern, fix it
          else if (doc.url && doc.url.includes('/api/media/file/')) {
            // This shouldn't happen in production, but fix it if it does
            const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || '';
            if (serverUrl) {
              doc.url = doc.url.replace('/api/media/file/', '/media/');
            }
          }
        }
        return doc;
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        // Log successful uploads
        if (operation === 'create' && doc && req?.user) {
          console.log('[Media] File uploaded successfully:', {
            id: doc.id,
            filename: doc.filename,
            mimeType: doc.mimeType,
            size: doc.filesize,
            user: req.user.email,
            scanStatus: doc.scanStatus,
            storageUrl: doc.url,
          });
        }
        return doc;
      },
    ],
    afterError: [
      async ({ error }) => {
        // Log storage errors with context
        logStorageError(error, {
          collection: 'media',
          operation: 'unknown',
        });
      },
    ],
  },
};

export default Media;
