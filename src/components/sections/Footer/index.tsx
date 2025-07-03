import { getNavigationData, formatNavigation } from '@/lib/navigation';
import { Footer as FooterClient } from '../Footer';

export async function Footer() {
  const navigationData = await getNavigationData();
  const formattedNav = formatNavigation(navigationData);

  const navItems = formattedNav?.mainMenu || [];

  return <FooterClient navItems={navItems} />;
}
