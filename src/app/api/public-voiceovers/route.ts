import { NextRequest } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';
import { PayloadVoiceoverRepository } from '@/domains/voiceover/repositories/VoiceoverRepository';
import { VoiceoverService } from '@/domains/voiceover/services/VoiceoverService';
import { VoiceoverQueryParams } from '@/domains/voiceover/types';
import { createApiHandler, createCacheKey } from '@/lib/api/handlers';
import globalCache from '@/lib/cache';
import { z } from 'zod';
import { slugSchema } from '@/lib/validation/schemas';
import { ValidationError } from '@/lib/errors';

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';
// Validation schema for query parameters
const voiceoverQuerySchema = z.object({
  locale: z.string().length(2).optional().default('nl'),
  slug: slugSchema.optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
  search: z.string().max(200).optional(),
});

export const GET = createApiHandler(
  async (req: NextRequest) => {
    // Parse query parameters
    const { searchParams } = new URL(req.url);

    // Validate query parameters
    const validationResult = voiceoverQuerySchema.safeParse({
      locale: searchParams.get('locale') || undefined,
      slug: searchParams.get('where[slug][equals]') || undefined,
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
      search: searchParams.get('search') || undefined,
    });

    if (!validationResult.success) {
      throw new ValidationError(`Invalid query parameters: ${validationResult.error.message}`);
    }

    const { locale, slug, page, limit, search } = validationResult.data;

    // Create cache key based on query params
    const cacheKey = createCacheKey('voiceovers', {
      locale,
      slug,
      page,
      limit,
      search,
    });

    return await globalCache.wrap(
      cacheKey,
      async () => {
        // Initialize Payload
        const payload = await getPayload({ config });

        // Initialize repository and service
        const repository = new PayloadVoiceoverRepository(payload);
        const service = new VoiceoverService(repository, {
          defaultLocale: 'nl',
          defaultLimit: 10,
          maxLimit: 50,
        });

        // Build query parameters
        const queryParams: VoiceoverQueryParams = {
          locale,
          page,
          limit,
          depth: slug ? 2 : 1,
        };

        // Handle different query types
        let result;

        if (slug) {
          // Single voiceover by slug
          const voiceover = await service.getVoiceoverBySlug(slug, locale);
          result = {
            success: true,
            docs: [voiceover],
            data: [voiceover], // Backward compatibility
            totalDocs: 1,
            totalPages: 1,
            page: 1,
            limit: 1,
            hasNextPage: false,
            hasPrevPage: false,
          };
        } else if (search) {
          // Search voiceovers
          const { voiceovers, pagination } = await service.searchVoiceovers(search, queryParams);
          result = {
            success: true,
            docs: voiceovers,
            data: voiceovers, // Backward compatibility
            ...pagination,
          };
        } else {
          // Get active voiceovers (default behavior)
          const { voiceovers, pagination } = await service.getActiveVoiceovers(queryParams);
          result = {
            success: true,
            docs: voiceovers,
            data: voiceovers, // Backward compatibility
            ...pagination,
          };
        }

        // Add cache headers for better client-side caching
        return {
          ...result,
          _headers: {
            'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
            'CDN-Cache-Control': 'max-age=900',
          },
        };
      },
      300000 // 5 minutes cache
    );
  },
  {
    cache: {
      enabled: true,
      ttl: 300000, // 5 minutes
      invalidatePatterns: ['voiceovers:*'],
    },
    rateLimit: {
      requests: 200, // Increased from 120
      window: 60,
    },
    transform: (data) => {
      // Add cache headers to response
      const response = data as Record<string, unknown>;
      response._cacheHeaders = {
        'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
        'CDN-Cache-Control': 'max-age=3600',
      };
      return response;
    },
  }
);
