import { MitraRole } from '../types/auth.types';
export const mitraAllowedRoles = new Set(['AKADEMIK', 'GURU', 'MURID', 'WALI_MURID']);
export const dashboardAllowedRoles = new Set(['SUPER_ADMIN', 'ADMIN', 'MENTOR']);

export function normalizeRole(value?: string | null) {
  return value?.toUpperCase() ?? null;
}

export function normalizeSlug(value?: string | null) {
  return value?.trim().toLowerCase() ?? null;
}

export function getAllowedMitraRole(mitraRole?: MitraRole | null) {
  const roleCode = normalizeRole(mitraRole?.roleCode);

  if (!roleCode || !mitraRole?.mitraSlug) {
    return null;
  }

  return mitraAllowedRoles.has(roleCode) ? mitraRole : null;
}
