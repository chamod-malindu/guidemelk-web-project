import { NextResponse } from 'next/server';
import { auth } from '@/auth'; // NextAuth
import { verifyToken } from '@/lib/auth'; 

const PUBLIC_PATHS = [
  '/', 
  '/login', 
  '/register',
  '/verify-email',
  '/verify-reminder',
  '/auth/after-google',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/verify',
  '/api/auth/resend-verification',
  '/forgot-password',
  '/reset-password',
  '/api/auth/logout'
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // ✅ Public access paths
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // ✅ Allow NextAuth API routes
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // ✅ Allow static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/icons')
  ) {
    return NextResponse.next();
  }

  // ✅ Check NextAuth session first (for Google users)
  const session = await auth();
  if (session) {
    return NextResponse.next();
  }

  // ✅ Check custom JWT token (for email users)
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

    // ✅ Role-based route protection
    if (pathname.startsWith('/admin-dashboard') && decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (
      (pathname.startsWith('/tourist/dashboard') ||
       pathname === '/tourist/home') &&
      decoded.role !== 'tourist'
    ) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (pathname.startsWith('/guide/dashboard') && decoded.role !== 'guide') {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (pathname === '/login' || pathname === '/register') {
      const dashboardRoute = `/${decoded.role}-dashboard`;
      return NextResponse.redirect(new URL(dashboardRoute, request.url));
    } 

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware token error:', error);

    
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    });
    
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|images|icons|api/auth).*)',
    '/api/auth/(.*)'
  ]
};