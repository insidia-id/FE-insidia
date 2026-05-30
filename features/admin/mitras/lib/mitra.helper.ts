import type { Mitra, MitraType, MitraVisibilityFilter, StatusMitra } from '../types/mitras.types';

export const MITRA_TYPES = [
  { label: 'Sekolah', value: 'SEKOLAH' },
  { label: 'Kampus', value: 'KAMPUS' },
] as const;

export const MITRA_STATUS_OPTIONS = [
  { label: 'Aktif', value: 'ACTIVE' },
  { label: 'Tidak Aktif', value: 'INACTIVE' },
] as const;

export const MITRA_VISIBILITY_OPTIONS = [
  { label: 'Tersedia', value: 'available' },
  { label: 'Semua', value: 'all' },
  { label: 'Terhapus', value: 'deleted' },
] as const;

export const MITRA_STATUS_FILTER_OPTIONS = [{ label: 'Semua status', value: 'all' }, ...MITRA_STATUS_OPTIONS] as const;

export function formatMitraType(type: MitraType) {
  return MITRA_TYPES.find((item) => item.value === type)?.label ?? type;
}

export function getMitraStatusVariant(status: StatusMitra): 'success' | 'warning' | 'outline' {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'INACTIVE':
      return 'warning';
    default:
      return 'outline';
  }
}

export function formatMitraStatus(status: StatusMitra) {
  switch (status) {
    case 'ACTIVE':
      return 'Aktif';
    case 'INACTIVE':
      return 'Tidak Aktif';
    default:
      return status;
  }
}

type DateInput = string | Date | null | undefined;

function toDate(value: DateInput): Date | null {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatMitraDate(value: DateInput, options?: Intl.DateTimeFormatOptions) {
  const date = toDate(value);

  if (!date) {
    return '-';
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    ...options,
  }).format(date);
}

export function filterMitrasByVisibility(mitras: Mitra[], visibilityFilter: MitraVisibilityFilter) {
  switch (visibilityFilter) {
    case 'deleted':
      return mitras.filter((mitra) => mitra.deletedAt !== null);
    case 'all':
      return mitras;
    default:
      return mitras.filter((mitra) => mitra.deletedAt === null);
  }
}
