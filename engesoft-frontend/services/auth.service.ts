import { setAuthToken, clearAuthToken } from "@/lib/auth-token";
import { apiFetch } from "@/lib/api";
import type { UserBaseTypes } from "@/types/user-role";

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  baseType: UserBaseTypes;
}

export async function login(
  email: string,
  password: string,
  rememberMe = true,
) {
  const data = await apiFetch("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  setAuthToken(data.token, rememberMe);

  return data;
}

export function logout() {
  clearAuthToken();
}

export async function register(data: RegisterDTO){
  const result = await apiFetch('/register', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
  })

  return result;

}