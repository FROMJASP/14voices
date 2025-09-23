import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import path from 'path';
import mime from 'mime-types';

interface StorageAnalysis {
  totalFiles: number;
  totalSize: number;
  filesByType: Record<string, number>;
  filesByDirectory: Record<string, number>;
  largestFiles: Array<{ key: string; size: number }>;
  filePatterns: {
    voiceovers: string[];
    images: string[];
    documents: string[];
    videos: string[];
    others: string[];
  };
}

export async function analyzeStorageContents() {
  // Initialize S3 client
  const s3Client = new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY!,
      secretAccessKey: process.env.S3_SECRET_KEY!,
    },
    forcePathStyle: true,
  });

  const bucketName = process.env.S3_BUCKET!;

  console.log('📊 Analyzing storage contents...');
  console.log(`📦 Bucket: ${bucketName}\n`);

  const analysis: StorageAnalysis = {
    totalFiles: 0,
    totalSize: 0,
    filesByType: {},
    filesByDirectory: {},
    largestFiles: [],
    filePatterns: {
      voiceovers: [],
      images: [],
      documents: [],
      videos: [],
      others: [],
    },
  };

  try {
    let continuationToken: string | undefined;
    const allObjects: Array<{ key: string; size: number }> = [];

    // List all objects
    do {
      const listCommand = new ListObjectsV2Command({
        Bucket: bucketName,
        ContinuationToken: continuationToken,
        MaxKeys: 1000,
      });

      const listResponse = await s3Client.send(listCommand);
      const objects = listResponse.Contents || [];

      for (const object of objects) {
        if (!object.Key || object.Key.endsWith('/')) continue;

        analysis.totalFiles++;
        analysis.totalSize += object.Size || 0;

        allObjects.push({
          key: object.Key,
          size: object.Size || 0,
        });

        // Analyze by directory
        const dir = path.dirname(object.Key);
        analysis.filesByDirectory[dir] = (analysis.filesByDirectory[dir] || 0) + 1;

        // Analyze by file type
        const mimeType = mime.lookup(object.Key) || 'unknown';
        const category = mimeType.split('/')[0];

        analysis.filesByType[category] = (analysis.filesByType[category] || 0) + 1;

        // Categorize files
        const filename = path.basename(object.Key);
        if (mimeType.startsWith('audio/')) {
          analysis.filePatterns.voiceovers.push(filename);
        } else if (mimeType.startsWith('image/')) {
          analysis.filePatterns.images.push(filename);
        } else if (mimeType === 'application/pdf') {
          analysis.filePatterns.documents.push(filename);
        } else if (mimeType.startsWith('video/')) {
          analysis.filePatterns.videos.push(filename);
        } else {
          analysis.filePatterns.others.push(filename);
        }
      }

      continuationToken = listResponse.NextContinuationToken;
    } while (continuationToken);

    // Find largest files
    allObjects.sort((a, b) => b.size - a.size);
    analysis.largestFiles = allObjects.slice(0, 10);

    // Display results
    console.log('📈 Storage Analysis Results:\n');

    console.log(`Total Files: ${analysis.totalFiles}`);
    console.log(`Total Size: ${formatBytes(analysis.totalSize)}\n`);

    console.log('Files by Type:');
    Object.entries(analysis.filesByType)
      .sort(([, a], [, b]) => b - a)
      .forEach(([type, count]) => {
        console.log(`  ${type}: ${count} files`);
      });

    console.log('\nFiles by Directory:');
    Object.entries(analysis.filesByDirectory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .forEach(([dir, count]) => {
        console.log(`  ${dir}: ${count} files`);
      });

    console.log('\nLargest Files:');
    analysis.largestFiles.forEach(({ key, size }) => {
      console.log(`  ${formatBytes(size).padEnd(10)} - ${key}`);
    });

    // Show sample files for each category
    console.log('\n🎵 Audio Files (Voiceovers):');
    analysis.filePatterns.voiceovers.slice(0, 5).forEach((f) => console.log(`  - ${f}`));
    if (analysis.filePatterns.voiceovers.length > 5) {
      console.log(`  ... and ${analysis.filePatterns.voiceovers.length - 5} more`);
    }

    console.log('\n🖼️  Image Files:');
    analysis.filePatterns.images.slice(0, 5).forEach((f) => console.log(`  - ${f}`));
    if (analysis.filePatterns.images.length > 5) {
      console.log(`  ... and ${analysis.filePatterns.images.length - 5} more`);
    }

    console.log('\n🎥 Video Files:');
    analysis.filePatterns.videos.slice(0, 5).forEach((f) => console.log(`  - ${f}`));
    if (analysis.filePatterns.videos.length > 5) {
      console.log(`  ... and ${analysis.filePatterns.videos.length - 5} more`);
    }

    console.log('\n📄 Document Files:');
    analysis.filePatterns.documents.slice(0, 5).forEach((f) => console.log(`  - ${f}`));
    if (analysis.filePatterns.documents.length > 5) {
      console.log(`  ... and ${analysis.filePatterns.documents.length - 5} more`);
    }

    // Look for patterns in filenames
    console.log('\n🔍 Detected Naming Patterns:');

    // Check for user avatars
    const avatarPattern = analysis.filePatterns.images.filter(
      (f) => f.includes('avatar') || f.includes('profile') || f.includes('user')
    );
    if (avatarPattern.length > 0) {
      console.log(`\nUser Avatars (${avatarPattern.length} found):`);
      avatarPattern.slice(0, 3).forEach((f) => console.log(`  - ${f}`));
    }

    // Check for voiceover covers
    const coverPattern = analysis.filePatterns.images.filter(
      (f) => f.includes('cover') || f.includes('thumbnail')
    );
    if (coverPattern.length > 0) {
      console.log(`\nCover Images (${coverPattern.length} found):`);
      coverPattern.slice(0, 3).forEach((f) => console.log(`  - ${f}`));
    }

    // Check for blog images
    const blogPattern = analysis.filePatterns.images.filter(
      (f) => f.includes('blog') || f.includes('post') || f.includes('article')
    );
    if (blogPattern.length > 0) {
      console.log(`\nBlog Images (${blogPattern.length} found):`);
      blogPattern.slice(0, 3).forEach((f) => console.log(`  - ${f}`));
    }

    return analysis;
  } catch (error) {
    console.error('❌ Error analyzing storage:', error);
    throw error;
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Run if called directly
if (require.main === module) {
  analyzeStorageContents()
    .then(() => {
      console.log('\n✅ Storage analysis completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Storage analysis failed:', error);
      process.exit(1);
    });
}
