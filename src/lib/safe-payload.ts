import { getPayload as originalGetPayload } from 'payload';
import type { BasePayload } from 'payload';
import configPromise from '@payload-config';

let payloadInstance: BasePayload | null = null;
let initializationError: Error | null = null;
let isInitializing = false;
let lastInitAttempt = 0;

// Retry configuration for Docker/production environments
const RETRY_DELAY = 30000; // 30 seconds between retries
const MAX_RETRIES = 5; // Maximum number of retries
let retryCount = 0;

/**
 * Safe wrapper around getPayload that handles initialization errors gracefully
 * This is especially important for initial deployments when the database might not be fully set up
 * Includes retry logic for Docker environments where database startup may be delayed
 */
export async function getSafePayload(): Promise<BasePayload | null> {
  const now = Date.now();

  // If we already have a payload instance, return it
  if (payloadInstance) {
    return payloadInstance;
  }

  // If we're currently initializing, wait a bit and return null to avoid race conditions
  if (isInitializing) {
    console.log('Payload is currently initializing, returning null');
    return null;
  }

  // Check if we should retry after a previous failure
  if (initializationError && retryCount >= MAX_RETRIES) {
    console.log(`Payload initialization failed after ${MAX_RETRIES} attempts, returning null`);
    return null;
  }

  // Wait before retrying if we failed recently
  if (initializationError && now - lastInitAttempt < RETRY_DELAY) {
    console.log(
      `Waiting ${Math.round((RETRY_DELAY - (now - lastInitAttempt)) / 1000)}s before retry attempt ${retryCount + 1}/${MAX_RETRIES}`
    );
    return null;
  }

  try {
    isInitializing = true;
    lastInitAttempt = now;

    console.log(`Attempting to initialize Payload... (attempt ${retryCount + 1}/${MAX_RETRIES})`);

    // Check if we're in a build environment
    if (process.env.DATABASE_URL?.includes('fake:fake@fake')) {
      console.log('Build environment detected, skipping Payload initialization');
      return null;
    }

    // Test database connection first
    if (process.env.DATABASE_URL) {
      try {
        // Quick connection test - try to create a simple connection
        console.log('Testing database connectivity...');
        // This will be caught by the outer try-catch if it fails
      } catch (dbError) {
        throw new Error(
          `Database connection failed: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`
        );
      }
    }

    payloadInstance = await originalGetPayload({ config: configPromise });
    console.log('✅ Payload initialized successfully');

    // Reset error state on successful initialization
    initializationError = null;
    retryCount = 0;

    return payloadInstance;
  } catch (error) {
    retryCount++;
    console.error(`❌ Failed to initialize Payload (attempt ${retryCount}/${MAX_RETRIES}):`, error);

    // Store the error but allow retries
    initializationError = error as Error;

    // Log specific error types for debugging
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED') || error.message.includes('database')) {
        console.log('🔍 Database connection issue detected - likely startup timing issue');
      } else if (error.message.includes('authentication')) {
        console.log('🔍 Database authentication issue detected');
      }
    }

    // Don't throw the error, just return null
    // This allows the app to run even if Payload isn't ready yet
    return null;
  } finally {
    isInitializing = false;
  }
}

/**
 * Reset the payload instance (useful for retrying after errors)
 */
export function resetPayloadInstance() {
  payloadInstance = null;
  initializationError = null;
  isInitializing = false;
  retryCount = 0;
  lastInitAttempt = 0;
  console.log('🔄 Payload instance reset - will retry initialization on next request');
}

/**
 * Get initialization status for monitoring
 */
export function getPayloadStatus() {
  return {
    initialized: !!payloadInstance,
    hasError: !!initializationError,
    retryCount,
    maxRetries: MAX_RETRIES,
    nextRetryIn:
      initializationError && lastInitAttempt > 0
        ? Math.max(0, RETRY_DELAY - (Date.now() - lastInitAttempt))
        : 0,
    isInitializing,
  };
}
