import {
  ENGESOFT_ROLES_COOKIE,
  cookieHasAuthorRole,
  cookieHasChiefEditorRole,
  cookieHasReviewerRole,
  cookieHasSubscriberRole,
} from "@/lib/auth-session";
import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const raw = request.cookies.get(ENGESOFT_ROLES_COOKIE)?.value;
  const pathname = request.nextUrl.pathname;
  const isPublicPath =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/create-account");

  if (raw === undefined && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/dashboard/articles") && raw !== undefined && !cookieHasAuthorRole(raw)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname.startsWith("/dashboard/reviews") && raw !== undefined && !cookieHasReviewerRole(raw)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname.startsWith("/dashboard/subscriptions") && raw !== undefined && !cookieHasSubscriberRole(raw)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname.startsWith("/dashboard/selections") && raw !== undefined && !cookieHasChiefEditorRole(raw)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};
