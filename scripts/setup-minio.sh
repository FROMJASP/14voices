#!/bin/bash

# MinIO Setup Script for 14voices
# This script creates the required bucket and sets up access policies

# Configuration
MINIO_ENDPOINT="${S3_ENDPOINT:-http://localhost:9000}"
MINIO_ACCESS_KEY="${S3_ACCESS_KEY:-minioadmin}"
MINIO_SECRET_KEY="${S3_SECRET_KEY:-minioadmin123}"
BUCKET_NAME="${S3_BUCKET:-fourteenvoices-media}"

echo "Setting up MinIO for 14voices..."
echo "Endpoint: $MINIO_ENDPOINT"
echo "Bucket: $BUCKET_NAME"

# Check if mc (MinIO Client) is installed
if ! command -v mc &> /dev/null; then
    echo "MinIO Client (mc) is not installed. Installing..."
    
    # Detect OS and install mc
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        wget https://dl.min.io/client/mc/release/linux-amd64/mc
        chmod +x mc
        sudo mv mc /usr/local/bin/
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install minio/stable/mc
    else
        echo "Please install MinIO Client manually from: https://min.io/docs/minio/linux/reference/minio-mc.html"
        exit 1
    fi
fi

# Configure MinIO alias
echo "Configuring MinIO connection..."
mc alias set 14voices "$MINIO_ENDPOINT" "$MINIO_ACCESS_KEY" "$MINIO_SECRET_KEY"

# Create bucket if it doesn't exist
echo "Creating bucket: $BUCKET_NAME"
mc mb --ignore-existing 14voices/"$BUCKET_NAME"

# Set bucket policy to allow public read access
echo "Setting bucket policy for public read access..."
cat > /tmp/bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": [
        "s3:GetObject"
      ],
      "Resource": [
        "arn:aws:s3:::${BUCKET_NAME}/*"
      ]
    }
  ]
}
EOF

mc anonymous set-json /tmp/bucket-policy.json 14voices/"$BUCKET_NAME"
rm /tmp/bucket-policy.json

# Create directories for different file types
echo "Creating storage directories..."
mc mb --ignore-existing 14voices/"$BUCKET_NAME"/media
mc mb --ignore-existing 14voices/"$BUCKET_NAME"/scripts
mc mb --ignore-existing 14voices/"$BUCKET_NAME"/invoices

# Verify setup
echo "Verifying setup..."
mc ls 14voices/"$BUCKET_NAME"

echo "✅ MinIO setup complete!"
echo ""
echo "You can access:"
echo "- MinIO API: $MINIO_ENDPOINT"
echo "- MinIO Console: ${MINIO_ENDPOINT%:9000}:9001"
echo "- Public files: $MINIO_ENDPOINT/$BUCKET_NAME/"