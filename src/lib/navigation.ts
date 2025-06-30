import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

// Temporary type definition until payload-types.ts is regenerated
interface Navigation {
  id: string
  mainMenu?: any[]
  footerColumns?: any[]
  footerBottom?: any
  mobileMenu?: any
  createdAt?: string
  updatedAt?: string
}

export async function getNavigationData(): Promise<Navigation | null> {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    
    const result = await payload.find({
      collection: 'navigation',
      depth: 2,
      limit: 1,
    })
    
    // Navigation is a singleton, so we get the first (and only) document
    return result.docs[0] as Navigation || null
  } catch (error) {
    console.error('Error fetching navigation data:', error)
    return null
  }
}

export function formatNavigationItem(item: any) {
  if (item.type === 'page' && item.page) {
    return {
      label: item.label,
      href: `/${item.page.slug === 'home' ? '' : item.page.slug}`,
      type: item.type,
      subItems: item.subItems,
    }
  } else if (item.type === 'custom' && item.url) {
    return {
      label: item.label,
      href: item.url,
      type: item.type,
      newTab: item.newTab,
      subItems: item.subItems,
    }
  } else if (item.type === 'dropdown' && item.subItems) {
    return {
      label: item.label,
      type: item.type,
      subItems: item.subItems?.map((subItem: any) => formatNavigationItem(subItem)),
    }
  }
  
  return null
}

export function formatNavigation(navigation: Navigation | null) {
  if (!navigation) return null
  
  return {
    mainMenu: navigation.mainMenu?.map(formatNavigationItem).filter(Boolean) || [],
    footerColumns: navigation.footerColumns?.map(column => ({
      title: column.title,
      links: column.links?.map(formatNavigationItem).filter(Boolean) || [],
    })) || [],
    footerBottom: navigation.footerBottom || {},
    mobileMenu: navigation.mobileMenu || {},
  }
}