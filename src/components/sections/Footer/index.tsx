import { getNavigationData, formatNavigation } from '@/lib/navigation';
import { Footer as FooterClient } from '../Footer';

export async function Footer() {
  const navigationData = await getNavigationData();
  const formattedNav = formatNavigation(navigationData);

  // Filter out null values and ensure all items have required properties
  const navItems = (formattedNav?.mainMenu || [])
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .map((item) => ({
      label: item.label,
      href: item.href || '#',
      type: (item.type === 'page' || item.type === 'anchor' || item.type === 'custom'
        ? item.type
        : 'custom') as 'page' | 'anchor' | 'custom',
      isAnchor: item.isAnchor,
    }));

  return <FooterClient navItems={navItems} />;
}
