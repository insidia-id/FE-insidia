import type { IconName } from '../components/sidebar-icons';
import { Permissions } from '@/lib/helper/permission.helper';
type ValueOf<T> = T[keyof T];

type NestedValueOf<T> = {
  [K in keyof T]: ValueOf<T[K]>;
}[keyof T];
export type PermissionCode = NestedValueOf<typeof Permissions>;

export type PermissionCodeValue = PermissionCode | string;
export type SubmenuItem = {
  title: string;
  href: string;
  icon: IconName;
  exact?: boolean;
  badge?: string;
  permissions?: PermissionCodeValue[];
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
