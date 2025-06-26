# UploadThing Migration Guide

## Current Status
- ✅ UploadThing implemented for new uploads (Scripts, User Avatars, Invoices)
- ✅ Vercel Blob still handles existing media (Voiceover Photos, Demos)
- ✅ Build passes successfully

## What Happened to Blob Files
Your existing files in Vercel Blob are **still accessible**:
- Voiceover photos and demos remain in Blob storage
- The system uses a hybrid approach: Blob for media, UploadThing for documents
- No data loss occurred

## Next Steps

### 1. Test UploadThing Integration
```bash
# Restart dev server to pick up new collections
bun run dev
```

Then test:
- Upload a script through the booking form
- Check if files upload successfully
- Verify access controls work

### 2. Database Migration
Create new tables for Bookings and Scripts:
```bash
bun run payload migrate:create add_bookings_and_scripts
```

### 3. Frontend Integration
When building booking forms:
```tsx
import { ScriptUpload } from '@/components/ScriptUpload'

// In your booking form
<ScriptUpload 
  bookingId={bookingId} 
  onUploadComplete={(scriptId) => {
    // Handle successful upload
  }}
/>
```

### 4. Voiceover Script Access
Add to voiceover dashboard:
```tsx
import { useScript } from '@/hooks/useScript'

// View assigned scripts
const { script, loading, downloadScript } = useScript(scriptId)
```

## API Endpoints

### Upload Routes
- `POST /api/uploadthing` - Handles all file uploads
- Routes: `bookingScript`, `voiceoverDemo`, `userAvatar`, `invoice`

### Access Scripts
- `GET /api/scripts/[id]` - Fetch script (with auth)
- `DELETE /api/scripts/[id]` - Delete script (owner/admin only)

## Security Features
1. **File Access**: No direct URLs, all through authenticated API
2. **Role-Based**: Admins see all, users see their own
3. **Audit Trail**: Access logs track who viewed files
4. **Sharing**: Optional voiceover access to booking scripts

## Environment Variables
```env
# UploadThing (for documents/scripts)
UPLOADTHING_TOKEN=your_token_here

# Vercel Blob (for media/images)
BLOB_READ_WRITE_TOKEN=your_blob_token
```

## Migration Strategy (Optional)
If you want to migrate old files from Blob to UploadThing:
1. Export file metadata from Blob
2. Download files programmatically
3. Re-upload to UploadThing with metadata
4. Update database references
5. Clean up Blob storage

For now, the hybrid approach works well!