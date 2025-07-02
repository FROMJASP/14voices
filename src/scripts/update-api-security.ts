#!/usr/bin/env tsx

/**
 * Script to update remaining API routes with security middleware
 * Run with: npx tsx src/scripts/update-api-security.ts
 */

import fs from 'fs/promises'
import path from 'path'

const API_ROUTES_TO_UPDATE = [
  // Email routes
  { path: 'src/app/api/email/test/route.ts', requireAuth: true, rateLimit: { max: 5, window: 60000 } },
  { path: 'src/app/api/email/preview/route.ts', requireAuth: true },
  { path: 'src/app/api/email/analytics/route.ts', requireAuth: true },
  
  // Campaign routes
  { path: 'src/app/api/campaigns/route.ts', requireAuth: true },
  { path: 'src/app/api/campaigns/[id]/route.ts', requireAuth: true },
  { path: 'src/app/api/analytics/campaigns/route.ts', requireAuth: true },
  
  // Audience routes
  { path: 'src/app/api/audiences/route.ts', requireAuth: true },
  
  // Admin routes
  { path: 'src/app/api/admin/migrate-storage/route.ts', requireAuth: true, roles: ['admin'] },
  { path: 'src/app/api/scripts/[id]/route.ts', requireAuth: true, roles: ['admin'] },
  
  // CMS routes
  { path: 'src/app/api/blocks/[id]/route.ts', requireAuth: true },
  { path: 'src/app/api/sections/[id]/route.ts', requireAuth: true },
  { path: 'src/app/api/layouts/[id]/route.ts', requireAuth: true },
  { path: 'src/app/api/forms/[id]/route.ts', requireAuth: true },
  
  // Public routes with rate limiting
  { path: 'src/app/api/testimonials/route.ts', requireAuth: false, rateLimit: { max: 100, window: 60000 } },
  { path: 'src/app/api/voiceovers/route.ts', requireAuth: false, rateLimit: { max: 20, window: 60000 } },
  { path: 'src/app/api/webhooks/resend/route.ts', requireAuth: false, validateWebhook: true },
]

const IMPORT_STATEMENTS = `import { withAuth, withRateLimit, withSecurityHeaders, composeMiddleware } from '@/middleware/auth'
import { validateRequest } from '@/lib/api-security'`

const VALIDATION_IMPORTS = {
  'email/test': 'emailTestSchema',
  'email/preview': 'emailPreviewSchema',
  'campaigns': 'campaignCreateSchema, campaignUpdateSchema',
  'audiences': 'audienceCreateSchema, audienceUpdateSchema',
  'admin/migrate-storage': 'storageMigrationSchema',
  'scripts': 'scriptExecutionSchema',
  'testimonials': 'testimonialCreateSchema',
  'voiceovers': 'voiceoverCreateSchema',
  'webhooks/resend': 'webhookEventSchema',
}

interface RouteConfig {
  path: string
  requireAuth?: boolean
  rateLimit?: { max: number; window: number }
  roles?: string[]
  validateWebhook?: boolean
}

async function updateRoute(routeConfig: RouteConfig) {
  const filePath = path.join(process.cwd(), routeConfig.path)
  
  try {
    let content = await fs.readFile(filePath, 'utf-8')
    
    // Check if already updated
    if (content.includes('@/middleware/auth')) {
      console.log(`✓ Already updated: ${routeConfig.path}`)
      return
    }
    
    // Add imports
    const importLine = content.indexOf('import')
    if (importLine !== -1) {
      const firstImportEnd = content.indexOf('\n', importLine)
      
      // Check which validation schema to import
      let validationImport = ''
      for (const [key, schema] of Object.entries(VALIDATION_IMPORTS)) {
        if (routeConfig.path.includes(key)) {
          validationImport = `\nimport { ${schema} } from '@/lib/validation/schemas'`
          break
        }
      }
      
      content = content.slice(0, firstImportEnd + 1) + 
                IMPORT_STATEMENTS + 
                validationImport +
                content.slice(firstImportEnd)
    }
    
    // Update function exports to use middleware
    const middlewareConfig = []
    
    // Always add security headers
    middlewareConfig.push('withSecurityHeaders')
    
    // Add rate limiting
    if (routeConfig.rateLimit) {
      middlewareConfig.push(
        `withRateLimit({ windowMs: ${routeConfig.rateLimit.window}, max: ${routeConfig.rateLimit.max} })`
      )
    }
    
    // Add auth if required
    if (routeConfig.requireAuth) {
      const authOptions = routeConfig.roles 
        ? `{ requireAuth: true, allowedRoles: ${JSON.stringify(routeConfig.roles)} }`
        : ''
      middlewareConfig.push(`withAuth${authOptions ? `(${authOptions})` : ''}`)
    }
    
    // Replace export statements
    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    for (const method of methods) {
      const exportRegex = new RegExp(`export\\s+(async\\s+)?function\\s+${method}`, 'g')
      if (exportRegex.test(content)) {
        // Change to handler function
        content = content.replace(exportRegex, `async function ${method.toLowerCase()}Handler`)
        
        // Add export with middleware at the end
        content += `\n\nexport const ${method} = composeMiddleware(\n  ${middlewareConfig.join(',\n  ')}\n)(${method.toLowerCase()}Handler)`
      }
    }
    
    // Write updated content
    await fs.writeFile(filePath, content)
    console.log(`✅ Updated: ${routeConfig.path}`)
    
  } catch (error) {
    console.error(`❌ Failed to update ${routeConfig.path}:`, error)
  }
}

async function main() {
  console.log('🔒 Updating API routes with security middleware...\n')
  
  for (const route of API_ROUTES_TO_UPDATE) {
    await updateRoute(route)
  }
  
  console.log('\n✨ Security updates complete!')
  console.log('\nNext steps:')
  console.log('1. Review each updated file to ensure proper validation')
  console.log('2. Add specific validation logic where needed')
  console.log('3. Test all API endpoints')
  console.log('4. Update any client code that calls these APIs')
}

main().catch(console.error)