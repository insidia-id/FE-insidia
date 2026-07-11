import type { IconName } from '../components/sidebar-icons';
import { Permissions } from '@/lib/helper/permission.helper';
type ValueOf<T> = T[keyof T];
type LeafValues<T> = T extends string ? T : T extends object ? LeafValues<T[keyof T]> : never;

export type PermissionCode = LeafValues<typeof Permissions>;

export type PermissionCodeValue = PermissionCode | string;
export type SubmenuItem = {
  title: string;
  href: string;
  icon: IconName;
  exact?: boolean;
  badge?: string;
  permissions?: PermissionCodeValue[];
  roles?: string[];
};

export type MenuItem = {
  title: string;
  href: string;
  icon: IconName;
  exact?: boolean;
  badge?: string;
  path?: string;
  submenu?: SubmenuItem[];
  permissions?: PermissionCodeValue[];
  roles?: string[];
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
  onLogout?: () => void;
};
