export interface MenuItem {
  label: string;
  href: string;
}

export interface NavigationProps {
  menuItems?: MenuItem[];
  className?: string;
}
