import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { PayloadVoiceoverRepository } from '@/domains/voiceover/repositories/VoiceoverRepository'
import { VoiceoverService } from '@/domains/voiceover/services/VoiceoverService'
import { 
  VoiceoverQueryParams, 
  ValidationError, 
  VoiceoverNotFoundError,
  RepositoryConnectionError 
} from '@/domains/voiceover/types'

export async function GET(request: Request) {
  try {
    // Initialize Payload
    const payload = await getPayload({ config })
    
    // Initialize repository and service
    const repository = new PayloadVoiceoverRepository(payload)
    const service = new VoiceoverService(repository, {
      defaultLocale: 'nl',
      defaultLimit: 10,
      maxLimit: 50,
    })
    
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'nl'
    const slug = searchParams.get('where[slug][equals]')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    
    // Build query parameters
    const queryParams: VoiceoverQueryParams = {
      locale,
      page,
      limit,
      depth: slug ? 2 : 1,
    }
    
    // Handle different query types
    let result
    
    if (slug) {
      // Single voiceover by slug
      const voiceover = await service.getVoiceoverBySlug(slug, locale)
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
      }
    } else if (search) {
      // Search voiceovers
      const { voiceovers, pagination } = await service.searchVoiceovers(search, queryParams)
      result = {
        success: true,
        docs: voiceovers,
        data: voiceovers, // Backward compatibility
        ...pagination,
      }
    } else {
      // Get active voiceovers (default behavior)
      const { voiceovers, pagination } = await service.getActiveVoiceovers(queryParams)
      result = {
        success: true,
        docs: voiceovers,
        data: voiceovers, // Backward compatibility
        ...pagination,
      }
    }
    
    const response = NextResponse.json(result)
    
    // Add caching headers
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    response.headers.set('CDN-Cache-Control', 'max-age=3600')
    
    return response
  } catch (error) {
    // Handle specific error types
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { 
          success: false,
          error: error.message,
          code: error.code,
        },
        { status: error.statusCode || 400 }
      )
    }
    
    if (error instanceof VoiceoverNotFoundError) {
      return NextResponse.json(
        { 
          success: false,
          error: error.message,
          code: error.code,
        },
        { status: error.statusCode || 404 }
      )
    }
    
    if (error instanceof RepositoryConnectionError) {
      // Log to monitoring service
      console.error('[VoiceoverAPI] Repository connection error:', {
        message: error.message,
        details: error.details,
        stack: error.stack,
      })
      
      return NextResponse.json(
        { 
          success: false,
          error: 'Service temporarily unavailable',
          code: error.code,
        },
        { status: error.statusCode || 503 }
      )
    }
    
    // Generic error handling
    console.error('[VoiceoverAPI] Unexpected error:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch voiceovers',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    )
  }
}