#!/usr/bin/env bun
/**
 * Script to apply security middleware to all API routes
 */

import { glob } from 'glob';
import { readFile, writeFile } from 'fs/promises';

interface RouteConfig {
  path: string;
  requireAuth: boolean;
  requireAdmin: boolean;
  rateLimit: string;
  skipCSRF: boolean;
}

// Configuration for each API route
const routeConfigs: Record<string, Partial<RouteConfig>> = {
  // Public routes (no auth required)
  '/api/public-voiceovers': { requireAuth: false, rateLimit: 'public' },
  '/api/navigation': { requireAuth: false, rateLimit: 'public' },
  '/api/site-settings': { requireAuth: false, rateLimit: 'public' },
  '/api/testimonials': { requireAuth: false, rateLimit: 'public' },
  '/api/forms/submit': { requireAuth: false, rateLimit: 'formSubmission' },
  '/api/health': { requireAuth: false, rateLimit: 'public' },
  '/api/health/cache': { requireAuth: false, rateLimit: 'public' },
  '/api/health/performance': { requireAuth: false, rateLimit: 'public' },
  
  // Webhook routes (special handling)
  '/api/webhooks/resend': { requireAuth: false, skipCSRF: true, rateLimit: 'webhook' },
  '/api/cron/process-emails': { requireAuth: false, skipCSRF: true, rateLimit: 'cron' },
  
  // Admin routes
  '/api/admin/email-stats': { requireAdmin: true, rateLimit: 'admin' },
  '/api/admin/migrate-storage': { requireAdmin: true, rateLimit: 'admin' },
  '/api/cache/metrics': { requireAdmin: true, rateLimit: 'admin' },
  '/api/debug-env': { requireAdmin: true, rateLimit: 'admin' },
  '/api/debug-blob': { requireAdmin: true, rateLimit: 'admin' },
  
  // Authenticated routes
  '/api/audiences': { requireAuth: true, rateLimit: 'authenticated' },
  '/api/audiences/sync': { requireAuth: true, rateLimit: 'authenticated' },
  '/api/campaigns': { requireAuth: true, rateLimit: 'authenticated' },
  '/api/campaigns/[id]': { requireAuth: true, rateLimit: 'authenticated' },
  '/api/campaigns/[id]/send': { requireAuth: true, rateLimit: 'authenticated' },
  '/api/contacts/import': { requireAuth: true, rateLimit: 'importExport' },
  '/api/email/test': { requireAuth: true, rateLimit: 'authenticated' },
  '/api/email/preview': { requireAuth: true, rateLimit: 'authenticated' },
  '/api/email/analytics': { requireAuth: true, rateLimit: 'authenticated' },
  '/api/analytics/campaigns': { requireAuth: true, rateLimit: 'authenticated' },
  '/api/blocks/[id]': { requireAuth: true, rateLimit: 'authenticated' },
  '/api/sections/[id]': { requireAuth: true, rateLimit: 'authenticated' },
  '/api/layouts/[id]': { requireAuth: true, rateLimit: 'authenticated' },
  '/api/scripts/[id]': { requireAuth: true, rateLimit: 'authenticated' },
  '/api/forms/[id]': { requireAuth: true, rateLimit: 'authenticated' },
  
  // Special routes
  '/api/uploadthing': { requireAuth: true, rateLimit: 'fileUpload' },
  '/api/test': { requireAdmin: true, rateLimit: 'admin' },
  '/api/[...slug]': { requireAuth: false, rateLimit: 'public' }, // Fallback route
};

function getRouteConfig(filePath: string): RouteConfig {
  // Extract the API path from the file path
  const apiPath = filePath
    .replace(/.*\/src\/app\/api/, '/api')
    .replace(/\/route\.ts$/, '');
  
  // Find matching config
  const config = routeConfigs[apiPath] || {};
  
  return {
    path: apiPath,
    requireAuth: config.requireAuth ?? true, // Default to requiring auth
    requireAdmin: config.requireAdmin ?? false,
    rateLimit: config.rateLimit ?? 'authenticated',
    skipCSRF: config.skipCSRF ?? false,
  };
}

function generateImports(hasGET: boolean, hasPOST: boolean, hasPUT: boolean, hasPATCH: boolean, hasDELETE: boolean): string {
  const methods = [];
  if (hasGET) methods.push('GET');
  if (hasPOST) methods.push('POST');
  if (hasPUT) methods.push('PUT');
  if (hasPATCH) methods.push('PATCH');
  if (hasDELETE) methods.push('DELETE');
  
  return `import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withPublicAuth, withAdminAuth } from '@/lib/auth-middleware';`;
}

