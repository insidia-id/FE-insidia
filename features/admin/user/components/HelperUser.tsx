import { RoleUser, User } from '../types/user.types';
export const USER_STATUS_OPTIONS = [
  { label: 'Aktif', value: 'ACTIVE' },
  { label: 'Ditangguhkan', value: 'SUSPENDED' },
  { label: 'Diblokir', value: 'BANNED' },
] as const;

export const USER_ROLE_OPTIONS = [
  { label: 'Super Admin', value: 'SUPER_ADMIN', scope: 'PLATFORM' },
  { label: 'Admin', value: 'ADMIN', scope: 'PLATFORM' },
  { label: 'Mentor', value: 'MENTOR', scope: 'PLATFORM' },
  { label: 'User', value: 'USER', scope: 'PLATFORM' },
] as const;

const ROLE_FILTER_ALL_OPTION = { label: 'Semua role', value: 'all' } as const;

function normalizeRole(role?: string | null) {
  return role?.toUpperCase() as RoleUser | undefined;
}

export function getUserRole(user: Pick<User, 'platformRole' | 'mitraRoles'>): RoleUser {
  return user.platformRole?.role.code ?? user.mitraRoles[0]?.role.code ?? 'USER';
}

export function getUserScope(user: Pick<User, 'platformRole' | 'mitraRoles'>) {
  return user.platformRole?.role.scope ?? user.mitraRoles[0]?.role.scope ?? 'PLATFORM';
}

export function getAssignableRoleOptions(role?: string | null) {
  switch (normalizeRole(role)) {
    case 'SUPER_ADMIN':
      return USER_ROLE_OPTIONS;

    case 'ADMIN':
      return USER_ROLE_OPTIONS.filter((option) => option.value !== 'SUPER_ADMIN' && option.value !== 'ADMIN');

    default:
      return [];
  }
}
export const getScopeByRole = (role?: string | null) => {
  return USER_ROLE_OPTIONS.find((item) => item.value === normalizeRole(role))?.scope ?? 'MITRA';
};
export function getRoleFilterOptions(role?: string | null) {
  return [ROLE_FILTER_ALL_OPTION, ...getAssignableRoleOptions(role)] as const;
}

export function canManageRole(currentUserRole?: string | null, targetRole?: RoleUser | null) {
  if (!targetRole) return false;

  return getAssignableRoleOptions(currentUserRole).some((option) => option.value === targetRole);
}

export function filterUsersByManageableRoles<T extends Pick<User, 'platformRole' | 'mitraRoles'>>(users: T[], currentUserRole?: string | null) {
  return users.filter((user) => canManageRole(currentUserRole, getUserRole(user)));
}

export const statusFilterOptions = [
  { label: 'Semua status', value: 'all' },
  { label: 'Aktif', value: 'ACTIVE' },
  { label: 'Ditangguhkan', value: 'SUSPENDED' },
  { label: 'Diblokir', value: 'BANNED' },
] as const;

export const UserFilterOptions = [
  { label: 'Semua', value: 'all' },
  { label: 'Tersedia', value: 'available' },
  { label: 'Terhapus', value: 'deleted' },
] as const;
export const UserScopeOptions = [
  { label: 'Platform', value: 'PLATFORM' },
  { label: 'Mitra', value: 'MITRA' },
] as const;
export function formatRole(role: RoleUser) {
  return role
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatStatus(status: User['status']) {
  switch (status) {
    case 'ACTIVE':
      return 'Aktif';
    case 'SUSPENDED':
      return 'Ditangguhkan';
    case 'BANNED':
      return 'Diblokir';
    default:
      return status;
  }
}

export function getStatusVariant(status: User['status']): 'success' | 'warning' | 'error' | 'outline' {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'SUSPENDED':
      return 'warning';
    case 'BANNED':
      return 'error';
    default:
      return 'outline';
  }
}

type DateInput = string | Date | null | undefined;

function toDate(value: DateInput): Date | null {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);
  return isNaN(date.getTime()) ? null : date;
}

export function formatDateTime(value: DateInput, options?: Intl.DateTimeFormatOptions) {
  const date = toDate(value);
  if (!date) return '-';

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',

    ...options,
  }).format(date);
}

export function formatDate(value: DateInput) {
  return formatDateTime(value, {
    month: 'short',
  });
}

export function formatBooleanLabel(value: boolean) {
  return value ? 'Ya' : 'Tidak';
}
