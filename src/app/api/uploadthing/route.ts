import { createRouteHandler } from 'uploadthing/next';
import { ourFileRouter } from './core';

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    token: process.env.UPLOADTHING_TOKEN,
  },
});