function wrapHandler(method: string, config: RouteConfig): string {
  let wrapper = 'withAuth';
  let options = [];
  
  if (!config.requireAuth) {
    wrapper = 'withPublicAuth';
  } else if (config.requireAdmin) {
    wrapper = 'withAdminAuth';
  }
  
  if (config.rateLimit !== 'authenticated') {
    options.push(`rateLimit: '${config.rateLimit}'`);
  }
  
  if (config.skipCSRF) {
    options.push('skipCSRF: true');
  }
  
  const optionsStr = options.length > 0 ? `, { ${options.join(', ')} }` : '';
  
  return `export const ${method} = ${wrapper}(${method}Handler${optionsStr});`;
}

async function processRoute(filePath: string) {
  try {
    console.log(`Processing ${filePath}...`);
    
    const content = await readFile(filePath, 'utf-8');
    const config = getRouteConfig(filePath);
    
    // Skip if already using auth middleware
    if (content.includes('withAuth') || content.includes('withPublicAuth') || content.includes('withAdminAuth')) {
      console.log(`  ✓ Already secured`);
      return;
    }
    
    // Skip webhook route as it's already properly secured
    if (filePath.includes('webhooks/resend')) {
      console.log(`  ✓ Webhook route already has custom security`);
      return;
    }
    
    // Detect exported methods
    const hasGET = /export\s+(?:async\s+)?function\s+GET/.test(content);
    const hasPOST = /export\s+(?:async\s+)?function\s+POST/.test(content);
    const hasPUT = /export\s+(?:async\s+)?function\s+PUT/.test(content);
    const hasPATCH = /export\s+(?:async\s+)?function\s+PATCH/.test(content);
    const hasDELETE = /export\s+(?:async\s+)?function\s+DELETE/.test(content);
    
    if (!hasGET && !hasPOST && !hasPUT && !hasPATCH && !hasDELETE) {
      console.log(`  ⚠ No HTTP methods found`);
      return;
    }
    
    let newContent = content;
    
    // Update imports
    const importRegex = /import\s+{\s*NextRequest\s*,\s*NextResponse\s*}\s+from\s+['"]next\/server['"]\s*;?/;
    if (importRegex.test(newContent)) {
      newContent = newContent.replace(
        importRegex,
        generateImports(hasGET, hasPOST, hasPUT, hasPATCH, hasDELETE)
      );
    }
    
    // Rename exported functions to handlers
    if (hasGET) {
      newContent = newContent.replace(
        /export\s+(async\s+)?function\s+GET/,
        'async function GETHandler'
      );
    }
    if (hasPOST) {
      newContent = newContent.replace(
        /export\s+(async\s+)?function\s+POST/,
        'async function POSTHandler'
      );
    }
    if (hasPUT) {
      newContent = newContent.replace(
        /export\s+(async\s+)?function\s+PUT/,
        'async function PUTHandler'
      );
    }
    if (hasPATCH) {
      newContent = newContent.replace(
        /export\s+(async\s+)?function\s+PATCH/,
        'async function PATCHHandler'
      );
    }
    if (hasDELETE) {
      newContent = newContent.replace(
        /export\s+(async\s+)?function\s+DELETE/,
        'async function DELETEHandler'
      );
    }
    
    // Add wrapped exports at the end
    const exports: string[] = [];
    if (hasGET) exports.push(wrapHandler('GET', config));
    if (hasPOST) exports.push(wrapHandler('POST', config));
    if (hasPUT) exports.push(wrapHandler('PUT', config));
    if (hasPATCH) exports.push(wrapHandler('PATCH', config));
    if (hasDELETE) exports.push(wrapHandler('DELETE', config));
    
    newContent = newContent.trimEnd() + '\n\n' + exports.join('\n') + '\n';
    
    await writeFile(filePath, newContent);
    console.log(`  ✓ Applied ${config.requireAdmin ? 'admin' : config.requireAuth ? 'auth' : 'public'} middleware with ${config.rateLimit} rate limit`);
    
  } catch (error) {
    console.error(`  ✗ Error processing ${filePath}:`, error);
  }
}

async function main() {
  const routeFiles = await glob('src/app/api/**/route.ts', {
    cwd: process.cwd(),
    absolute: true,
  });
  
  console.log(`Found ${routeFiles.length} API routes\n`);
  
  for (const file of routeFiles) {
    await processRoute(file);
  }
  
  console.log('\n✓ Security middleware application complete!');
}

main().catch(console.error);