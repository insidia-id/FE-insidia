import { NextResponse } from 'next/server';
import { auth } from '@/auth/auth.config';
import { getRoleLandingPath } from '@/auth/redirect';
const dashboardAllowedRoles = new Set(['SUPER_ADMIN', 'ADMIN', 'MENTOR']);

export default auth((req) => {
  const { nextUrl } = req;
  const path = nextUrl.pathname;
  const isLoggedIn = !!req.auth?.user && !req.auth?.error;
  const role = req.auth?.user?.role?.toUpperCase();

  const isAuthPage = path.startsWith('/login');
  const isAdminArea = path.startsWith('/admin');

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL(getRoleLandingPath(role), nextUrl));
  }

  if (isAdminArea && !isLoggedIn) {
    const url = new URL('/login', nextUrl);
    url.searchParams.set('callbackUrl', nextUrl.pathname + nextUrl.search);

    return NextResponse.redirect(url);
  }

  if (isAdminArea && (!role || !dashboardAllowedRoles.has(role))) {
    const url = new URL('/403', nextUrl);

    url.searchParams.set('from', nextUrl.pathname + nextUrl.search);

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/login/:path*', '/admin/:path*'],
};
