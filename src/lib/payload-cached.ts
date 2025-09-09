import { getPayload } from 'payload';
import configPromise from '@payload-config';

// Cache the Payload instance to avoid reinitializing on every request
let cachedPayload: Awaited<ReturnType<typeof getPayload>> | null = null;

export async function getCachedPayload() {
  if (cachedPayload) {
    return cachedPayload;
  }

  console.log('[Payload] Creating new instance...');
  const startTime = Date.now();
  
  cachedPayload = await getPayload({ config: configPromise });
  
  console.log(`[Payload] Instance created in ${Date.now() - startTime}ms`);
  
  return cachedPayload;
}

// Clear cache in development when files change
if (process.env.NODE_ENV === 'development') {
  // @ts-expect-error - module.hot is added by webpack HMR
  if (module.hot) {
    // @ts-expect-error - module.hot.dispose is a webpack HMR API
    module.hot.dispose(() => {
      cachedPayload = null;
    });
  }
}