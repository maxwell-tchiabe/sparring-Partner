import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define routes that do NOT require authentication
  const publicPaths = ['/', '/login', '/signup', '/contact', '/reset-password', '/terms', '/privacy', '/impressum'];
  const isPublicPath = publicPaths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  // Check if the auth cookie exists (set by backend after syncSessionWithBackend)
  const token = request.cookies.get('sb-access-token')?.value;

  // If user is NOT authenticated and trying to access a protected route → redirect to login
  if (!token && !isPublicPath) {
    const loginUrl = new URL('/login', request.url);
    // Preserve the original destination so we can redirect back after login
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user IS authenticated and trying to access login/signup → redirect to dashboard
  if (token && (pathname === '/login' || pathname === '/signup')) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Apply proxy to all routes EXCEPT api routes, static assets, and Next.js internals
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|_vercel|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico|.*\\.webp).*)',
  ],
};
