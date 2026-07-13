import { dashboardAllowedRoles, getAllowedMitraRoles, normalizeRole, normalizeSlug } from '@/features/auth/lib/auth.helper';
import type { MitraRole } from '@/features/auth/types/auth.types';

export const DEFAULT_AUTH_CALLBACK_URL = '/auth-redirect';
export const DEFAULT_LOGIN_CALLBACK_URL = DEFAULT_AUTH_CALLBACK_URL;

export function getSafeCallbackPath(callbackUrl?: string | null) {
  if (!callbackUrl) {
    return DEFAULT_LOGIN_CALLBACK_URL;
  }

  if (callbackUrl.startsWith('/') && !callbackUrl.startsWith('//')) {
    return callbackUrl;
  }

  try {
    const url = new URL(callbackUrl);
    return `${url.pathname}${url.search}${url.hash}` || DEFAULT_LOGIN_CALLBACK_URL;
  } catch {
    return DEFAULT_LOGIN_CALLBACK_URL;
  }
}

export function getDefaultMitraRole(mitraRoles?: MitraRole[] | null, mitraSlug?: string | null) {
  const authorizedMitraRole = getAuthorizedMitraRole(mitraRoles, mitraSlug);

  if (authorizedMitraRole) {
    return authorizedMitraRole;
  }

  return getAllowedMitraRoles(mitraRoles)[0] ?? null;
}

export function getAuthorizedMitraRole(mitraRoles?: MitraRole[] | null, mitraSlug?: string | null) {
  const normalizedSlug = normalizeSlug(mitraSlug);

  if (!normalizedSlug) {
    return null;
  }

  return getAllowedMitraRoles(mitraRoles).find((mitraRole) => normalizeSlug(mitraRole.mitraSlug) === normalizedSlug) ?? null;
}

export function getRoleLandingPath(role?: string | null, mitraRoles?: MitraRole[] | null, mitraSlug?: string | null) {
  const normalizedRole = normalizeRole(role);

  const firstAllowedMitraRole = getDefaultMitraRole(mitraRoles, mitraSlug);

  if (firstAllowedMitraRole?.roleCode === 'AKADEMIK') {
    return `/mitra/admin/${firstAllowedMitraRole.mitraSlug}`;
  }
  if (firstAllowedMitraRole?.mitraSlug) {
    return `/mitra/${firstAllowedMitraRole.mitraSlug}`;
  }
  if (!normalizedRole) {
    return '/';
  }

  return dashboardAllowedRoles.has(normalizedRole) ? '/admin' : '/';
}
