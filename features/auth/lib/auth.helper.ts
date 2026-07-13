import type { MitraRole } from '@/features/auth/types/auth.types';

export const mitraAllowedRoles = new Set(['AKADEMIK', 'GURU', 'MURID', 'WALI_MURID']);
export const dashboardAllowedRoles = new Set(['SUPER_ADMIN', 'ADMIN', 'MENTOR']);

export function normalizeRole(value?: string | null) {
  return value?.toUpperCase() ?? null;
}

export function normalizeSlug(value?: string | null) {
  return value?.trim().toLowerCase() ?? null;
}

export function isAllowedMitraRole(roleCode?: string | null) {
  const normalizedRole = normalizeRole(roleCode);
  return normalizedRole ? mitraAllowedRoles.has(normalizedRole) : false;
}

export function getAllowedMitraRoles(mitraRoles?: MitraRole[] | null) {
  if (!mitraRoles?.length) {
    return [];
  }

  return mitraRoles.filter((mitraRole) => isAllowedMitraRole(mitraRole.roleCode));
}
