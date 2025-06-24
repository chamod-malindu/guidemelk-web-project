import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const PUBLIC_PATHS = [
  '/', 
  '/login', 
  '/register',
  '/verify-email',
  '/verify-reminder',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/verify',
  '/api/auth/resend-verification'
];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // ✅ Public access paths
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // ✅ Allow static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/images')
  ) {
    return NextResponse.next();
  }

  // ✅ Auth check
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const decoded = verifyToken(token);

    // ✅ Unverified users go to verify-reminder
    if (!decoded.emailVerified && pathname !== '/verify-reminder') {
      return NextResponse.redirect(new URL('/verify-reminder', request.url));
    }

    // ✅ Admin route protection
    if (pathname.startsWith('/admin-dashboard') && decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // ✅ Tourist route protection
    if (
      (pathname.startsWith('/tourist-dashboard') ||
       pathname === '/tourist-home') &&
      decoded.role !== 'tourist'
    ) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // ✅ Guide route protection
    if (pathname.startsWith('/guide-dashboard') && decoded.role !== 'guide') {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();

  } catch (error) {
    console.error('Middleware token error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
