import { getPayload } from 'payload';
import configPromise from '@payload-config';

// Temporary type definition until payload-types.ts is regenerated
interface Navigation {
  id: string;
  mainMenu?: NavigationItem[];
  footerColumns?: FooterColumn[];
  footerBottom?: FooterBottom;
  mobileMenu?: MobileMenu;
  banner?: {
    enabled?: boolean;
    message?: string;
    linkText?: string;
    linkType?: string;
    linkUrl?: string;
    linkPage?: { slug: string };
    dismissible?: boolean;
    style?: 'gradient' | 'solid' | 'subtle';
  };
  createdAt?: string;
  updatedAt?: string;
}

export async function getNavigationData(): Promise<Navigation | null> {
  try {
    const payload = await getPayload({ config: configPromise });

    const result = await payload.find({
      collection: 'navigation',
      depth: 2,
      limit: 1,
    });

    // Navigation is a singleton, so we get the first (and only) document
    return (result.docs[0] as Navigation) || null;
  } catch (error) {
    console.error('Error fetching navigation data:', error);
    return null;
  }
}

interface NavigationItem {
  type: 'page' | 'custom' | 'anchor' | 'dropdown';
  label: string;
  page?: { slug: string };
  url?: string;
  newTab?: boolean;
  anchor?: string;
  subItems?: NavigationItem[];
}

interface FooterColumn {
  title: string;
  links?: NavigationItem[];
}

interface FooterBottom {
  [key: string]: unknown;
}

interface MobileMenu {
  [key: string]: unknown;
}

export function formatNavigationItem(item: NavigationItem): {
  label: string;
  href?: string;
  type: string;
  isAnchor?: boolean;
  newTab?: boolean;
  subItems?: NavigationItem[];
} | null {
  if (item.type === 'page' && item.page) {
    return {
      label: item.label,
      href: `/${item.page.slug === 'home' ? '' : item.page.slug}`,
      type: item.type,
      subItems: item.subItems,
    };
  } else if (item.type === 'custom' && item.url) {
    return {
      label: item.label,
      href: item.url,
      type: item.type,
      newTab: item.newTab,
      subItems: item.subItems,
    };
  } else if (item.type === 'anchor' && item.anchor) {
    return {
      label: item.label,
      href: `/#${item.anchor}`,
      type: item.type,
      isAnchor: true,
    };
  } else if (item.type === 'dropdown' && item.subItems) {
    return {
      label: item.label,
      type: item.type,
      subItems: item.subItems
        ?.map((subItem: NavigationItem) => formatNavigationItem(subItem))
        .filter(Boolean) as NavigationItem[] | undefined,
    };
  }

  return null;
}

export function formatNavigation(navigation: Navigation | null) {
  if (!navigation) return null;

  return {
    mainMenu: navigation.mainMenu?.map(formatNavigationItem).filter(Boolean) || [],
    footerColumns:
      navigation.footerColumns?.map((column) => ({
        title: column.title,
        links: column.links?.map(formatNavigationItem).filter(Boolean) || [],
      })) || [],
    footerBottom: navigation.footerBottom || {},
    mobileMenu: navigation.mobileMenu || {},
  };
}
