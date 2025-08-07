interface CacheEntry<T> {
  value: T;
  expiry: number;
  size: number;
}

interface CacheOptions {
  maxSize?: number;
  defaultTTL?: number;
  onEvict?: (key: string, value: unknown) => void;
}

interface CacheStats {
  hits: number;
  misses: number;
  evictions: number;
  size: number;
  maxSize: number;
}

export class LRUCache<T = unknown> {
  private cache: Map<string, CacheEntry<T>>;
  private maxSize: number;
  private currentSize: number;
  private defaultTTL: number;
  private stats: CacheStats;
  private onEvict?: (key: string, value: T) => void;

  constructor(options: CacheOptions = {}) {
    this.cache = new Map();
    this.maxSize = options.maxSize || 100 * 1024 * 1024;
    this.currentSize = 0;
    this.defaultTTL = options.defaultTTL || 300000;
    this.onEvict = options.onEvict;
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      size: 0,
      maxSize: this.maxSize,
    };
  }

  private calculateSize(value: unknown): number {
    if (typeof value === 'string') return value.length * 2;
    if (typeof value === 'number') return 8;
    if (typeof value === 'boolean') return 4;
    if (value === null || value === undefined) return 0;
    if (value instanceof Date) return 8;
    if (value instanceof Buffer) return value.length;
    if (Array.isArray(value)) {
      return value.reduce((sum, item) => sum + this.calculateSize(item), 24);
    }
    if (typeof value === 'object') {
      return Object.entries(value).reduce(
        (sum, [key, val]) => sum + key.length * 2 + this.calculateSize(val),
        24
      );
    }
    return 24;
  }

  private evictLRU(): void {
    const firstKey = this.cache.keys().next().value;
    if (firstKey !== undefined) {
      const entry = this.cache.get(firstKey)!;
      this.cache.delete(firstKey);
      this.currentSize -= entry.size;
      this.stats.evictions++;
      if (this.onEvict) {
        this.onEvict(firstKey, entry.value);
      }
    }
  }

  private isExpired(entry: CacheEntry<T>): boolean {
    return Date.now() > entry.expiry;
  }

  set(key: string, value: T, ttl?: number): void {
    const size = this.calculateSize(value);
    const expiry = Date.now() + (ttl || this.defaultTTL);

    if (this.cache.has(key)) {
      const oldEntry = this.cache.get(key)!;
      this.currentSize -= oldEntry.size;
      this.cache.delete(key);
    }

    while (this.currentSize + size > this.maxSize && this.cache.size > 0) {
      this.evictLRU();
    }

    if (size <= this.maxSize) {
      this.cache.set(key, { value, expiry, size });
      this.currentSize += size;
    }

    this.stats.size = this.currentSize;
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      return undefined;
    }

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.currentSize -= entry.size;
      this.stats.misses++;
      this.stats.size = this.currentSize;
      return undefined;
    }

    this.cache.delete(key);
    this.cache.set(key, entry);
    this.stats.hits++;
    return entry.value;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.currentSize -= entry.size;
      this.stats.size = this.currentSize;
      return false;
    }
    return true;
  }

  delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (entry) {
      this.cache.delete(key);
      this.currentSize -= entry.size;
      this.stats.size = this.currentSize;
      return true;
    }
    return false;
  }

  clear(): void {
    this.cache.clear();
    this.currentSize = 0;
    this.stats.size = 0;
  }

  getStats(): CacheStats {
    return { ...this.stats };
  }

  keys(): string[] {
    const validKeys: string[] = [];
    for (const [key, entry] of this.cache.entries()) {
      if (!this.isExpired(entry)) {
        validKeys.push(key);
      }
    }
    return validKeys;
  }

  prune(): void {
    const keysToDelete: string[] = [];
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        keysToDelete.push(key);
        this.currentSize -= entry.size;
      }
    }
    keysToDelete.forEach((key) => this.cache.delete(key));
    this.stats.size = this.currentSize;
  }
}

interface RedisConfig {
  url?: string;
  host?: string;
  port?: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
}

