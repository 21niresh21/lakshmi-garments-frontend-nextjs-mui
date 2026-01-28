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
    return NextResponse.redirect(new URL("/invoices/create", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // This matcher excludes static files and api routes
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files with extensions: .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
