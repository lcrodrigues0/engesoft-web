import { apiFetch } from "@/lib/api";
import { AuthUser } from "@/types/auth-user";

export async function getCurrentUser(): Promise<AuthUser> {
    return await apiFetch("/me");
}