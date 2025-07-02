import globalCache, { CacheManager } from './index'

export interface CacheStrategy {
  get<T>(key: string): Promise<T | undefined>
  set(key: string, value: unknown, ttl?: number): Promise<void>
  invalidate(patterns: string[]): Promise<void>
}

export class WriteThrough implements CacheStrategy {
  constructor(
    private cache: CacheManager = globalCache,
    private dataFetcher: (key: string) => Promise<unknown>
  ) {}

  async get<T>(key: string): Promise<T | undefined> {
    const cached = await this.cache.get<T>(key)
    if (cached !== undefined) return cached

    const fresh = await this.dataFetcher(key)
    if (fresh !== undefined) {
      await this.cache.set(key, fresh)
    }
    return fresh as T | undefined
  }

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    await this.cache.set(key, value, ttl)
  }

  async invalidate(patterns: string[]): Promise<void> {
    await this.cache.invalidate(patterns)
  }
}

export class WriteAround implements CacheStrategy {
  constructor(
    private cache: CacheManager = globalCache,
    private dataWriter: (key: string, value: unknown) => Promise<void>
  ) {}

  async get<T>(key: string): Promise<T | undefined> {
    return this.cache.get<T>(key)
  }

  async set(key: string, value: unknown): Promise<void> {
    await this.dataWriter(key, value)
    await this.cache.delete(key)
  }

  async invalidate(patterns: string[]): Promise<void> {
    await this.cache.invalidate(patterns)
  }
}

export class WriteBehind implements CacheStrategy {
  private writeQueue: Map<string, { value: unknown; timestamp: number }> = new Map()
  private flushInterval: NodeJS.Timeout | null = null

  constructor(
    private cache: CacheManager = globalCache,
    private dataWriter: (batch: Array<{ key: string; value: unknown }>) => Promise<void>,
    private options: {
      flushInterval?: number
      maxQueueSize?: number
    } = {}
  ) {
    this.startFlushInterval()
  }

  private startFlushInterval(): void {
    const interval = this.options.flushInterval || 5000
    this.flushInterval = setInterval(() => {
      this.flush().catch(console.error)
    }, interval)
  }

  async get<T>(key: string): Promise<T | undefined> {
    const queued = this.writeQueue.get(key)
    if (queued) {
      return queued.value as T
    }
    return this.cache.get<T>(key)
  }

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    await this.cache.set(key, value, ttl)
    this.writeQueue.set(key, { value, timestamp: Date.now() })

    if (this.writeQueue.size >= (this.options.maxQueueSize || 100)) {
      await this.flush()
    }
  }

  async flush(): Promise<void> {
    if (this.writeQueue.size === 0) return

    const batch = Array.from(this.writeQueue.entries()).map(([key, data]) => ({
      key,
      value: data.value
    }))

    try {
      await this.dataWriter(batch)
      this.writeQueue.clear()
    } catch (error) {
      console.error('WriteBehind flush error:', error)
    }
  }

  async invalidate(patterns: string[]): Promise<void> {
    await this.cache.invalidate(patterns)
    
    for (const pattern of patterns) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'))
      for (const key of this.writeQueue.keys()) {
        if (regex.test(key)) {
          this.writeQueue.delete(key)
        }
      }
    }
  }

  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
      this.flushInterval = null
    }
    this.flush().catch(console.error)
  }
}

export class RefreshAhead implements CacheStrategy {
  private refreshQueue: Set<string> = new Set()
  private refreshInterval: NodeJS.Timeout | null = null

  constructor(
    private cache: CacheManager = globalCache,
    private dataFetcher: (key: string) => Promise<unknown>,
    private options: {
      refreshThreshold?: number
      refreshInterval?: number
    } = {}
  ) {
    this.startRefreshInterval()
  }

  private startRefreshInterval(): void {
    const interval = this.options.refreshInterval || 10000
    this.refreshInterval = setInterval(() => {
      this.processRefreshQueue().catch(console.error)
    }, interval)
  }

