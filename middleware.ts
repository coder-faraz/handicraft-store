// FILE: middleware.ts (root)
import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import type { SessionData } from '@/lib/session';
import { sessionOptions } from '@/lib/session';

/**
 * Protected route patterns:
 * - /admin/* → requires isLoggedIn + role === 'admin'
 * - /account/*, /orders/*, /checkout/* → requires isLoggedIn (any role)
 */

const ADMIN_PREFIX = '/admin';
const CUSTOMER_PREFIXES = ['/account', '/orders', '/checkout'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin routes protection ──────────────────────────────────────────
  if (pathname.startsWith(ADMIN_PREFIX)) {
    const response = NextResponse.next();
    const session = await getIronSession<SessionData>(request, response, sessionOptions);

    if (!session.isLoggedIn) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('reason', 'unauthenticated');
      return NextResponse.redirect(loginUrl);
    }

    if (session.role !== 'admin') {
      // Logged in but not admin → redirect to home with error
      const homeUrl = new URL('/', request.url);
      homeUrl.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(homeUrl);
    }

    return response;
  }

  // ── Customer protected routes ────────────────────────────────────────
  const isCustomerRoute = CUSTOMER_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isCustomerRoute) {
    const response = NextResponse.next();
    const session = await getIronSession<SessionData>(request, response, sessionOptions);

    if (!session.isLoggedIn) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('reason', 'unauthenticated');
      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/account/:path*',
    '/orders/:path*',
    '/checkout/:path*',
  ],
};
