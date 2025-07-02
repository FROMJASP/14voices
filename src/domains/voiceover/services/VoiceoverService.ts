import { 
  VoiceoverEntity, 
  VoiceoverQueryParams, 
  PaginatedResult,
  VoiceoverStatus,
  DemoEntity,
  ValidationError
} from '../types'
import { IVoiceoverRepository } from '../repositories/VoiceoverRepository'
import { TransformedVoiceover, VoiceoverDemo } from '@/types/voiceover'

export interface VoiceoverServiceOptions {
  defaultLocale?: string
  defaultLimit?: number
  maxLimit?: number
}

export class VoiceoverService {
  private readonly defaultOptions: Required<VoiceoverServiceOptions> = {
    defaultLocale: 'nl',
    defaultLimit: 10,
    maxLimit: 50,
  }

  constructor(
    private readonly repository: IVoiceoverRepository,
    options?: VoiceoverServiceOptions
  ) {
    this.defaultOptions = { ...this.defaultOptions, ...options }
  }

  async getVoiceovers(params: VoiceoverQueryParams): Promise<{
    voiceovers: TransformedVoiceover[]
    pagination: {
      totalDocs: number
      totalPages: number
      page: number
      limit: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  }> {
    // Validate and normalize parameters
    const normalizedParams = this.normalizeQueryParams(params)
    
    // Fetch from repository
    const result = await this.repository.findAll(normalizedParams)
    
    // Transform to frontend format
    const voiceovers = result.docs.map(entity => this.transformToFrontendFormat(entity))
    
    return {
      voiceovers,
      pagination: {
        totalDocs: result.totalDocs,
        totalPages: result.totalPages,
        page: result.page,
        limit: result.limit,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      }
    }
  }

  async getVoiceoverBySlug(slug: string, locale?: string): Promise<TransformedVoiceover> {
    if (!slug || slug.trim().length === 0) {
      throw new ValidationError('Slug is required')
    }

    const entity = await this.repository.findBySlug(slug, locale || this.defaultOptions.defaultLocale)
    return this.transformToFrontendFormat(entity)
  }

  async getActiveVoiceovers(params?: Omit<VoiceoverQueryParams, 'status'>): Promise<{
    voiceovers: TransformedVoiceover[]
    pagination: {
      totalDocs: number
      totalPages: number
      page: number
      limit: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  }> {
    const normalizedParams = this.normalizeQueryParams({
      ...params,
      status: ['active', 'more-voices'],
    })

    const result = await this.repository.findByStatus(['active', 'more-voices'], normalizedParams)
    
    const voiceovers = result.docs.map(entity => this.transformToFrontendFormat(entity))
    
    return {
      voiceovers,
      pagination: {
        totalDocs: result.totalDocs,
        totalPages: result.totalPages,
        page: result.page,
        limit: result.limit,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      }
    }
  }

  async searchVoiceovers(
    query: string, 
    params?: VoiceoverQueryParams
  ): Promise<{
    voiceovers: TransformedVoiceover[]
    pagination: {
      totalDocs: number
      totalPages: number
      page: number
      limit: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  }> {
    if (!query || query.trim().length < 2) {
      throw new ValidationError('Search query must be at least 2 characters')
    }

    const normalizedParams = this.normalizeQueryParams(params || {})
    const result = await this.repository.search(query.trim(), normalizedParams)
    
    const voiceovers = result.docs.map(entity => this.transformToFrontendFormat(entity))
    
    return {
      voiceovers,
      pagination: {
        totalDocs: result.totalDocs,
        totalPages: result.totalPages,
        page: result.page,
        limit: result.limit,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      }
    }
  }

  async getVoiceoversByGroup(groupId: string, params?: VoiceoverQueryParams): Promise<{
    voiceovers: TransformedVoiceover[]
    pagination: {
      totalDocs: number
      totalPages: number
      page: number
      limit: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  }> {
    const normalizedParams = this.normalizeQueryParams(params || {})
    
    // Add group filter to where clause
    const result = await this.repository.findAll({
      ...normalizedParams,
      // This would need to be added to the repository implementation
      // For now, we'll filter in memory
    })
    
    const filteredDocs = result.docs.filter(entity => entity.group?.id === groupId)
    const voiceovers = filteredDocs.map(entity => this.transformToFrontendFormat(entity))
    
    return {
      voiceovers,
      pagination: {
        totalDocs: filteredDocs.length,
        totalPages: Math.ceil(filteredDocs.length / result.limit),
        page: result.page,
        limit: result.limit,
        hasNextPage: false, // Simplified for in-memory filtering
        hasPrevPage: false,
      }
    }
  }

  async getAvailableVoiceovers(params?: VoiceoverQueryParams): Promise<{
    voiceovers: TransformedVoiceover[]
    pagination: {
      totalDocs: number
      totalPages: number
      page: number
      limit: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  }> {
    const normalizedParams = this.normalizeQueryParams({
      ...params,
      status: ['active'],
    })

    const result = await this.repository.findByStatus(['active'], normalizedParams)
    
    // Filter by availability
    const now = new Date()
    const availableDocs = result.docs.filter(entity => {
      if (!entity.availability) return true
      if (entity.availability.isAvailable === false) return false
      
      if (entity.availability.unavailableFrom && entity.availability.unavailableUntil) {
        return now < entity.availability.unavailableFrom || now > entity.availability.unavailableUntil
      }
      
      return true
    })
    
    const voiceovers = availableDocs.map(entity => this.transformToFrontendFormat(entity))
    
    return {
      voiceovers,
      pagination: {
        totalDocs: availableDocs.length,
        totalPages: Math.ceil(availableDocs.length / result.limit),
        page: result.page,
        limit: result.limit,
        hasNextPage: false, // Simplified for in-memory filtering
        hasPrevPage: false,
      }
    }
  }

  private normalizeQueryParams(params: VoiceoverQueryParams): VoiceoverQueryParams {
    const normalized: VoiceoverQueryParams = {
      locale: params.locale || this.defaultOptions.defaultLocale,
      page: Math.max(1, params.page || 1),
      limit: Math.min(
        params.limit || this.defaultOptions.defaultLimit,
        this.defaultOptions.maxLimit
      ),
      sort: params.sort || '-createdAt',
      depth: params.depth,
    }

    if (params.slug) {
      normalized.slug = params.slug
    }

    if (params.status) {
      normalized.status = params.status
    }

    return normalized
  }

  private transformToFrontendFormat(entity: VoiceoverEntity): TransformedVoiceover {
    const demos: VoiceoverDemo[] = entity.demos.map(demo => ({
      id: demo.id,
      title: demo.title,
      demoType: demo.demoType,
      audioFile: {
        url: demo.audioFile.url,
        filename: demo.audioFile.filename,
      },
      duration: demo.duration,
      language: demo.language,
      accent: demo.accent,
      tags: demo.tags,
      isPrimary: demo.isPrimary,
      description: demo.description,
      voiceover: {
        id: entity.id,
        name: entity.name,
        slug: entity.slug,
      }
    }))

    return {
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      bio: entity.bio,
      profilePhoto: entity.profilePhoto,
      demos,
      status: entity.status,
      group: entity.group,
      styleTags: entity.styleTags,
    }
  }

  // Utility methods for checking voiceover states
  isVoiceoverAvailable(voiceover: VoiceoverEntity): boolean {
    if (voiceover.status !== 'active') return false
    if (!voiceover.availability) return true
    if (voiceover.availability.isAvailable === false) return false
    
    const now = new Date()
    if (voiceover.availability.unavailableFrom && voiceover.availability.unavailableUntil) {
      return now < voiceover.availability.unavailableFrom || now > voiceover.availability.unavailableUntil
    }
    
    return true
  }

  getVoiceoverPrimaryDemo(voiceover: VoiceoverEntity): DemoEntity | undefined {
    return voiceover.demos.find(demo => demo.isPrimary)
  }

  getVoiceoverDemosByType(voiceover: VoiceoverEntity, demoType: DemoEntity['demoType']): DemoEntity[] {
    return voiceover.demos.filter(demo => demo.demoType === demoType)
  }
}