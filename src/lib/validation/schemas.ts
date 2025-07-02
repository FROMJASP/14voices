import { z } from 'zod'

// Common schemas
export const emailSchema = z.string().email().toLowerCase().trim()
export const idSchema = z.string().min(1).max(100)
export const dateSchema = z.string().datetime()
export const uuidSchema = z.string().uuid()
export const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)

// Pagination schemas
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional().default('asc')
})

// Query parameter schemas
export const dateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
})

// Audience sync validation
export const audienceSyncSchema = z.object({
  audienceId: idSchema,
})

// Campaign send validation
export const campaignSendSchema = z.object({
  test: z.boolean().optional().default(false),
  testEmails: z.array(emailSchema).max(10).optional().default([]),
})

// Contact import validation
export const contactImportSchema = z.object({
  contacts: z.array(z.object({
    email: emailSchema,
    firstName: z.string().min(1).max(100).optional(),
    lastName: z.string().min(1).max(100).optional(),
    tags: z.array(z.string().min(1).max(50)).max(10).optional(),
    customFields: z.record(z.string(), z.any()).optional(),
  })).min(1).max(1000),
  audienceId: idSchema.optional(),
  skipDuplicates: z.boolean().optional().default(true),
})

// Email test validation
export const emailTestSchema = z.object({
  to: emailSchema,
  subject: z.string().min(1).max(200),
  content: z.string().min(1).max(50000),
  fromName: z.string().min(1).max(100),
  fromEmail: emailSchema,
  replyTo: emailSchema.optional(),
})

// Email preview validation
export const emailPreviewSchema = z.object({
  campaignId: idSchema,
  contactId: idSchema.optional(),
})

// Forms submit validation
export const formSubmitSchema = z.object({
  formId: idSchema,
  data: z.record(z.string(), z.any()),
  timestamp: dateSchema.optional(),
  source: z.enum(['website', 'api', 'widget']).optional().default('website'),
})

// Webhook validation
export const webhookEventSchema = z.object({
  type: z.string(),
  created_at: dateSchema,
  data: z.record(z.string(), z.any()),
})

// Script execution validation
export const scriptExecutionSchema = z.object({
  params: z.record(z.string(), z.any()).optional(),
  dryRun: z.boolean().optional().default(false),
})

// Site settings validation
export const siteSettingsUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  logo: z.string().url().optional(),
  favicon: z.string().url().optional(),
  socialLinks: z.array(z.object({
    platform: z.string(),
    url: z.string().url(),
  })).optional(),
})

// Navigation validation
export const navigationUpdateSchema = z.object({
  items: z.array(z.object({
    label: z.string().min(1).max(100),
    url: z.string().min(1).max(500),
    type: z.enum(['internal', 'external', 'anchor']),
    openInNewTab: z.boolean().optional(),
    children: z.array(z.any()).optional(), // Recursive type
  })).max(50),
})

// Analytics validation
export const analyticsQuerySchema = z.object({
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
  campaignId: idSchema.optional(),
  audienceId: idSchema.optional(),
  metric: z.enum(['opens', 'clicks', 'bounces', 'unsubscribes']).optional(),
})

// Testimonial validation
export const testimonialCreateSchema = z.object({
  author: z.string().min(1).max(100),
  role: z.string().min(1).max(100).optional(),
  company: z.string().min(1).max(100).optional(),
  content: z.string().min(10).max(1000),
  rating: z.number().int().min(1).max(5).optional(),
  featured: z.boolean().optional().default(false),
})

// Voiceover validation
export const voiceoverCreateSchema = z.object({
  text: z.string().min(1).max(5000),
  voice: z.string().min(1).max(50),
  language: z.string().length(2),
  speed: z.number().min(0.5).max(2).optional().default(1),
  pitch: z.number().min(0.5).max(2).optional().default(1),
})

// Admin migration validation
export const storageMigrationSchema = z.object({
  dryRun: z.boolean().optional().default(true),
  collections: z.array(z.string()).optional(),
  batchSize: z.number().int().min(1).max(100).optional().default(10),
})

// Campaign CRUD validation
export const campaignCreateSchema = z.object({
  name: z.string().min(1).max(200),
  subject: z.string().min(1).max(200),
  fromName: z.string().min(1).max(100),
  fromEmail: emailSchema,
  replyTo: emailSchema.optional(),
  audienceId: idSchema,
  content: z.any().optional(),
  contentType: z.enum(['rich-text', 'markdown', 'react']).optional().default('rich-text'),
  scheduledAt: dateSchema.optional(),
})

export const campaignUpdateSchema = campaignCreateSchema.partial()

// Audience CRUD validation
export const audienceCreateSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  type: z.enum(['static', 'dynamic', 'all']),
  segmentRules: z.object({
    logic: z.enum(['all', 'any']),
    rules: z.array(z.object({
      field: z.string(),
      operator: z.string(),
      value: z.string(),
    })).max(20),
  }).optional(),
  contacts: z.array(idSchema).max(10000).optional(),
})

export const audienceUpdateSchema = audienceCreateSchema.partial()

// Block/Section/Layout validation
export const blockUpdateSchema = z.object({
  content: z.any(),
  settings: z.record(z.string(), z.any()).optional(),
  order: z.number().int().min(0).optional(),
})

export const sectionUpdateSchema = z.object({
  title: z.string().max(200).optional(),
  blocks: z.array(idSchema).optional(),
  settings: z.record(z.string(), z.any()).optional(),
})

export const layoutUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  sections: z.array(idSchema).optional(),
  isDefault: z.boolean().optional(),
})


// Search validation
export const searchSchema = z.object({
  q: z.string().min(1).max(200),
  fields: z.array(z.string()).optional(),
  fuzzy: z.boolean().optional().default(true),
})

// Sanitization helpers
export const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization - in production use a library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
}

export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/\.{2,}/g, '.')
    .slice(0, 255)
}

// Type exports
export type AudienceSyncInput = z.infer<typeof audienceSyncSchema>
export type CampaignSendInput = z.infer<typeof campaignSendSchema>
export type ContactImportInput = z.infer<typeof contactImportSchema>
export type FormSubmitInput = z.infer<typeof formSubmitSchema>
export type CampaignCreateInput = z.infer<typeof campaignCreateSchema>
export type AudienceCreateInput = z.infer<typeof audienceCreateSchema>