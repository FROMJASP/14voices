#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Fix Import Map for Production
 *
 * This script removes S3ClientUploadHandler from the import map
 * when S3 is not configured, preventing runtime errors.
 */

const fs = require('fs').promises;
const path = require('path');

async function fixImportMap() {
  console.log('🔧 Fixing import map for production...\n');

  const importMapPath = path.join(
    __dirname,
    '..',
    'src',
    'app',
    '(payload)',
    'admin',
    'importMap.js'
  );

  try {
    // Read current import map
    let content = await fs.readFile(importMapPath, 'utf8');

    // Check if S3 is configured
    const hasValidS3 =
      process.env.S3_ACCESS_KEY &&
      process.env.S3_SECRET_KEY &&
      process.env.S3_ACCESS_KEY !== 'dummy' &&
      process.env.S3_SECRET_KEY !== 'dummy' &&
      !process.env.S3_ACCESS_KEY.includes('dummy-s3');

    if (!hasValidS3 && content.includes('S3ClientUploadHandler')) {
      console.log('❌ S3 not configured but import map includes S3ClientUploadHandler');
      console.log('🔄 Removing S3ClientUploadHandler from import map...');

      // Remove the import line
      content = content.replace(
        /import\s*{\s*S3ClientUploadHandler[^}]*}\s*from\s*['"]@payloadcms\/storage-s3\/client['"]\s*;?\s*\n/g,
        ''
      );

      // Remove from the export map
      content = content.replace(
        /\s*["']@payloadcms\/storage-s3\/client#S3ClientUploadHandler["']\s*:\s*S3ClientUploadHandler[^,\n]*,?\s*/g,
        ''
      );

      // Clean up any trailing commas
      content = content.replace(/,(\s*})/, '$1');

      // Write the fixed import map
      await fs.writeFile(importMapPath, content, 'utf8');
      console.log('✅ Import map fixed successfully');
    } else if (hasValidS3) {
      console.log('✅ S3 is configured, import map is correct');
    } else {
      console.log('✅ Import map does not contain S3ClientUploadHandler');
    }

    // Also create a stub module as a fallback
    const stubPath = path.join(
      __dirname,
      '..',
      'src',
      'app',
      '(payload)',
      'admin',
      'S3ClientUploadHandler-stub.js'
    );
    const stubContent = `// Stub for S3ClientUploadHandler when S3 is not configured
export const S3ClientUploadHandler = () => {
  console.warn('S3ClientUploadHandler called but S3 is not configured');
  return null;
};
`;

    await fs.writeFile(stubPath, stubContent, 'utf8');
    console.log('✅ Created stub module as fallback');
  } catch (error) {
    console.error('❌ Error fixing import map:', error.message);
    process.exit(1);
  }
}

// Run the fix
fixImportMap()
  .then(() => {
    console.log('\n✨ Import map fixed for production!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Unexpected error:', error);
    process.exit(1);
  });
