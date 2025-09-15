#!/usr/bin/env bun
/**
 * Script to create database indexes for performance optimization
 * Run with: bun run src/scripts/create-indexes.ts
 */

import { getPayload } from 'payload';
import configPromise from '@payload-config';

async function createIndexes() {
  console.log('🚀 Starting index creation...');

  try {
    // Get Payload instance
    const payload = await getPayload({ config: configPromise });

    // Get database connection through Payload
    const db = payload.db;

    console.log('📊 Creating performance indexes...');

    // Import and run the migration
    const migration = await import('../migrations/2025_add_performance_indexes');
    await migration.up({
      db: db as any, // Type casting needed for migration
      payload,
      req: {} as any,
    });

    console.log('✅ All indexes created successfully!');
    console.log('');
    console.log('📝 Created indexes for:');
    console.log('  - Voiceovers: status, slug, search');
    console.log('  - Blog Posts: status, slug, published date, category');
    console.log('  - Pages: slug, status');
    console.log('  - Categories: slug');
    console.log('  - Media: filename, mime type');
    console.log('  - Users: email, role');
    console.log('  - Form Submissions: form, created date');
    console.log('  - Email Logs: status, type, monitoring');
    console.log('  - Security Logs: event type, severity, monitoring');
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Run the script
createIndexes();
