#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Fix Import Map S3 Handler Issue
 *
 * This script conditionally removes the S3ClientUploadHandler from the import map
 * when S3 is not configured, preventing the UploadHandlersProvider error.
 *
 * Usage: node scripts/fix-import-map-s3.js
 */

const fs = require('fs').promises;
const path = require('path');

console.log('🔧 Checking S3 configuration and import map...\n');

async function fixImportMapS3() {
  try {
    // Check if S3 is configured
    const hasS3 =
      process.env.S3_ACCESS_KEY &&
      process.env.S3_SECRET_KEY &&
      process.env.S3_ACCESS_KEY !== 'dummy' &&
      process.env.S3_SECRET_KEY !== 'dummy' &&
      !process.env.S3_ACCESS_KEY.includes('dummy-s3') &&
      !process.env.S3_SECRET_KEY.includes('dummy-s3');

    if (hasS3) {
      console.log('✅ S3 is configured, keeping S3ClientUploadHandler in import map');
      return;
    }

    console.log('⚠️  S3 is not configured, checking import map...');

    // Read the import map file
    const importMapPath = path.join(process.cwd(), 'src/app/(payload)/admin/importMap.js');
    let content = await fs.readFile(importMapPath, 'utf8');

    // Check if S3ClientUploadHandler is present
    if (!content.includes('S3ClientUploadHandler')) {
      console.log('✅ Import map does not contain S3ClientUploadHandler');
      return;
    }

    console.log('🔄 Removing S3ClientUploadHandler from import map...');

    // Remove the import line
    content = content.replace(
      /import\s*{\s*S3ClientUploadHandler[^}]*}\s*from\s*['"]@payloadcms\/storage-s3\/client['"]\s*;?\s*\n/g,
      ''
    );

    // Remove from the export map
    content = content.replace(
      /\s*["']@payloadcms\/storage-s3\/client#S3ClientUploadHandler["']\s*:\s*S3ClientUploadHandler[^,]*,?\s*\n/g,
      ''
    );

    // Write the updated content
    await fs.writeFile(importMapPath, content, 'utf8');

    console.log('✅ Import map updated successfully!');
  } catch (error) {
    console.error('❌ Error fixing import map:', error.message);
    throw error;
  }
}

// Alternative approach: Create a wrapper module
async function createS3Wrapper() {
  const wrapperPath = path.join(process.cwd(), 'src/lib/storage/s3-client-wrapper.ts');

  const wrapperContent = `// S3 Client Upload Handler Wrapper
// This wrapper prevents errors when S3 is not configured

export const S3ClientUploadHandler = () => {
  if (!process.env.S3_ACCESS_KEY || process.env.S3_ACCESS_KEY === 'dummy') {
    // Return a no-op handler when S3 is not configured
    return {
      upload: async () => {
        console.warn('S3 storage not configured, upload skipped');
        return null;
      }
    };
  }
  
  // Only import the real handler if S3 is configured
  try {
    const { S3ClientUploadHandler: RealHandler } = require('@payloadcms/storage-s3/client');
    return RealHandler;
  } catch (error) {
    console.error('Failed to load S3ClientUploadHandler:', error);
    return null;
  }
};
`;

  try {
    await fs.writeFile(wrapperPath, wrapperContent, 'utf8');
    console.log('✅ Created S3 client wrapper at:', wrapperPath);
  } catch (error) {
    console.error('❌ Failed to create wrapper:', error.message);
  }
}

// Run the fix
fixImportMapS3()
  .then(() => createS3Wrapper())
  .then(() => {
    console.log('\n✨ Import map S3 fix completed!');
    console.log('\nNote: You may need to regenerate the import map after this fix.');
    console.log('Run: bun payload generate:importmap');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fix failed:', error);
    process.exit(1);
  });
