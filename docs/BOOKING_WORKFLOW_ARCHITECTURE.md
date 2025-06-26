# 14voices Booking Workflow & Architecture

## Current Architecture Assessment

### ✅ Dual Storage System Works Well
Having both Blob and UploadThing is actually **ideal** for your use case:

**Vercel Blob** (Public Assets):
- ✓ Voiceover photos - Need fast CDN delivery
- ✓ Demo audio files - Public marketing materials
- ✓ Optimized for media streaming

**UploadThing** (Secure Documents):
- ✓ Customer scripts - Private & confidential
- ✓ Invoices - Financial documents
- ✓ User avatars - Personal data
- ✓ Role-based access control

### 📋 Your Booking Workflow

```
Customer Journey:
1. Browse voiceovers → View photos/demos (Blob)
2. Select & book voiceover → Create booking record
3. Upload script → Secure storage (UploadThing)
4. Voiceover gets notified → Access shared script
5. Complete work → Upload final audio
6. Send invoice → Secure delivery
```

## Recommended Improvements

### 1. Add Status Workflow to Bookings
```typescript
// Update Bookings collection
status: {
  pending_script: 'Awaiting Script',
  script_received: 'Script Uploaded',
  in_production: 'Recording',
  review: 'Customer Review',
  completed: 'Delivered',
  cancelled: 'Cancelled'
}
```

### 2. Add Final Audio Delivery
```typescript
// New collection: Deliverables
{
  booking: relationship('bookings'),
  audioFile: upload(), // Via UploadThing
  version: number,
  customerApproved: boolean,
  notes: textarea
}
```

### 3. Notification System
```typescript
// When script uploaded:
- Email voiceover artist
- Update booking status
- Start deadline timer

// When audio delivered:
- Email customer
- Request approval
- Generate invoice
```

## Next Implementation Steps

### 1. Frontend Booking Form
```tsx
// pages/book/[voiceoverId].tsx
const BookingForm = () => {
  const [bookingId, setBookingId] = useState(null)
  
  return (
    <form>
      {/* Step 1: Booking Details */}
      <input name="projectTitle" />
      <select name="projectType">
        <option>Commercial</option>
        <option>Narration</option>
      </select>
      
      {/* Step 2: Script Upload */}
      {bookingId && (
        <ScriptUpload 
          bookingId={bookingId}
          onComplete={() => notifyVoiceover()}
        />
      )}
    </form>
  )
}
```

### 2. Voiceover Dashboard
```tsx
// pages/dashboard/voiceover.tsx
const VoiceoverDashboard = () => {
  const bookings = useBookings({ 
    status: 'script_received',
    voiceover: currentUser.id 
  })
  
  return (
    <div>
      {bookings.map(booking => (
        <BookingCard 
          booking={booking}
          onViewScript={() => viewSecureScript(booking.script)}
        />
      ))}
    </div>
  )
}
```

### 3. Database Schema Updates
```sql
-- Add to bookings table
ALTER TABLE bookings ADD COLUMN deadline TIMESTAMP;
ALTER TABLE bookings ADD COLUMN rush_order BOOLEAN DEFAULT FALSE;
ALTER TABLE bookings ADD COLUMN final_price DECIMAL(10,2);

-- Create deliverables table
CREATE TABLE deliverables (
  id SERIAL PRIMARY KEY,
  booking_id INT REFERENCES bookings(id),
  file_key VARCHAR(255),
  version INT DEFAULT 1,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Security Considerations

✅ **Current Setup is Secure**:
- Scripts never exposed via public URLs
- Role-based access enforced at API level
- Audit trail for compliance
- Separate storage for public/private assets

## No Problems with Dual Storage!

The combination actually gives you:
1. **Performance**: CDN for public assets
2. **Security**: Locked-down document storage  
3. **Cost Efficiency**: Right tool for each job
4. **Flexibility**: Easy to migrate if needed

## Immediate Next Steps

1. **Test the booking flow end-to-end**
2. **Create the frontend booking form**
3. **Add email notifications**
4. **Build voiceover dashboard**
5. **Implement audio delivery system**

Your architecture is well-suited for the voiceover booking workflow!