import type { MenuItem } from '../types/Admin';
import { getUsersHref } from '../user/HelperUser';
import { getCoursesHref } from '../courses/lib/course.helper';
import { Permissions } from '@/lib/helper/permission.helper';
export function getAdminMenuItems(mitraSlug: string | null): MenuItem[] {
  const items: MenuItem[] = [
    {
      title: 'Beranda',
      icon: 'House',
      href: '/',
      exact: true,
    },
    {
      title: 'Dashboard',
      icon: 'LayoutDashboard',
      href: getUsersHref(mitraSlug),
      exact: true,
    },
    {
      title: 'Manajemen User',
      icon: 'Users',
      href: getUsersHref(mitraSlug, 'users'),
      permissions: [Permissions.userPermissions.viewUserInsidia, Permissions.userPermissions.viewUserMitra],
      submenu: [
        {
          title: 'Semua User',
          href: getUsersHref(mitraSlug, 'users'),
          icon: 'Users',
          exact: true,
          permissions: [Permissions.userPermissions.viewUserInsidia, Permissions.userPermissions.viewUserMitra],
        },
        {
          title: 'Tambah User',
          href: getUsersHref(mitraSlug, 'users/create'),
          icon: 'UserPlus',
          permissions: [Permissions.userPermissions.createUserInsidia, Permissions.userPermissions.createUserMitra],
        },
      ],
    },
    {
      title: 'Manajemen Mitra',
      icon: 'Building2',
      href: getUsersHref(mitraSlug, 'mitras'),
      permissions: [Permissions.mitraPermissionCodes.view],
      submenu: [
        {
          title: 'Semua Mitra',
          href: getUsersHref(mitraSlug, 'mitras'),
          icon: 'Building2',
          exact: true,
          permissions: [Permissions.mitraPermissionCodes.view],
        },
        {
          title: 'Tambah Mitra',
          href: getUsersHref(mitraSlug, 'mitras/create'),
          icon: 'Building2',
          permissions: [Permissions.mitraPermissionCodes.create],
        },
      ],
    },
    {
      title: 'Manajemen Course',
      icon: 'BookOpen',
      href: getCoursesHref(mitraSlug),
      permissions: [Permissions.coursePermissionCodes.viewMitra, Permissions.coursePermissionCodes.view],
      submenu: [
        {
          title: 'Semua Course',
          href: getCoursesHref(mitraSlug),
          icon: 'BookOpen',
          exact: true,
          permissions: [Permissions.coursePermissionCodes.viewMitra, Permissions.coursePermissionCodes.view],
        },
        {
          title: 'Tambah Course',
          href: getCoursesHref(mitraSlug, 'create'),
          icon: 'FolderKanban',
          permissions: [Permissions.coursePermissionCodes.create, Permissions.coursePermissionCodes.createMitra],
        },
      ],
    },
    {
      title: 'Role & Permission',
      icon: 'Shield',
      href: getUsersHref(mitraSlug, 'access-control'),
      exact: true,
      permissions: [Permissions.permissionCodes.manageMitraPermissions],
    },
    ...(mitraSlug
      ? [
          {
            title: `Mitra: ${mitraSlug}`,
            icon: 'Building2' as const,
            href: getUsersHref(mitraSlug, 'academic'),
          },
        ]
      : []),
  ];

  return items;
}
export function getSidebarItemsByPermissions(items: MenuItem[], permissionCodes: string[] = [], role?: string | null): MenuItem[] {
  if (role === 'SUPER_ADMIN') {
    return items;
  }

  const permissionSet = new Set(permissionCodes);

  return items
    .map((item) => {
      const hasItemAccess = !item.permissions?.length || item.permissions.some((permission) => permissionSet.has(permission));

      const submenu = item.submenu?.filter((subItem) => {
        return !subItem.permissions?.length || subItem.permissions.some((permission) => permissionSet.has(permission));
      });

      if (!hasItemAccess && !submenu?.length) {
        return null;
      }

      return {
        ...item,
        submenu,
      };
    })
    .filter(Boolean) as MenuItem[];
}

export const getRoleLabel = (role?: string | null) => {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'Super Admin';

    case 'ADMIN':
      return 'Admin';

    case 'MENTOR':
      return 'Mentor';

    default:
      return 'User';
  }
};