class RedisAdapter {
  private config: RedisConfig;
  private connected: boolean = false;
  private client: ReturnType<typeof import('redis').createClient> | null = null;
  private connectionAttempted: boolean = false;
  private isProduction: boolean = process.env.NODE_ENV === 'production';

  constructor(config: RedisConfig) {
    this.config = {
      keyPrefix: 'cache:',
      ...config,
    };
  }

  async connect(): Promise<void> {
    if (this.connected || this.connectionAttempted) return;
    this.connectionAttempted = true;

    try {
      // Check if we're in Edge Runtime
      if (process.env.NEXT_RUNTIME === 'edge') {
        if (this.isProduction) {
          console.warn('Redis not available in Edge Runtime, using memory cache only');
        }
        this.connected = false;
        return;
      }

      const redis = await import('redis');
      this.client = redis.createClient({
        url: this.config.url,
        socket: {
          host: this.config.host,
          port: this.config.port,
          connectTimeout: 5000, // 5 second timeout
          reconnectStrategy: (retries) => {
            // Only retry a few times in development
            if (!this.isProduction && retries > 3) {
              return false; // Stop retrying
            }
            // In production, use exponential backoff
            return Math.min(retries * 50, 500);
          },
        },
        password: this.config.password,
        database: this.config.db,
      });

      this.client.on('error', (err: Error) => {
        // Only log Redis errors in production or on first occurrence
        if (this.isProduction) {
          console.error('Redis Client Error:', err);
        }
        this.connected = false;
      });

      this.client.on('connect', () => {
        console.log('Redis connected successfully');
        this.connected = true;
      });

      this.client.on('ready', () => {
        this.connected = true;
      });

      await this.client.connect();
    } catch (error) {
      // In development, log once that Redis is not available
      if (!this.isProduction) {
        console.log('Redis not available, falling back to in-memory cache');
      } else {
        console.error('Failed to connect to Redis:', error);
      }
      this.connected = false;
    }
  }

  async get<T>(key: string): Promise<T | undefined> {
    if (!this.connected || !this.client) return undefined;

    try {
      const value = await this.client.get(this.config.keyPrefix + key);
      return value ? JSON.parse(value) : undefined;
    } catch (error) {
      console.error('Redis get error:', error);
      return undefined;
    }
  }

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    if (!this.connected || !this.client) return;

