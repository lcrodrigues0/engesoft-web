import { apiFetch } from "@/lib/api";

export interface RegisterAuthorDTO {
  institutionName: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  stateUf: string;
  zipCode: string;
}

export interface AuthorProfileDTO {
  id: string;
  userId: string;
  institutionName: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  stateUf: string;
  zipCode: string;
}

export async function registerAuthor(data: RegisterAuthorDTO) {
  return apiFetch("/authors", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getMyAuthorProfile(): Promise<AuthorProfileDTO> {
  return apiFetch("/authors/me");
}
