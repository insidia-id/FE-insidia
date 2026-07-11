import type { MenuItem } from '../types/Admin';
import { getUsersHref } from '../user/HelperUser';
import { getCoursesHref } from '../courses/lib/course.helper';
import { Permissions } from '@/lib/helper/permission.helper';
import { UserRoleCode } from '../user/types/user.types';
export function getAdminMenuItems(activeRole: UserRoleCode | null, mitraSlug: string | null): MenuItem[] {
  const items: MenuItem[] = [
    // {
    //   title: 'Beranda',
    //   icon: 'House',
    //   href: '/',
    //   exact: true,
    // },
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
      permissions: [Permissions.userPermissions.view.INSIDIA, Permissions.userPermissions.view.MITRA],
      submenu: [
        {
          title: 'Semua User',
          href: getUsersHref(mitraSlug, 'users'),
          icon: 'Users',
          exact: true,
          permissions: [Permissions.userPermissions.view.INSIDIA, Permissions.userPermissions.view.MITRA],
        },
        {
          title: 'Akademik',
          href: getUsersHref(mitraSlug, 'users/academic'),
          icon: 'GraduationCap',
          permissions: [Permissions.userPermissions.view.MITRA],
        },
        {
          title: 'Guru',
          href: getUsersHref(mitraSlug, 'users/teachers'),
          icon: 'GraduationCap',
          permissions: [Permissions.userPermissions.view.MITRA],
        },
        {
          title: 'Murid',
          href: getUsersHref(mitraSlug, 'users/students'),
          icon: 'GraduationCap',
          permissions: [Permissions.userPermissions.view.MITRA],
        },
        {
          title: 'Wali Murid',
          href: getUsersHref(mitraSlug, 'users/guardians'),
          icon: 'GraduationCap',
          permissions: [Permissions.userPermissions.view.MITRA],
        },
        {
          title: 'Tambah User',
          href: getUsersHref(mitraSlug, 'users/create'),
          icon: 'UserPlus',
          permissions: [Permissions.userPermissions.create.MITRA, Permissions.userPermissions.create.INSIDIA],
        },
      ],
    },
    {
      title: 'Manajemen Mitra',
      icon: 'Building2',
      href: getUsersHref(mitraSlug, 'mitras'),
      permissions: [Permissions.mitraPermissions.view.MITRA],
      submenu: [
        {
          title: 'Semua Mitra',
          href: getUsersHref(mitraSlug, 'mitras'),
          icon: 'Building2',
          exact: true,
          permissions: [Permissions.mitraPermissions.view.MITRA],
        },
        {
          title: 'Tambah Mitra',
          href: getUsersHref(mitraSlug, 'mitras/create'),
          icon: 'Building2',
          permissions: [Permissions.mitraPermissions.create.MITRA],
        },
      ],
    },
    {
      title: 'Manajemen Course',
      icon: 'BookOpen',
      href: getCoursesHref(mitraSlug),
      permissions: [Permissions.coursePermissions.view.MITRA, Permissions.coursePermissions.view.INSIDIA],
      submenu: [
        {
          title: 'Semua Course',
          href: getCoursesHref(mitraSlug),
          icon: 'BookOpen',
          exact: true,
          permissions: [Permissions.coursePermissions.view.MITRA, Permissions.coursePermissions.view.INSIDIA],
        },
        {
          title: 'Tambah Course',
          href: getCoursesHref(mitraSlug, 'create'),
          icon: 'FolderKanban',
          permissions: [Permissions.coursePermissions.create.MITRA, Permissions.coursePermissions.create.INSIDIA],
        },
      ],
    },
    {
      title: 'Manajemen Akademik',
      icon: 'GraduationCap',
      href: getUsersHref(mitraSlug, 'academic'),
      roles: ['AKADEMIK'],
      submenu: [
        {
          title: 'Manajemen Akademik',
          icon: 'GraduationCap',
          href: getUsersHref(mitraSlug, 'academic'),
          roles: ['AKADEMIK'],
        },
        {
          title: 'Tahun Ajaran',
          href: getUsersHref(mitraSlug, 'academic/tahun-ajaran'),
          icon: 'Calendar',
          exact: true,
          permissions: [Permissions.mitraPermissions.view.MITRA],
          roles: ['AKADEMIK'],
        },
        {
          title: 'Semester',
          href: getUsersHref(mitraSlug, 'academic/semester'),
          icon: 'CalendarRange',
          exact: true,
          permissions: [Permissions.mitraPermissions.view.MITRA],
          roles: ['AKADEMIK'],
        },
        {
          title: 'Kurikulum',
          href: getUsersHref(mitraSlug, 'academic/kurikulum'),
          icon: 'BookOpenText',
          exact: true,
          permissions: [Permissions.mitraPermissions.view.MITRA],
          roles: ['AKADEMIK'],
        },
        {
          title: 'Angkatan',
          href: getUsersHref(mitraSlug, 'academic/angkatan'),
          icon: 'Users',
          exact: true,
          permissions: [Permissions.mitraPermissions.view.MITRA],
          roles: ['AKADEMIK'],
        },
        {
          title: ' Kelas',
          href: getUsersHref(mitraSlug, 'academic/kelas'),
          icon: 'DoorOpen',
          exact: true,
          permissions: [Permissions.mitraPermissions.view.MITRA],
          roles: ['AKADEMIK'],
        },
        {
          title: ' Kelas Mata Pelajaran',
          href: getUsersHref(mitraSlug, 'academic/kelas-mapel'),
          icon: 'Album',
          exact: true,
          permissions: [Permissions.mitraPermissions.view.MITRA],
          roles: ['AKADEMIK'],
        },
        {
          title: ' Kelas Siswa',
          href: getUsersHref(mitraSlug, 'academic/kelas-siswa'),
          icon: 'GraduationCap',
          exact: true,
          permissions: [Permissions.mitraPermissions.view.MITRA],
          roles: ['AKADEMIK'],
        },
      ],
    },
    {
      title: 'Role & Permission',
      icon: 'Shield',
      href: getUsersHref(mitraSlug, 'access-control'),
      exact: true,
      permissions: [Permissions.rolePermissions.view.MITRA, Permissions.rolePermissions.view.INSIDIA],
    },
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
      const submenu = item.submenu?.filter((subItem) => hasAccess(subItem.roles, subItem.permissions, role, permissionSet));

      const hasItemAccess = hasAccess(item.roles, item.permissions, role, permissionSet);

      if (!hasItemAccess && !submenu?.length) {
        return null;
      }

      return {
        ...item,
        ...(submenu?.length ? { submenu } : {}),
      };
    })
    .filter((item): item is MenuItem => item !== null);
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
function hasAccess(roles: string[] | undefined, permissions: string[] | undefined, currentRole: string | null | undefined, permissionSet: Set<string>) {
  const hasRoleAccess = roles?.includes(currentRole ?? '') ?? false;

  const hasPermissionAccess = permissions?.some((permission) => permissionSet.has(permission)) ?? false;

  return hasRoleAccess || hasPermissionAccess || (!roles?.length && !permissions?.length);
}
