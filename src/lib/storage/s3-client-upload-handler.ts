/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * S3 Client Upload Handler Wrapper
 * This wrapper prevents errors when S3 is not configured in production
 */

// Check if S3 is properly configured
const hasValidS3Config = () => {
  return (
    process.env.S3_ACCESS_KEY &&
    process.env.S3_SECRET_KEY &&
    process.env.S3_ACCESS_KEY !== 'dummy' &&
    process.env.S3_SECRET_KEY !== 'dummy' &&
    !process.env.S3_ACCESS_KEY.includes('dummy-s3') &&
    !process.env.S3_SECRET_KEY.includes('dummy-s3')
  );
};

let S3ClientUploadHandler: any;

// Dynamically import the handler only if S3 is configured
if (hasValidS3Config()) {
  try {
    // Only attempt to import if we have valid S3 config
    const s3Module = require('@payloadcms/storage-s3/client');
    S3ClientUploadHandler = s3Module.S3ClientUploadHandler;
  } catch (error) {
    console.warn('Failed to load S3 client handler:', error);
    // Fallback to no-op handler
    S3ClientUploadHandler = function NoOpS3Handler() {
      console.warn('S3 storage handler not available');
      return null;
    };
  }
} else {
  // Return a no-op handler when S3 is not configured
  S3ClientUploadHandler = function NoOpS3Handler() {
    if (typeof window !== 'undefined') {
      console.warn('S3 storage not configured, upload functionality disabled');
    }
    return null;
  };
}

// Export with the expected name for import map
export { S3ClientUploadHandler };
export { S3ClientUploadHandler as S3ClientUploadHandler_f7a8e9c3b2d1a5e8 };
