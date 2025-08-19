-- Manual database setup for Payload CMS
-- Run this if automatic migrations fail

-- Create payload_migrations table
CREATE TABLE IF NOT EXISTS payload_migrations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  batch INTEGER NOT NULL,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create payload_preferences table
CREATE TABLE IF NOT EXISTS payload_preferences (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) NOT NULL,
  value JSONB,
  relation TEXT,
  "relationTo" VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create site_settings table (global)
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  "siteTitle" VARCHAR(255),
  "siteDescription" TEXT,
  "siteKeywords" TEXT,
  "siteImage" INTEGER,
  "socialLinks" JSONB,
  "maintenanceMode" BOOLEAN DEFAULT false,
  "maintenanceMessage" TEXT,
  "globalMetadata" JSONB,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  "resetPasswordToken" VARCHAR(255),
  "resetPasswordExpiration" TIMESTAMP,
  salt VARCHAR(255),
  hash VARCHAR(255),
  "loginAttempts" INTEGER DEFAULT 0,
  "lockUntil" TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  "user" INTEGER REFERENCES users(id),
  token VARCHAR(255) NOT NULL UNIQUE,
  "expiresAt" TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create media table
CREATE TABLE IF NOT EXISTS media (
  id SERIAL PRIMARY KEY,
  alt TEXT,
  "prefix" VARCHAR(255) DEFAULT 'media',
  filename VARCHAR(255),
  "mimeType" VARCHAR(255),
  "filesize" INTEGER,
  width INTEGER,
  height INTEGER,
  "focalX" NUMERIC,
  "focalY" NUMERIC,
  sizes JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions("user");
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions("expiresAt");

-- Insert default site settings if not exists
INSERT INTO site_settings (id, "siteTitle", "maintenanceMode")
VALUES (1, '14voices', false)
ON CONFLICT (id) DO NOTHING;

-- Mark this as a completed migration
INSERT INTO payload_migrations (name, batch)
VALUES ('initial_setup', 1)
ON CONFLICT (name) DO NOTHING;