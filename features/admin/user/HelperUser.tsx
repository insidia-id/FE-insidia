import { RoleUser, User, UserScope } from './types/user.types';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';
export const USER_STATUS_OPTIONS = [
  { label: 'Aktif', value: 'ACTIVE' },
  { label: 'Ditangguhkan', value: 'SUSPENDED' },
  { label: 'Diblokir', value: 'BANNED' },
] as const;

export const USER_ROLE_OPTIONS = [
  { label: 'Super Admin', value: 'SUPER_ADMIN', insidiaRole: 'SUPER_ADMIN', mitraRole: null, scope: 'INSIDIA' },
  { label: 'Admin', value: 'ADMIN', insidiaRole: 'ADMIN', mitraRole: null, scope: 'INSIDIA' },
  { label: 'Mentor', value: 'MENTOR', insidiaRole: 'MENTOR', mitraRole: null, scope: 'INSIDIA' },
  { label: 'User', value: 'USER', insidiaRole: 'USER', mitraRole: null, scope: 'INSIDIA' },
  { label: 'Akademik', value: 'AKADEMIK', insidiaRole: 'USER', mitraRole: 'AKADEMIK', scope: 'MITRA' },
  { label: 'Guru', value: 'GURU', insidiaRole: 'USER', mitraRole: 'GURU', scope: 'MITRA' },
  { label: 'Murid', value: 'MURID', insidiaRole: 'USER', mitraRole: 'MURID', scope: 'MITRA' },
  { label: 'Wali Murid', value: 'WALI_MURID', insidiaRole: 'USER', mitraRole: 'WALI_MURID', scope: 'MITRA' },
] as const;

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
  { label: 'Insidia', value: 'INSIDIA' },
  { label: 'Mitra', value: 'MITRA' },
] as const;

export type UserRoleFormValue = (typeof USER_ROLE_OPTIONS)[number]['value'];

export function getUsersHref(Mitraslug: string | null, path?: string) {
  if (!path) {
    path = '';
  }
  if (Mitraslug) {
    return `/mitra/admin/${Mitraslug}/${path}`;
  }
  return `/admin/${path}`;
}

export function normalizeUserRolePayload(role: string) {
  const option = USER_ROLE_OPTIONS.find((item) => item.value === role);

  return {
    role: option?.value ?? 'USER',
    insidiaRole: option?.insidiaRole ?? 'USER',
    mitraRole: option?.mitraRole ?? null,
    scope: option?.scope ?? 'INSIDIA',
  };
}
const ROLE_FILTER_ALL_OPTION = { label: 'Semua role', value: 'all' } as const;

function normalizeRole(role?: string | null) {
  return role?.toUpperCase() as RoleUser | undefined;
}
export function getUserRole(user?: Pick<User, 'insidiaRole' | 'mitraRoles'> | null, activeScope?: string): RoleUser {
  if (!user) return 'USER';

  if (activeScope === 'MITRA') {
    return (user.mitraRoles?.role?.code as RoleUser) ?? 'USER';
  }

  return (user.insidiaRole?.role?.code as RoleUser) ?? 'USER';
}

export function getUserScope(activeScope: UserScope): UserScope {
  return activeScope;
}

export function getAssignableRoleOptions(role?: string | null) {
  switch (normalizeRole(role)) {
    case 'SUPER_ADMIN':
      return USER_ROLE_OPTIONS;

    case 'ADMIN':
      return USER_ROLE_OPTIONS.filter((option) => option.value !== 'SUPER_ADMIN' && option.value !== 'ADMIN');

    case 'AKADEMIK':
      return USER_ROLE_OPTIONS.filter((option) => ['GURU', 'MURID', 'WALI_MURID', 'USER', 'AKADEMIK'].includes(option.value));
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
const TWO_SCOPE_ROLES = ['SUPER_ADMIN', 'ADMIN'] as const;

export function getAssignableScopeOptions(role?: string | null) {
  const normalizedRole = normalizeRole(role);

  if (TWO_SCOPE_ROLES.includes(normalizedRole as (typeof TWO_SCOPE_ROLES)[number])) {
    return UserScopeOptions;
  }

  if (normalizedRole === 'AKADEMIK') {
    return UserScopeOptions.filter((option) => option.value === 'MITRA');
  }

  const scope = getScopeByRole(normalizedRole);

  return UserScopeOptions.filter((option) => option.value === scope);
}

export function getCurrentUserScope(role?: string | null): UserScope {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === 'AKADEMIK') {
    return 'MITRA';
  }

  if (normalizedRole === 'SUPER_ADMIN' || normalizedRole === 'ADMIN') {
    return 'INSIDIA';
  }

  return getScopeByRole(normalizedRole);
}

export function canManageScope(currentProfile: AuthProfileResponse, targetScope: UserScope) {
  const insidiaRole = normalizeRole(currentProfile.insidiaRole);

  if (insidiaRole === 'SUPER_ADMIN' || insidiaRole === 'ADMIN') {
    return true;
  }

  if (currentProfile.mitraRoles) {
    return targetScope === 'MITRA';
  }

  if (currentProfile.insidiaRole) {
    return targetScope === 'INSIDIA';
  }

  return false;
}
export function filterUsersByManageableRoles<T extends Pick<User, 'insidiaRole' | 'mitraRoles'>>(users: T[], currentUserRole?: string | null, activeScope: UserScope = 'INSIDIA') {
  return users.filter((user) => canManageRole(currentUserRole, getUserRole(user as Pick<User, 'insidiaRole' | 'mitraRoles'>, activeScope)));
}
export function filterUsersByManageableScopes<T>(users: T[], currentProfile: AuthProfileResponse, scope: UserScope) {
  if (!canManageScope(currentProfile, scope)) {
    return [];
  }

  return users;
}
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
