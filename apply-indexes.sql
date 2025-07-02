-- Performance indexes for 14voices
-- Run this manually if migrations fail

-- Voiceovers indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_voiceovers_status ON voiceovers(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_voiceovers_created_at ON voiceovers(created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_voiceovers_slug ON voiceovers(slug);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_voiceovers_status_created ON voiceovers(status, created_at DESC);

-- Email jobs indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_email_jobs_status_scheduled ON "email-jobs"(status, scheduled_for);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_email_jobs_recipient ON "email-jobs"(recipient);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_email_jobs_sequence ON "email-jobs"(sequence);

-- Email contacts indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_email_contacts_email ON "email-contacts"(email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_email_contacts_subscribed ON "email-contacts"(subscribed);

-- Bookings indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_customer ON bookings(customer);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_voiceover ON bookings(voiceover);

-- Media indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_media_created_at ON media(created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_media_mime_type ON media(mime_type);

-- Pages indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pages_status ON pages(status);

-- Users indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_role ON users(role);
EOF < /dev/null