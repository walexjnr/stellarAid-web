import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const JWT_HEADER_REGEX = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;

// Simple server-side JWT verification for expiration
function isTokenValid(token: string): boolean {
  try {
    if (!token || !JWT_HEADER_REGEX.test(token)) {
      return false;
    }
    const payloadSegment = token.split('.')[1];
    if (!payloadSegment) {
      return false;
    }
    // Base64URL decode
    const base64 = payloadSegment.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = atob(base64);
    const payload = JSON.parse(jsonPayload);
    const currentTime = Date.now() / 1000;

    // Check if exp claim exists and is in the future
    return typeof payload.exp === 'number' && payload.exp > currentTime;
  } catch (error) {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname, search } = request.nextUrl;

  // Check if target is a protected route
  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/campaigns/create') ||
    pathname.startsWith('/profile');

  if (isProtectedRoute) {
    if (!token || !isTokenValid(token)) {
      const redirectUrl = encodeURIComponent(pathname + search);
      const url = request.nextUrl.clone();
      url.pathname = '/connect';
      url.search = `?redirect=${redirectUrl}`;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/campaigns/create',
    '/campaigns/create/:path*',
    '/profile',
    '/profile/:path*',
  ],
};
