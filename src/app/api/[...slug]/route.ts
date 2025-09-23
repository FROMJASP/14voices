import config from '@payload-config';
import { REST_GET, REST_DELETE, REST_PATCH, REST_POST, REST_PUT } from '@payloadcms/next/routes';

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';

export const GET = REST_GET(config);
export const POST = REST_POST(config);
export const DELETE = REST_DELETE(config);
export const PATCH = REST_PATCH(config);
export const PUT = REST_PUT(config);
