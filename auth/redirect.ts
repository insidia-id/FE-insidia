import { getAllowedMitraRole, normalizeRole, normalizeSlug, dashboardAllowedRoles } from '@/features/auth/lib/auth.helper';
import { MitraRole } from '@/features/auth/types/auth.types';

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

export function getDefaultMitraRole(mitraRoles?: MitraRole | null) {
  return getAllowedMitraRole(mitraRoles);
}

export function getAuthorizedMitraRole(mitraRoles?: MitraRole | null, slug?: string | null) {
  const normalizedSlug = normalizeSlug(slug);
  const allowedMitraRole = getAllowedMitraRole(mitraRoles);

  if (!normalizedSlug || !allowedMitraRole) {
    return null;
  }

  return normalizeSlug(allowedMitraRole.mitraSlug) === normalizedSlug ? allowedMitraRole : null;
}

export function getRoleLandingPath(role?: string | null, mitraRoles?: MitraRole | null) {
  const normalizedRole = normalizeRole(role);

  const firstAllowedMitraRole = getDefaultMitraRole(mitraRoles);

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