    try {
      const serialized = JSON.stringify(value);
      if (ttl) {
        await this.client.setEx(this.config.keyPrefix + key, Math.floor(ttl / 1000), serialized);
      } else {
        await this.client.set(this.config.keyPrefix + key, serialized);
      }
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  async delete(key: string): Promise<boolean> {
    if (!this.connected || !this.client) return false;

    try {
      const result = await this.client.del(this.config.keyPrefix + key);
      return result > 0;
    } catch (error) {
      console.error('Redis delete error:', error);
      return false;
    }
  }

  async clear(pattern: string = '*'): Promise<void> {
    if (!this.connected || !this.client) return;

    try {
      const keys = await this.client.keys(this.config.keyPrefix + pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
    } catch (error) {
      console.error('Redis clear error:', error);
    }
  }

  async disconnect(): Promise<void> {
    if (this.client && this.connected) {
      await this.client.quit();
      this.connected = false;
      this.client = null;
    }
  }
}

export interface CacheManagerOptions extends CacheOptions {
  useRedis?: boolean;
  redis?: RedisConfig;
  layers?: {
    memory?: boolean;
    redis?: boolean;
  };
}

export class CacheManager {
  private memoryCache: LRUCache;
  private redisAdapter?: RedisAdapter;
  private useRedis: boolean;
  private layers: { memory: boolean; redis: boolean };
  private static initLogged = false;

  constructor(options: CacheManagerOptions = {}) {
    this.memoryCache = new LRUCache(options);
    this.useRedis = options.useRedis ?? !!process.env.REDIS_URL;
    this.layers = {
      memory: options.layers?.memory ?? true,
      redis: options.layers?.redis ?? this.useRedis,
    };

    if (this.layers.redis && this.useRedis) {
      this.redisAdapter = new RedisAdapter(
        options.redis || {
          url: process.env.REDIS_URL,
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : undefined,
          password: process.env.REDIS_PASSWORD,
          db: process.env.REDIS_DB ? parseInt(process.env.REDIS_DB) : undefined,
          keyPrefix: process.env.CACHE_KEY_PREFIX || 'cache:',
        }
      );
      this.redisAdapter.connect().catch(() => {
        // Errors are already handled in the adapter
      });
    }

    // Log cache configuration once
    if (!CacheManager.initLogged && process.env.NODE_ENV === 'development') {
      CacheManager.initLogged = true;
      console.log(
        `Cache initialized with layers: memory=${this.layers.memory}, redis=${this.layers.redis}`
      );
    }
  }

  async get<T>(key: string): Promise<T | undefined> {
    if (this.layers.memory) {
      const memoryValue = this.memoryCache.get(key);
      if (memoryValue !== undefined) {
        return memoryValue as T;
      }
    }

    if (this.layers.redis && this.redisAdapter) {
      const redisValue = await this.redisAdapter.get<T>(key);
      if (redisValue !== undefined && this.layers.memory) {
        this.memoryCache.set(key, redisValue);
      }
      return redisValue;
    }

    return undefined;
  }

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    const promises: Promise<void>[] = [];

    if (this.layers.memory) {
      this.memoryCache.set(key, value, ttl);
    }

    if (this.layers.redis && this.redisAdapter) {
      promises.push(this.redisAdapter.set(key, value, ttl));
    }

    await Promise.all(promises);
  }

  async has(key: string): Promise<boolean> {
    if (this.layers.memory && this.memoryCache.has(key)) {
      return true;
    }

    if (this.layers.redis && this.redisAdapter) {
      const value = await this.redisAdapter.get(key);
      return value !== undefined;
    }

    return false;
  }

  async delete(key: string): Promise<boolean> {
    let deleted = false;

    if (this.layers.memory) {
      deleted = this.memoryCache.delete(key) || deleted;
    }

    if (this.layers.redis && this.redisAdapter) {
      const redisDeleted = await this.redisAdapter.delete(key);
      deleted = redisDeleted || deleted;
    }

    return deleted;
  }

  async clear(pattern?: string): Promise<void> {
    if (this.layers.memory && !pattern) {
      this.memoryCache.clear();
    }

    if (this.layers.redis && this.redisAdapter) {
      await this.redisAdapter.clear(pattern);
    }
  }

  async invalidate(patterns: string[]): Promise<void> {
    const keys = this.memoryCache.keys();

    for (const pattern of patterns) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));

      if (this.layers.memory) {
        keys.filter((key) => regex.test(key)).forEach((key) => this.memoryCache.delete(key));
      }

      if (this.layers.redis && this.redisAdapter) {
        await this.redisAdapter.clear(pattern);
      }
    }
  }

  getStats(): CacheStats {
    return this.memoryCache.getStats();
  }

  async disconnect(): Promise<void> {
    if (this.redisAdapter) {
      await this.redisAdapter.disconnect();
    }
  }

  async wrap<T>(key: string, fn: () => Promise<T>, ttl?: number): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== undefined) {
      return cached;
    }

    const result = await fn();
    await this.set(key, result, ttl);
    return result;
  }

  createKeyGenerator(prefix: string): (...args: unknown[]) => string {
    return (...args: unknown[]) => {
      const parts = args.map((arg) => {
        if (typeof arg === 'object' && arg !== null) {
          return JSON.stringify(arg, Object.keys(arg).sort());
        }
        return String(arg);
      });
      return `${prefix}:${parts.join(':')}`;
    };
  }
}

// Create global cache instance with appropriate defaults
const globalCache = new CacheManager({
  // In development, only use Redis if explicitly configured
  useRedis: process.env.NODE_ENV === 'production' ? !!process.env.REDIS_URL : false,
  layers: {
    memory: true,
    redis: process.env.NODE_ENV === 'production' ? !!process.env.REDIS_URL : false,
  },
});

export default globalCache;
