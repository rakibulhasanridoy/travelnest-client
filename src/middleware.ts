import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/dashboard", "/dashboard/add-package", "/dashboard/manage-packages",
                   "/dashboard/my-bookings", "/dashboard/profile"];
const AUTH_ONLY = ["/login", "/register"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth_token")?.value;

  const isProtected = PROTECTED.some((r) => pathname.startsWith(r));
  const isAuthPage  = AUTH_ONLY.some((r) => pathname.startsWith(r));

  if (isProtected && !token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
