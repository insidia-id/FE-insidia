import { PermissionCode } from '../types/Admin';
import { InsidiaRole, MitraRole, RoleUser, User, UserMitraAssignment, UserMitraRoleRelation, UserProfileForm, UserRoleCode, UserScope } from './types/user.types';
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
export const USER_ROLE_VALUES = USER_ROLE_OPTIONS.map((option) => option.value);

export const USER_MITRA_ROLE_VALUES = USER_ROLE_OPTIONS.filter((option) => option.scope === 'MITRA').map((option) => option.value as MitraRole);

export type UserRoleFormValue = (typeof USER_ROLE_OPTIONS)[number]['value'];

export function getUsersHref(Mitraslug: string | null, path?: string, role?: UserRoleCode | null) {
  if (!path) {
    path = '';
  }
  if (Mitraslug) {
    if (role && role.toUpperCase() !== 'AKADEMIK') {
      return `/mitra/${Mitraslug}/${path}`;
    }
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

const ROLE_FILTER_ALL_OPTION = { label: 'Semua role', value: 'ALL' } as const;

function normalizeRole(role?: string | null) {
  return role?.toUpperCase() as RoleUser | null;
}

export function isRoleUser(value: unknown): value is RoleUser {
  return typeof value === 'string' && USER_ROLE_VALUES.includes(value as UserRoleFormValue);
}

export function isMitraRole(value: unknown): value is MitraRole {
  return typeof value === 'string' && USER_MITRA_ROLE_VALUES.includes(value as MitraRole);
}

export function normalizeRoleQueryParam(role?: string | null): RoleUser | undefined {
  if (!role) {
    return undefined;
  }

  const normalizedRole = normalizeRole(role);

  if (!normalizedRole || normalizedRole === 'ALL') {
    return undefined;
  }

  return isRoleUser(normalizedRole) ? normalizedRole : undefined;
}

export function normalizeScopeQueryParam(scope?: string | null): UserScope | undefined {
  if (scope === 'INSIDIA' || scope === 'MITRA') {
    return scope;
  }

  return undefined;
}

export function getPrimaryUserMitraRole(user?: Pick<User, 'mitraRoles'> | null) {
  return user?.mitraRoles?.[0] ?? null;
}

export function getUserRole(user?: Pick<User, 'insidiaRole' | 'mitraRoles'> | null, activeScope?: string): RoleUser {
  if (!user) return 'USER';

  if (activeScope === 'MITRA') {
    return (getPrimaryUserMitraRole(user)?.roleCode as RoleUser) ?? 'USER';
  }

  return (user.insidiaRole?.role?.code as RoleUser) ?? 'USER';
}

export function getUserScope(activeScope: UserScope): UserScope {
  return activeScope;
}

export const createProfileByRole = (role: MitraRole): UserProfileForm => {
  switch (role) {
    case 'MURID':
      return {
        nis: '',
        kelas: '',
        jurusan: '',
        waliId: '',
      };

    case 'GURU':
      return {
        nip: '',
        subject: '',
      };

    case 'AKADEMIK':
      return {
        position: '',
        division: '',
        note: '',
      };

    case 'WALI_MURID':
      return {
        pekerjaan: '',
        alamat: '',
      };

    default:
      return {};
  }
};

export function getAssignableRoleOptions(role?: string | null, scope?: UserScope) {
  const normalizedRole = normalizeRole(role);

  const optionsByScope = scope ? USER_ROLE_OPTIONS.filter((option) => option.scope === scope) : USER_ROLE_OPTIONS;
  switch (normalizedRole) {
    case 'SUPER_ADMIN':
      return optionsByScope;

    case 'ADMIN':
      return optionsByScope.filter((option) => option.value !== 'SUPER_ADMIN' && option.value !== 'ADMIN');

    case 'AKADEMIK':
      return optionsByScope.filter((option) => ['GURU', 'MURID', 'WALI_MURID', 'USER', 'AKADEMIK'].includes(option.value));

    default:
      return [];
  }
}

export const getScopeByRole = (role?: string | null) => {
  return USER_ROLE_OPTIONS.find((item) => item.value === normalizeRole(role))?.scope ?? 'MITRA';
};

export function getRoleFilterOptions(role?: string | null, scope?: UserScope) {
  return [ROLE_FILTER_ALL_OPTION, ...getAssignableRoleOptions(role, scope)] as const;
}

export function canManageRole(currentUserRole?: string | null, targetRole?: RoleUser | null, scope?: UserScope) {
  if (!targetRole) return false;

  return getAssignableRoleOptions(currentUserRole, scope).some((option) => option.value === targetRole);
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

  if (currentProfile.mitraRoles?.length) {
    return targetScope === 'MITRA';
  }

  if (currentProfile.insidiaRole) {
    return targetScope === 'INSIDIA';
  }

  return false;
}

export function filterUsersByManageableRoles<T extends Pick<User, 'insidiaRole' | 'mitraRoles'>>(users: T[], currentUserRole?: string | null, activeScope: UserScope = 'INSIDIA') {
  return users.filter((user) => canManageRole(currentUserRole, getUserRole(user as Pick<User, 'insidiaRole' | 'mitraRoles'>, activeScope), activeScope));
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

export function toUserMitraAssignments(mitraRoles?: UserMitraRoleRelation[] | null): UserMitraAssignment[] {
  if (!mitraRoles?.length) {
    return [];
  }

  return mitraRoles.map((mitraRole) => ({
    mitraId: mitraRole.mitraId,
    mitraName: mitraRole.mitraName ?? '',
    mitraSlug: mitraRole.mitraSlug ?? '',
    roleCode: mitraRole.roleCode,
    profile: {
      nip: mitraRole.profile?.nip ?? '',
      subject: mitraRole.profile?.subject ?? '',
      bio: mitraRole.profile?.bio ?? '',
      nis: mitraRole.profile?.nis ?? '',
      kelas: mitraRole.profile?.kelas ?? '',
      jurusan: mitraRole.profile?.jurusan ?? '',
      waliId: mitraRole.profile?.waliId ?? '',
      pekerjaan: mitraRole.profile?.pekerjaan ?? '',
      alamat: mitraRole.profile?.alamat ?? '',
      position: mitraRole.profile?.position ?? '',
      division: mitraRole.profile?.division ?? '',
      note: mitraRole.profile?.note ?? '',
    },
  }));
}

export function getActiveMitraContext(currentProfile: AuthProfileResponse) {
  const activeMitraId = currentProfile.activeMitraId ?? null;

  const activeMitra = activeMitraId ? (currentProfile.mitraRoles?.find((mitraRole) => mitraRole.mitraId === activeMitraId) ?? null) : null;

  const activeMitraRole: MitraRole | null = activeMitra?.roleCode ?? null;
  const activeMitraSlug: string | null = activeMitra?.mitraSlug ?? null;
  const activeMitraName: string | null = activeMitra?.mitraName ?? null;
  const activeInsidiaRole: InsidiaRole | null = !activeMitraId && currentProfile.insidiaRole ? currentProfile.insidiaRole : null;

  const activeRole: UserRoleCode | null = activeMitraRole ?? activeInsidiaRole;

  return {
    activeMitraId,
    activeMitraRole,
    activeMitraSlug,
    activeMitraName,
    activeInsidiaRole,
    activeRole,
    isMitraContext: Boolean(activeMitraId),
  };
}

export function canManage(currentProfile: AuthProfileResponse, permission: PermissionCode[]) {
  const { activeMitraRole, activeInsidiaRole } = getActiveMitraContext(currentProfile);

  if (activeInsidiaRole === 'SUPER_ADMIN' || activeInsidiaRole === 'ADMIN') {
    return true;
  }

  if (permission.some((p) => currentProfile.permissions.includes(p))) {
    return true;
  }
  return false;
}
