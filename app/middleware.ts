import { NextResponse } from 'next/server';
import { auth } from '@/auth/auth.config';
import { getRoleLandingPath } from '@/auth/redirect';

export default auth((req) => {
  const { nextUrl } = req;
  const path = nextUrl.pathname;

  const isLoggedIn = !!req.auth?.user && !req.auth?.error;
  const role = req.auth?.user?.role;

  const isAuthPage = path.startsWith('/login');
  const isAdminArea = path.startsWith('/admin');
  const isSellerArea = path.startsWith('/seller');

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL(getRoleLandingPath(role), nextUrl));
  }

  if ((isAdminArea || isSellerArea) && !isLoggedIn) {
    const url = new URL('/login', nextUrl);
    url.searchParams.set('callbackUrl', nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(url);
  }

  if (isAdminArea) {
    if (!isLoggedIn) {
      const url = new URL('/login', nextUrl);
      url.searchParams.set('callbackUrl', nextUrl.pathname + nextUrl.search);
      return NextResponse.redirect(url);
    }
    if (role !== 'ADMIN') return NextResponse.redirect(new URL('/403', nextUrl));
  }

  if (isSellerArea && role !== 'SELLER') {
    return NextResponse.redirect(new URL('/403', nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/login/:path*', '/admin/:path*', '/seller/:path*'],
};
