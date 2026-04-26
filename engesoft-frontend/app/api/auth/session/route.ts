import { getApiBaseUrl } from "@/lib/api-base-url";
import { ENGESOFT_ROLES_COOKIE, rolesCookieValue } from "@/lib/auth-session";
import type { AuthUser } from "@/types/auth-user";
import { NextResponse } from "next/server";

const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "JSON inválido" }, { status: 400 });
  }

  const token =
    body &&
    typeof body === "object" &&
    "token" in body &&
    typeof (body as { token: unknown }).token === "string"
      ? (body as { token: string }).token
      : null;

  if (!token?.trim()) {
    return NextResponse.json({ message: "Token obrigatório" }, { status: 400 });
  }

  const apiUrl = getApiBaseUrl();
  let user: AuthUser;
  try {
    const res = await fetch(`${apiUrl}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const data: unknown = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        {
          message:
            data &&
            typeof data === "object" &&
            "message" in data &&
            typeof (data as { message: unknown }).message === "string"
              ? (data as { message: string }).message
              : "Sessão inválida",
        },
        { status: 401 },
      );
    }

    user = data as AuthUser;
  } catch {
    return NextResponse.json(
      { message: "Não foi possível validar a sessão" },
      { status: 502 },
    );
  }

  const roles = Array.isArray(user.roles) ? user.roles : [];
  const value = rolesCookieValue(roles);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ENGESOFT_ROLES_COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return response;
}
