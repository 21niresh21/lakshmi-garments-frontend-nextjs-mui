import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // 1. Change 'auth' to 'token' to match your LoginPage.tsx
  const token = req.cookies.get("token")?.value;
  const isLoginPage = req.nextUrl.pathname.startsWith("/login");

  // 2. Check if the token exists
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 3. If already logged in, don't let them go back to login page
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/invoice/create", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // This matcher excludes static files and api routes
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
