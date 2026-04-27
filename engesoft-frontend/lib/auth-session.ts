import type { UserRoles } from "@/types/user-role";

/** HttpOnly cookie set by POST /api/auth/session after the backend validates the token. */
export const ENGESOFT_ROLES_COOKIE = "engesoft_roles";

export function rolesCookieValue(roles: UserRoles[]): string {
  return roles.join(",");
}

export function parseRolesCookie(raw: string | undefined): UserRoles[] | null {
  if (raw === undefined) return null;
  if (raw === "") return [];
  return raw.split(",").filter(Boolean) as UserRoles[];
}

export function cookieHasAuthorRole(raw: string | undefined): boolean {
  const roles = parseRolesCookie(raw);
  return roles !== null && roles.includes("AUTHOR");
}

export function cookieHasReviewerRole(raw: string | undefined): boolean {
  const roles = parseRolesCookie(raw);
  return roles !== null && roles.includes("REVIEWER");
}

export function cookieHasSubscriberRole(raw: string | undefined): boolean {
  const roles = parseRolesCookie(raw);
  return roles !== null && roles.includes("SUBSCRIBER");
}

export function cookieHasChiefEditorRole(raw: string | undefined): boolean {
  const roles = parseRolesCookie(raw);
  return roles !== null && roles.includes("CHIEF_EDITOR");
}
