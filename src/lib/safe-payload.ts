import { getPayload as originalGetPayload } from 'payload';
import type { BasePayload } from 'payload';
import configPromise from '@payload-config';

let payloadInstance: BasePayload | null = null;
let initializationError: Error | null = null;
let isInitializing = false;

/**
 * Safe wrapper around getPayload that handles initialization errors gracefully
 * This is especially important for initial deployments when the database might not be fully set up
 */
export async function getSafePayload(): Promise<BasePayload | null> {
  // If we already have an error from a previous attempt, don't retry
  if (initializationError) {
    console.log('Payload initialization previously failed, returning null');
    return null;
  }

  // If we already have a payload instance, return it
  if (payloadInstance) {
    return payloadInstance;
  }

  // If we're currently initializing, wait a bit and return null to avoid race conditions
  if (isInitializing) {
    console.log('Payload is currently initializing, returning null');
    return null;
  }

  try {
    isInitializing = true;
    console.log('Attempting to initialize Payload...');
    
    // Check if we're in a build environment
    if (process.env.DATABASE_URL?.includes('fake:fake@fake')) {
      console.log('Build environment detected, skipping Payload initialization');
      return null;
    }

    payloadInstance = await originalGetPayload({ config: configPromise });
    console.log('Payload initialized successfully');
    return payloadInstance;
  } catch (error) {
    console.error('Failed to initialize Payload:', error);
    initializationError = error as Error;
    
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
}