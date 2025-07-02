import { createApiHandler } from '@/lib/api/handlers'
import globalCache from '@/lib/cache'

export const GET = createApiHandler(
  async () => {
    const stats = globalCache.getStats()
    const hitRate = stats.hits + stats.misses > 0 
      ? (stats.hits / (stats.hits + stats.misses)) * 100 
      : 0
    
    return {
      stats,
      hitRate: hitRate.toFixed(2) + '%',
      utilization: ((stats.size / stats.maxSize) * 100).toFixed(2) + '%',
      timestamp: new Date().toISOString()
    }
  },
  {
    cache: {
      enabled: false
    },
    rateLimit: {
      requests: 10,
      window: 60
    }
  }
)