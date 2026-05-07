import type { LucideIcon } from 'lucide-react';

import { type IconName } from '../components/AppsidebarAdmin';
export type SubmenuItem = {
  title: string;
  href: string;
  icon: IconName;
  exact?: boolean;
  badge?: string;
};

export type MenuItem = {
  title: string;
  href: string;
  icon: IconName;
  exact?: boolean;
  badge?: string;
  submenu?: SubmenuItem[];
};

export type SidebarUser = {
  name: string;
  roleLabel: string;
  avatar?: string | null;
  fallback: string;
};

export type AppSidebarProps = {
  menuItems: MenuItem[];
  user: SidebarUser;
  iconMap: Record<IconName, LucideIcon>;
  onLogout?: () => void;
};
