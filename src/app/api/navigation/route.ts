import { getNavigationData, formatNavigation } from '@/lib/navigation'
import { createApiHandler } from '@/lib/api/handlers'
import globalCache from '@/lib/cache'

export const dynamic = 'force-dynamic'

export const GET = createApiHandler(
  async () => {
    return await globalCache.wrap(
      'navigation:main',
      async () => {
        const navigationData = await getNavigationData()
        return formatNavigation(navigationData)
      },
      300000 // 5 minutes
    )
  },
  {
    cache: {
      enabled: true,
      ttl: 300000, // 5 minutes
      key: () => 'navigation:api',
      invalidatePatterns: ['navigation:*']
    },
    transform: (data) => data || {
      mainMenu: [
        { label: 'Home', href: '/', type: 'page' },
        { label: 'Stemmen', href: '/#stemmen', type: 'anchor', isAnchor: true },
        { label: 'Prijzen', href: '/#prijzen', type: 'anchor', isAnchor: true },
        { label: 'Blog', href: '/#blog', type: 'anchor', isAnchor: true },
        { label: 'Contact', href: '/#contact', type: 'anchor', isAnchor: true },
      ]
    }
  }
)