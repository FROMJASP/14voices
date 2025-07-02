import { Payload, Where } from 'payload'
import { 
  VoiceoverEntity, 
  VoiceoverQueryParams, 
  PaginatedResult,
  VoiceoverNotFoundError,
  RepositoryConnectionError,
  ValidationError,
  DemoEntity,
  VoiceoverStatus
} from '../types'
import { PayloadVoiceover } from '@/types/voiceover'

export interface IVoiceoverRepository {
  findAll(params: VoiceoverQueryParams): Promise<PaginatedResult<VoiceoverEntity>>
  findBySlug(slug: string, locale?: string): Promise<VoiceoverEntity>
  findById(id: string, locale?: string): Promise<VoiceoverEntity>
  findByStatus(status: VoiceoverStatus[], params?: VoiceoverQueryParams): Promise<PaginatedResult<VoiceoverEntity>>
  search(query: string, params?: VoiceoverQueryParams): Promise<PaginatedResult<VoiceoverEntity>>
}

export class PayloadVoiceoverRepository implements IVoiceoverRepository {
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private readonly CACHE_TTL = 60 * 1000 // 60 seconds

  constructor(private payload: Payload) {}

  async findAll(params: VoiceoverQueryParams): Promise<PaginatedResult<VoiceoverEntity>> {
    const cacheKey = `voiceovers:all:${JSON.stringify(params)}`
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      const whereClause = this.buildWhereClause(params)
      
      const result = await this.payload.find({
        collection: 'voiceovers',
        where: whereClause,
        depth: Math.max(params.depth || 2, 2), // Ensure minimum depth of 2 to prevent N+1 queries
        locale: params.locale || 'nl',
        page: params.page || 1,
        limit: Math.min(params.limit || 10, 50),
        sort: params.sort || '-createdAt',
      })

      const transformed = {
        docs: result.docs.map(doc => this.transformToEntity(doc as unknown as PayloadVoiceover)),
        totalDocs: result.totalDocs,
        totalPages: result.totalPages,
        page: result.page || 1,
        limit: result.limit,
        hasNextPage: result.hasNextPage || false,
        hasPrevPage: result.hasPrevPage || false,
      }

      this.setCache(cacheKey, transformed)
      return transformed
    } catch (error) {
      throw new RepositoryConnectionError('Failed to fetch voiceovers', error)
    }
  }

  async findBySlug(slug: string, locale?: string): Promise<VoiceoverEntity> {
    if (!slug) {
      throw new ValidationError('Slug is required')
    }

    const cacheKey = `voiceover:slug:${slug}:${locale || 'nl'}`
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      const result = await this.payload.find({
        collection: 'voiceovers',
        where: { slug: { equals: slug } },
        depth: 2,
        locale: locale || 'nl',
        limit: 1,
      })

      if (result.docs.length === 0) {
        throw new VoiceoverNotFoundError(slug)
      }

      const entity = this.transformToEntity(result.docs[0] as unknown as PayloadVoiceover)
      this.setCache(cacheKey, entity)
      return entity
    } catch (error) {
      if (error instanceof VoiceoverNotFoundError) throw error
      throw new RepositoryConnectionError('Failed to fetch voiceover by slug', error)
    }
  }

  async findById(id: string, locale?: string): Promise<VoiceoverEntity> {
    if (!id) {
      throw new ValidationError('ID is required')
    }

    const cacheKey = `voiceover:id:${id}:${locale || 'nl'}`
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      const result = await this.payload.findByID({
        collection: 'voiceovers',
        id,
        depth: 2,
        locale: locale || 'nl',
      })

      if (!result) {
        throw new VoiceoverNotFoundError(id)
      }

      const entity = this.transformToEntity(result as unknown as PayloadVoiceover)
      this.setCache(cacheKey, entity)
      return entity
    } catch (error) {
      if (error instanceof VoiceoverNotFoundError) throw error
      throw new RepositoryConnectionError('Failed to fetch voiceover by ID', error)
    }
  }

  async findByStatus(
    status: VoiceoverStatus[], 
    params?: VoiceoverQueryParams
  ): Promise<PaginatedResult<VoiceoverEntity>> {
    return this.findAll({
      ...params,
      status,
    })
  }

  async search(query: string, params?: VoiceoverQueryParams): Promise<PaginatedResult<VoiceoverEntity>> {
    if (!query || query.trim().length < 2) {
      throw new ValidationError('Search query must be at least 2 characters')
    }

    const cacheKey = `voiceovers:search:${query}:${JSON.stringify(params)}`
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      const searchConditions: Where = {
        or: [
          { name: { contains: query } },
          { description: { contains: query } },
        ] as Where[]
      }

      const whereClause = params?.status 
        ? { and: [searchConditions, { status: { in: params.status } }] }
        : searchConditions

      const result = await this.payload.find({
        collection: 'voiceovers',
        where: whereClause,
        depth: Math.max(params?.depth || 2, 2), // Ensure minimum depth of 2 to prevent N+1 queries
        locale: params?.locale || 'nl',
        page: params?.page || 1,
        limit: Math.min(params?.limit || 10, 50),
        sort: params?.sort || '-createdAt',
      })

      const transformed = {
        docs: result.docs.map(doc => this.transformToEntity(doc as unknown as PayloadVoiceover)),
        totalDocs: result.totalDocs,
        totalPages: result.totalPages,
        page: result.page || 1,
        limit: result.limit,
        hasNextPage: result.hasNextPage || false,
        hasPrevPage: result.hasPrevPage || false,
      }

      this.setCache(cacheKey, transformed)
      return transformed
    } catch (error) {
      throw new RepositoryConnectionError('Search query failed', error)
    }
  }

  private buildWhereClause(params: VoiceoverQueryParams): any {
    const whereClause: any = {}

    if (params.slug) {
      whereClause.slug = { equals: params.slug }
    }

    if (params.status && params.status.length > 0) {
      whereClause.status = { in: params.status }
    } else if (!params.slug) {
      // Default to active and more-voices if no specific status requested
      whereClause.status = { in: ['active', 'more-voices'] }
    }

    return whereClause
  }

  private transformToEntity(payload: PayloadVoiceover): VoiceoverEntity {
    const demos: DemoEntity[] = []

    // Transform demo reels
    if (payload.fullDemoReel && typeof payload.fullDemoReel === 'object') {
      demos.push({
        id: payload.fullDemoReel.id,
        title: 'Full Demo Reel',
        demoType: 'reel',
        audioFile: {
          url: payload.fullDemoReel.url || '',
          filename: payload.fullDemoReel.filename || '',
          mimeType: payload.fullDemoReel.mimeType,
        },
        isPrimary: true,
        voiceoverId: payload.id,
      })
    }

    if (payload.commercialsDemo && typeof payload.commercialsDemo === 'object') {
      demos.push({
        id: payload.commercialsDemo.id,
        title: 'Commercials Demo',
        demoType: 'commercials',
        audioFile: {
          url: payload.commercialsDemo.url || '',
          filename: payload.commercialsDemo.filename || '',
          mimeType: payload.commercialsDemo.mimeType,
        },
        isPrimary: false,
        voiceoverId: payload.id,
      })
    }

    if (payload.narrativeDemo && typeof payload.narrativeDemo === 'object') {
      demos.push({
        id: payload.narrativeDemo.id,
        title: 'Narrative Demo',
        demoType: 'narrations',
        audioFile: {
          url: payload.narrativeDemo.url || '',
          filename: payload.narrativeDemo.filename || '',
          mimeType: payload.narrativeDemo.mimeType,
        },
        isPrimary: false,
        voiceoverId: payload.id,
      })
    }

    return {
      id: payload.id,
      name: payload.name,
      slug: payload.slug || payload.id,
      bio: payload.description,
      profilePhoto: payload.profilePhoto && typeof payload.profilePhoto === 'object' 
        ? {
            url: payload.profilePhoto.url || '',
            alt: payload.name,
          }
        : undefined,
      demos,
      status: payload.status,
      group: payload.group && typeof payload.group === 'object' ? payload.group : undefined,
      styleTags: payload.styleTags,
      availability: payload.availability 
        ? {
            isAvailable: payload.availability.isAvailable,
            unavailableFrom: payload.availability.unavailableFrom 
              ? new Date(payload.availability.unavailableFrom)
              : undefined,
            unavailableUntil: payload.availability.unavailableUntil
              ? new Date(payload.availability.unavailableUntil)
              : undefined,
          }
        : undefined,
      createdAt: new Date(payload.createdAt),
      updatedAt: new Date(payload.updatedAt),
    }
  }

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    const isExpired = Date.now() - cached.timestamp > this.CACHE_TTL
    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    return cached.data
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() })

    // Cleanup old cache entries
    if (this.cache.size > 100) {
      const entries = Array.from(this.cache.entries())
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
      
      // Remove oldest 20 entries
      for (let i = 0; i < 20; i++) {
        this.cache.delete(entries[i][0])
      }
    }
  }

  clearCache(): void {
    this.cache.clear()
  }
}