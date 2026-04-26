import { ENGESOFT_ROLES_COOKIE, cookieHasAuthorRole } from "@/lib/auth-session";
import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const raw = request.cookies.get(ENGESOFT_ROLES_COOKIE)?.value;

  if (raw !== undefined && !cookieHasAuthorRole(raw)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/articles/:path*"],
};
