# Video Thumbnail Solution for Payload CMS

## Problem

MP4 videos uploaded to Payload CMS don't show preview thumbnails in the admin panel. This is because:

1. **Payload's `imageSizes` only works for images** - The built-in image processing using Sharp doesn't handle video files
2. **No built-in video processing** - Payload CMS doesn't include video thumbnail generation out of the box
3. **MinIO/S3 storage doesn't generate video thumbnails** - The storage adapter only handles file storage, not processing

## Solutions Implemented

### 1. Client-Side Video Thumbnail Generation (Implemented)

We created a `MediaPreview` component that generates video thumbnails using the HTML5 Canvas API:

**File**: `/src/components/admin/MediaPreview.tsx`

- Uses the video element to load the video
- Seeks to 10% of duration (or 1 second)
- Draws the frame to a canvas
- Converts to a data URL for display

**Advantages**:

- No server dependencies
- Works immediately in the browser
- No FFmpeg installation required

**Limitations**:

- Thumbnails are generated on-demand (not stored)
- CORS restrictions may apply for external videos
- Browser compatibility considerations

### 2. Server-Side FFmpeg Solution (Prepared)

We've also prepared server-side solutions for production use:

**Files**:

- `/src/lib/video-thumbnail.ts` - Basic FFmpeg integration
- `/src/lib/video-thumbnail-advanced.ts` - Advanced metadata extraction

**Requirements**:

```bash
# Install FFmpeg on your server
apt-get install ffmpeg  # Ubuntu/Debian
brew install ffmpeg      # macOS
```

**Implementation Steps**:

1. Install FFmpeg on your production server
2. Add the video thumbnail hook to generate thumbnails on upload
3. Store thumbnails as separate media entries
4. Reference thumbnails in the video document

### 3. Updated Media Collection

The Media collection has been updated with:

- A `videoThumbnail` field to store thumbnail references
- A UI field that displays the preview using our custom component
- Hooks prepared for server-side processing

## Current Implementation

The current implementation uses **client-side thumbnail generation** which:

- Shows video previews in the admin panel
- Generates thumbnails on-demand when viewing media
- Requires no additional server configuration

## Production Recommendations

For production environments, consider:

1. **Background Job Processing**:

   ```typescript
   // Queue thumbnail generation after upload
   await queueThumbnailGeneration(mediaId);
   ```

2. **CDN Integration**:
   - Use a service like Cloudinary or Mux for automatic video processing
   - These services can generate thumbnails, multiple resolutions, and optimize delivery

3. **FFmpeg on Server**:
   - Install FFmpeg on your Coolify VPS
   - Use the provided hooks to generate and store thumbnails
   - Consider using a job queue (Bull, BullMQ) for async processing

## Testing the Solution

1. Upload an MP4 video to the Media collection
2. The preview should show in the sidebar when editing
3. Video thumbnails will display in the media list (if configured)

## Environment Variables (Optional)

For production FFmpeg processing:

```env
# Video processing options
VIDEO_THUMBNAIL_ENABLED=true
VIDEO_THUMBNAIL_QUALITY=85
VIDEO_THUMBNAIL_TIME_OFFSET=1
```

## Known Limitations

1. **CORS**: Videos from different domains may not generate thumbnails due to CORS
2. **Large Files**: Client-side generation may be slow for large video files
3. **Browser Support**: Requires modern browsers with Canvas API support

## Future Enhancements

1. **Automatic Thumbnail Storage**: Save generated thumbnails as media entries
2. **Multiple Thumbnails**: Generate thumbnails at different timestamps
3. **Video Sprite Sheets**: Create sprite sheets for video scrubbing
4. **AI-Based Selection**: Use AI to select the most representative frame

## Resources

- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)
- [Payload CMS Upload Docs](https://payloadcms.com/docs/upload/overview)
- [HTML5 Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
