import { NavigationBarClient } from './NavigationBarClient';
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

  // Default navigation items if no CMS data
  const defaultItems = [
    { label: 'Home', href: '/', type: 'page' },
    { label: 'Stemmen', href: '/#stemmen', type: 'anchor', isAnchor: true },
    { label: 'Prijzen', href: '/#prijzen', type: 'anchor', isAnchor: true },
    { label: 'Blog', href: '/#blog', type: 'anchor', isAnchor: true },
    { label: 'Contact', href: '/#contact', type: 'anchor', isAnchor: true },
  ];

  const navItems =
    formattedNav?.mainMenu && formattedNav.mainMenu.length > 0
      ? (formattedNav.mainMenu.filter(Boolean) as NavItem[])
      : defaultItems;

  return <NavigationBarClient navItems={navItems} />;
}
