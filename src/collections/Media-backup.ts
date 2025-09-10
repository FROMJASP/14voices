import type { CollectionConfig } from 'payload';
import {
  validateFileContent,
  sanitizeFilename,
  checkFileSize,
  scanFileForThreats,
} from '@/lib/file-security';
import { logSecurityEvent } from '@/lib/security-monitoring';

const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        condition: (_data, { req }) => {
          if (req?.data?.mimeType) {
            return req.data.mimeType.startsWith('image/');
          }
          return true;
        },
        description: 'Alternative text for images (required for accessibility)',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        condition: (_data, { req }) => {
          if (req?.data?.mimeType) {
            return req.data.mimeType.startsWith('audio/');
          }
          return false;
        },
        description: 'Optional caption for audio files',
      },
    },
    {
      name: 'uploadedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        hidden: true, // Hide from UI since it's automatically set
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
    filesRequiredOnCreate: false,
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
      'application/pdf',
    ],
  },
  hooks: {
    beforeOperation: [
      async ({ args, operation }) => {
        if (operation === 'create' && args.req?.file) {
          const file = args.req.file;
          const user = args.req.user;

          if (!user) {
            throw new Error('Authentication required for file uploads');
          }

          // 1. Check file size limits
          const sizeCheck = checkFileSize(file.size, file.mimetype);
          if (!sizeCheck.valid) {
            await logSecurityEvent({
              type: 'file_threat',
              severity: 'medium',
              userId: String(user.id),
              details: {
                reason: 'File size limit exceeded',
                filename: file.filename,
                size: file.size,
                error: sizeCheck.error,
              },
              timestamp: new Date(),
            });
            throw new Error(sizeCheck.error);
          }

          // 2. Validate file content matches MIME type
          const buffer = Buffer.from(await file.arrayBuffer());
          const contentValidation = await validateFileContent(buffer, file.mimetype);

          if (!contentValidation.valid) {
            await logSecurityEvent({
              type: 'file_threat',
              severity: 'high',
              userId: String(user.id),
              details: {
                reason: 'File content mismatch',
                filename: file.filename,
                declaredType: file.mimetype,
                error: contentValidation.error,
              },
              timestamp: new Date(),
            });
            throw new Error('File type validation failed: ' + contentValidation.error);
          }

          // 3. Scan for threats
          const scanResult = await scanFileForThreats(buffer, file.filename);

          if (!scanResult.safe) {
            await logSecurityEvent({
              type: 'file_threat',
              severity: 'critical',
              userId: String(user.id),
              details: {
                reason: 'Malicious content detected',
                filename: file.filename,
                threats: scanResult.threats,
              },
              timestamp: new Date(),
            });
            throw new Error('Security scan failed: File contains potentially malicious content');
          }

          // 4. Sanitize filename
          const sanitizedFilename = sanitizeFilename(file.filename);
          file.filename = sanitizedFilename;

          // 5. Add user reference
          args.data = {
            ...args.data,
            uploadedBy: user.id,
            scanStatus: 'safe',
            scanDetails: {
              scannedAt: new Date(),
              originalFilename: file.filename,
              sanitizedFilename: sanitizedFilename,
            },
          };
        }

        return args;
      },
    ],
    afterOperation: [
      async ({ args, operation, result }) => {
        if (operation === 'create' && result && args.req?.user) {
          // Log successful upload
          await logSecurityEvent({
            type: 'file_threat',
            severity: 'low',
            userId: String(args.req.user.id),
            details: {
              reason: 'File uploaded successfully',
              fileId: result.id,
              filename: result.filename,
              mimeType: result.mimeType,
              size: result.filesize,
            },
            timestamp: new Date(),
          });
        }

        return result;
      },
    ],
  },
};

export default Media;
