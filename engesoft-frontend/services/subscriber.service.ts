import { apiFetch } from "@/lib/api";

type RegisterSubscriberBaseDTO = {
  email: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  stateUf: string;
  zipCode: string;
};

export type RegisterIndividualSubscriberDTO = RegisterSubscriberBaseDTO & {
  subscriberType: "individual";
  fullName: string;
  sex: string;
  birthDate: string;
  identityNumber: string;
  cpf: string;
};

export type RegisterCorporateSubscriberDTO = RegisterSubscriberBaseDTO & {
  subscriberType: "corporate";
  corporateName: string;
  cnpj: string;
  contactResponsible: string;
};

export type RegisterSubscriberDTO =
  | RegisterIndividualSubscriberDTO
  | RegisterCorporateSubscriberDTO;

export async function registerSubscriber(data: RegisterSubscriberDTO) {
  return apiFetch("/subscribers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
