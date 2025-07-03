import { NavigationBarEnhanced } from './NavigationBarEnhanced';
import { getNavigationData, formatNavigation } from '@/lib/navigation';

interface NavItem {
  label: string;
  href?: string;
  type: string;
  isAnchor?: boolean;
  newTab?: boolean;
  subItems?: NavItem[];
}

export async function NavigationBar() {
  const navigationData = await getNavigationData();
  const formattedNav = formatNavigation(navigationData);

  // Default navigation items with favicon
  const defaultItems = [
    { label: 'Voiceovers', href: '/#stemmen', type: 'anchor', isAnchor: true },
    { label: 'Prijzen', href: '/#prijzen', type: 'anchor', isAnchor: true },
    { label: 'Blog', href: '/#blog', type: 'anchor', isAnchor: true },
    { label: 'Contact', href: '/#contact', type: 'anchor', isAnchor: true },
  ];

  const navItems =
    formattedNav?.mainMenu && formattedNav.mainMenu.length > 0
      ? (formattedNav.mainMenu.filter(Boolean) as NavItem[])
      : defaultItems;

  // Check if banner is enabled
  const hasBanner = navigationData?.banner?.enabled || false;

  return <NavigationBarEnhanced navItems={navItems} hasBanner={hasBanner} />;
}
