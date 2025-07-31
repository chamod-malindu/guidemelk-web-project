import { NextResponse } from 'next/server';
import { auth } from '@/auth'; // NextAuth

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

  // ✅ For protected routes, just check if token exists
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Let the dashboard pages handle the actual token verification
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|images|icons|api/auth).*)',
    '/api/auth/(.*)'
  ]
};