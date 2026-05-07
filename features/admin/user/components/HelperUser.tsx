import { User } from '../types/user.types';
export const USER_STATUS_OPTIONS = [
  { label: 'Aktif', value: 'ACTIVE' },
  { label: 'Ditangguhkan', value: 'SUSPENDED' },
  { label: 'Diblokir', value: 'BANNED' },
] as const;

export const USER_ROLE_OPTIONS = [
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Admin Mentor', value: 'ADMIN_MENTOR' },
  { label: 'Admin Akademik', value: 'ADMIN_AKADEMIK' },
  { label: 'Mentor', value: 'MENTOR' },
  { label: 'Akademik', value: 'AKADEMIK' },
  { label: 'Guru', value: 'GURU' },
  { label: 'Murid', value: 'MURID' },
  { label: 'Wali Murid', value: 'WALI_MURID' },
  { label: 'User Biasa', value: 'USER_BIASA' },
] as const;

export const statusFilterOptions = [
  { label: 'Semua status', value: 'all' },
  { label: 'Aktif', value: 'ACTIVE' },
  { label: 'Ditangguhkan', value: 'SUSPENDED' },
  { label: 'Diblokir', value: 'BANNED' },
] as const;

export const roleFilterOptions = [{ label: 'Semua role', value: 'all' }, ...USER_ROLE_OPTIONS] as const;

export const UserFilterOptions = [
  { label: 'Semua', value: 'all' },
  { label: 'Aktif', value: 'active' },
  { label: 'Dihapus', value: 'deleted' },
] as const;

export function formatRole(role: User['role']) {
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
