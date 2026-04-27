"use client";

import { ExpertiseAreaId } from "@/lib/reviewers/reviewer-expertise-areas";

export type AddressData = {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  stateUf: string;
  zipCode: string;
};

export type AuthorProfileData = {
  institutionName: string;
  address: AddressData;
};

export type ReviewerProfileData = {
  institutionName: string;
  address: AddressData;
  expertiseAreasIds: ExpertiseAreaId[];
};

export type SubscriberProfileData =
  | {
      subscriberType: "individual";
      email: string;
      fullName: string;
      sex: string;
      birthDate: string;
      identityNumber: string;
      cpf: string;
      address: AddressData;
    }
  | {
      subscriberType: "corporate";
      email: string;
      corporateName: string;
      cnpj: string;
      contactResponsible: string;
      address: AddressData;
    };

type CtaProfileStorage = {
  author?: AuthorProfileData;
  reviewer?: ReviewerProfileData;
  subscriber?: SubscriberProfileData;
};

const STORAGE_PREFIX = "engesoft:cta-profile";

function getStorageKey(userId: string): string {
  return `${STORAGE_PREFIX}:${userId}`;
}

function readStorage(userId: string): CtaProfileStorage {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(getStorageKey(userId));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as CtaProfileStorage;
    return parsed ?? {};
  } catch {
    return {};
  }
}

function writeStorage(userId: string, data: CtaProfileStorage): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(getStorageKey(userId), JSON.stringify(data));
}

export function getCtaProfileStorage(userId: string): CtaProfileStorage {
  return readStorage(userId);
}

export function saveAuthorProfileStorage(
  userId: string,
  author: AuthorProfileData,
): void {
  const current = readStorage(userId);
  writeStorage(userId, { ...current, author });
}

export function saveReviewerProfileStorage(
  userId: string,
  reviewer: ReviewerProfileData,
): void {
  const current = readStorage(userId);
  writeStorage(userId, { ...current, reviewer });
}

export function saveSubscriberProfileStorage(
  userId: string,
  subscriber: SubscriberProfileData,
): void {
  const current = readStorage(userId);
  writeStorage(userId, { ...current, subscriber });
}
