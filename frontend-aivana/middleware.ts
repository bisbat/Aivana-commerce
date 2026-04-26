import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getRoleFromToken } from "./lib/utils/jwt";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const pathname = request.nextUrl.pathname;
  const base_path = process.env.NEXT_PUBLIC_BASE_PATH;
  console.log("Middleware activated for path:", pathname);

  // โซนที่ต้อง login ก่อน
  const protectedPaths = ["/dashboard", "/stores", "/admin", "/ai-search"];

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  // ยังไม่ login แต่พยายามเข้าโซน protected
  if (!token && isProtected) {
    return NextResponse.redirect(new URL(`${base_path}/login`, request.url));
  }

  const role = token ? getRoleFromToken(token) : null;

  // customer พยายามเข้า seller zone
  if (
    role === "customer" &&
    (pathname.startsWith("/dashboard") || pathname.startsWith("/stores"))
  ) {
    return NextResponse.redirect(new URL(`${base_path}/not-seller`, request.url));
  }

  // seller พยายามเข้า admin zone
  if (role === 'seller' && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL(`${base_path}/`, request.url));
  }

  // เฉพาะ admin เท่านั้นที่เข้า admin zone ได้
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL(`${base_path}/`, request.url));
  }

  return NextResponse.next();
}
