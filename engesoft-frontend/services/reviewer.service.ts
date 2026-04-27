import { apiFetch } from "@/lib/api";

export interface RegisterReviewerDTO {
  institutionName: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  stateUf: string;
  zipCode: string;
  expertiseAreasIds: string[];
}

export async function registerReviewer(data: RegisterReviewerDTO) {
  return apiFetch("/reviewers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
