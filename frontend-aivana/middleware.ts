import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getRoleFromToken } from './lib/utils/jwt';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const pathname = request.nextUrl.pathname;
  console.log('Middleware activated for path:', pathname);

  // โซนที่ต้อง login ก่อน
  const protectedPaths = ['/dashboard', '/stores', '/admin'];

  const isProtected = protectedPaths.some((p) =>
    pathname.startsWith(p)
  );

  // ยังไม่ login แต่พยายามเข้าโซน protected
  if (!token && isProtected) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const role = token ? getRoleFromToken(token) : null;

  // customer พยายามเข้า seller zone
  if (
    role === 'customer' &&
    (pathname.startsWith('/dashboard') || pathname.startsWith('/stores'))
  ) {
    return NextResponse.redirect(new URL('/not-seller', request.url));
  }

  // seller พยายามเข้า admin zone
  if (role === 'seller' && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}
