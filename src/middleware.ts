import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve auth cookies
  const token = request.cookies.get('auth-token')?.value;
  const role = request.cookies.get('user-role')?.value;
  const status = request.cookies.get('user-status')?.value;

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isWaitingPage = pathname.startsWith('/waiting-approval');
  const isAdminPage = pathname.startsWith('/admin');
  const isUserPage = pathname.startsWith('/dashboard') || pathname.startsWith('/tasks');

  // 1. Not Authenticated
  if (!token) {
    // Redirect all protected pages to login
    if (isAdminPage || isUserPage || isWaitingPage) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // 2. Authenticated (Pending or Approved)
  if (status === 'pending' || status === 'approved' || !status || status !== 'rejected') {
    // Auth pages redirection
    if (isAuthPage) {
      if (role === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Role-based protection
    if (isAdminPage && role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (isUserPage && role !== 'user') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  // 4. Rejected User
  if (status === 'rejected') {
    // Redirect to login (or a custom screen, but login is fine for rejected)
    if (!isAuthPage) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth-token');
      response.cookies.delete('user-role');
      response.cookies.delete('user-status');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