  async get<T>(key: string): Promise<T | undefined> {
    const entry = await this.cache.get<{ value: T; expiry: number }>(key)
    if (!entry) return undefined

    const now = Date.now()
    const threshold = this.options.refreshThreshold || 0.8
    const timeUntilExpiry = entry.expiry - now
    const originalTtl = entry.expiry - now

    if (timeUntilExpiry < originalTtl * (1 - threshold)) {
      this.refreshQueue.add(key)
    }

    return entry.value
  }

  async set(key: string, value: unknown, ttl: number = 300000): Promise<void> {
    await this.cache.set(key, { value, expiry: Date.now() + ttl }, ttl)
  }

  private async processRefreshQueue(): Promise<void> {
    const keys = Array.from(this.refreshQueue)
    this.refreshQueue.clear()

    await Promise.all(
      keys.map(async (key) => {
        try {
          const fresh = await this.dataFetcher(key)
          if (fresh !== undefined) {
            await this.set(key, fresh)
          }
        } catch (error) {
          console.error(`RefreshAhead error for key ${key}:`, error)
        }
      })
    )
  }

  async invalidate(patterns: string[]): Promise<void> {
    await this.cache.invalidate(patterns)
  }

  destroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
      this.refreshInterval = null
    }
  }
}

export class MultiTierCache implements CacheStrategy {
  constructor(
    private tiers: Array<{
      cache: CacheManager
      ttl: number
      name: string
    }>
  ) {}

  async get<T>(key: string): Promise<T | undefined> {
    for (let i = 0; i < this.tiers.length; i++) {
      const tier = this.tiers[i]
      const value = await tier.cache.get<T>(key)
      
      if (value !== undefined) {
        for (let j = 0; j < i; j++) {
          await this.tiers[j].cache.set(key, value, this.tiers[j].ttl)
        }
        return value
      }
    }
    
    return undefined
  }

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    await Promise.all(
      this.tiers.map((tier) => 
        tier.cache.set(key, value, ttl || tier.ttl)
      )
    )
  }

  async invalidate(patterns: string[]): Promise<void> {
    await Promise.all(
      this.tiers.map((tier) => 
        tier.cache.invalidate(patterns)
      )
    )
  }
}

export function createCacheStrategy(
  type: 'write-through' | 'write-around' | 'write-behind' | 'refresh-ahead' | 'multi-tier',
  options: {
    cache?: CacheManager
    dataFetcher?: (key: string) => Promise<unknown>
    dataWriter?: ((key: string, value: unknown) => Promise<void>) | ((batch: Array<{ key: string; value: unknown }>) => Promise<void>)
    tiers?: Array<{ cache: CacheManager; ttl: number; name: string }>
    refreshThreshold?: number
    refreshInterval?: number
    flushInterval?: number
    maxQueueSize?: number
  }
): CacheStrategy {
  switch (type) {
    case 'write-through':
      if (!options.dataFetcher) {
        throw new Error('dataFetcher is required for write-through cache strategy')
      }
      return new WriteThrough(options.cache, options.dataFetcher)
    
    case 'write-around':
      if (!options.dataWriter) {
        throw new Error('dataWriter is required for write-around cache strategy')
      }
      if (options.dataWriter.length === 2) {
        return new WriteAround(options.cache, options.dataWriter as (key: string, value: unknown) => Promise<void>)
      }
      throw new Error('write-around cache strategy requires a dataWriter with (key, value) signature')
    
    case 'write-behind':
      if (!options.dataWriter) {
        throw new Error('dataWriter is required for write-behind cache strategy')
      }
      if (options.dataWriter.length === 1) {
        return new WriteBehind(options.cache, options.dataWriter as (batch: Array<{ key: string; value: unknown }>) => Promise<void>, options)
      }
      throw new Error('write-behind cache strategy requires a dataWriter with (batch) signature')
    
    case 'refresh-ahead':
      if (!options.dataFetcher) {
        throw new Error('dataFetcher is required for refresh-ahead cache strategy')
      }
      return new RefreshAhead(options.cache, options.dataFetcher, options)
    
    case 'multi-tier':
      if (!options.tiers) {
        throw new Error('tiers are required for multi-tier cache strategy')
      }
      return new MultiTierCache(options.tiers)
    
    default:
      throw new Error(`Unknown cache strategy: ${type}`)
  }
}