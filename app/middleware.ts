import { NextResponse } from 'next/server';
import { auth } from '@/auth/auth.config';
import { getAuthorizedMitraRole, getDefaultMitraRole, getRoleLandingPath } from '@/auth/redirect';
import { dashboardAllowedRoles } from '@/features/auth/lib/auth.helper';
import { resolveSessionState } from '@/features/auth/api/api';
import { redirect } from 'next/navigation';
import { PermissionCode } from '@/features/admin/types/Admin';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';
export const PagePermission = (profile: AuthProfileResponse | null, permissions: PermissionCode[]) => {
  if (!profile) {
    redirect('/login');
  }

  const isSuperAdmin = profile.insidiaRole === 'SUPER_ADMIN';

  if (isSuperAdmin) {
    return;
  }

  const hasPermission = permissions.some((permission) => profile.permissions.includes(permission));

  if (!hasPermission) {
    redirect(getRoleLandingPath(profile.insidiaRole, profile.mitraRoles));
  }
};
export default auth(async (req) => {
  const { nextUrl } = req;

  const path = nextUrl.pathname;
  const pathSegments = path.split('/');

  const isLoggedIn = !!req.auth?.user && !req.auth?.error;
  const isAuthPage = path.startsWith('/login');
  const isAdminArea = path.startsWith('/admin');
  const isMitraArea = path.startsWith('/mitra');

  const sessionState = isLoggedIn ? await resolveSessionState(req) : null;
  const dbRole = sessionState && typeof sessionState === 'object' ? sessionState.insidiaRole?.toUpperCase() : null;
  const dbMitraRoles = sessionState && typeof sessionState === 'object' ? sessionState.mitraRoles : null;

  const mitraSlug = pathSegments[2];
  const matchedMitraRole = isMitraArea ? getAuthorizedMitraRole(dbMitraRoles, mitraSlug) : null;
  const canonicalMitraPath = matchedMitraRole ? ['/mitra', matchedMitraRole.mitraSlug, ...pathSegments.slice(3)].join('/') : null;

  if (sessionState === 'BANNED' || sessionState === 'UNAUTHORIZED') {
    return NextResponse.redirect(new URL('/force-logout', nextUrl));
  }

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL(getRoleLandingPath(dbRole, dbMitraRoles), nextUrl));
  }

  if (isAdminArea && !isLoggedIn) {
    const url = new URL('/login', nextUrl);
    url.searchParams.set('callbackUrl', nextUrl.pathname + nextUrl.search);

    return NextResponse.redirect(url);
  }

  if (isAdminArea && (!dbRole || !dashboardAllowedRoles.has(dbRole))) {
    const url = new URL('/403', nextUrl);

    url.searchParams.set('from', nextUrl.pathname + nextUrl.search);

    return NextResponse.redirect(url);
  }
  if (isMitraArea && !isLoggedIn) {
    const url = new URL('/login', nextUrl);
    url.searchParams.set('callbackUrl', nextUrl.pathname + nextUrl.search);

    return NextResponse.redirect(url);
  }

  if (isMitraArea && matchedMitraRole && canonicalMitraPath && canonicalMitraPath !== path) {
    const url = new URL(canonicalMitraPath, nextUrl);
    url.search = nextUrl.search;

    return NextResponse.redirect(url);
  }

  if (isMitraArea && !matchedMitraRole) {
    const fallbackMitraRole = getDefaultMitraRole(dbMitraRoles);

    if (fallbackMitraRole) {
      return NextResponse.redirect(new URL(getRoleLandingPath(dbRole, dbMitraRoles), nextUrl));
    }

    const url = new URL('/403', nextUrl);

    url.searchParams.set('from', nextUrl.pathname + nextUrl.search);

    return NextResponse.redirect(url);
  }
  return NextResponse.next();
});

export const config = {
  matcher: ['/login/:path*', '/admin/:path*', '/mitra/:path*'],
};
