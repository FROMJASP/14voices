import { S3Client, ListObjectsV2Command, HeadObjectCommand } from '@aws-sdk/client-s3';

export async function testMinIOConnection() {
  // MinIO credentials from environment
  const accessKeyId = process.env.S3_ACCESS_KEY!;
  const secretAccessKey = process.env.S3_SECRET_KEY!;
  const endpoint = process.env.S3_ENDPOINT!;
  const bucketName = process.env.S3_BUCKET!;

  console.log('Testing MinIO connection...');
  console.log(`Endpoint: ${endpoint}`);
  console.log(`Bucket: ${bucketName}\n`);

  // Initialize S3 client
  const s3Client = new S3Client({
    endpoint,
    region: process.env.S3_REGION || 'us-east-1',
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true,
  });

  try {
    // List first few objects
    const listCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      MaxKeys: 3,
    });

    const listResponse = await s3Client.send(listCommand);
    const objects = listResponse.Contents || [];

    console.log(`Found ${objects.length} objects:\n`);

    for (const obj of objects) {
      console.log(`Object Key: ${obj.Key}`);
      console.log(`Size: ${obj.Size} bytes`);
      console.log(`Last Modified: ${obj.LastModified}`);

      // Get object metadata
      if (obj.Key) {
        try {
          const headCommand = new HeadObjectCommand({
            Bucket: bucketName,
            Key: obj.Key,
          });

          const headResponse = await s3Client.send(headCommand);
          console.log(`Content Type: ${headResponse.ContentType}`);
          console.log(`ETag: ${headResponse.ETag}`);
        } catch (error) {
          console.log(`Error getting metadata: ${error}`);
        }
      }

      console.log('---');
    }

    // Generate presigned URL for first object
    if (objects.length > 0 && objects[0].Key) {
      console.log('\nGenerating download URL for first object...');
      const firstKey = objects[0].Key;

      // Construct direct MinIO URL
      const directUrl = `${endpoint}/${bucketName}/${firstKey}`;
      console.log(`Direct URL: ${directUrl}`);

      // Try public URL pattern
      const publicUrl = `${process.env.S3_PUBLIC_URL}/${firstKey}`;
      console.log(`Public URL: ${publicUrl}`);
    }
  } catch (error) {
    console.error('Error connecting to MinIO:', error);
  }
}

// Run if called directly
if (import.meta.main) {
  testMinIOConnection()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
