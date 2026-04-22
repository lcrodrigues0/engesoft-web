export type SubscriptionProfileType = "individual" | "corporate";
export type SubscriptionStatus = "active" | "paused" | "cancelled";

export type Subscription = {
  id: string;
  profileType: SubscriptionProfileType;
  subscriberName: string;
  email: string;
  shippingAddress: string;
  startedAt: string;
  validUntil: string;
  remainingEditions: number;
  annualPrice: number;
  status: SubscriptionStatus;
};

export const subscriptionStatusLabel: Record<SubscriptionStatus, string> = {
  active: "Ativa",
  paused: "Pausada",
  cancelled: "Cancelada",
};

export const profileTypeLabel: Record<SubscriptionProfileType, string> = {
  individual: "Pessoa física",
  corporate: "Corporativa",
};

export const mockSubscriptions: Subscription[] = [
  {
    id: "ASSIN-2026-0041",
    profileType: "individual",
    subscriberName: "Carla Menezes",
    email: "carla.menezes@email.com",
    shippingAddress: "Rua das Flores, 120, Centro - Curitiba/PR, 80000-000",
    startedAt: "2026-01-15T00:00:00.000Z",
    validUntil: "2027-01-14T23:59:59.000Z",
    remainingEditions: 9,
    annualPrice: 890,
    status: "active",
  },
  {
    id: "ASSIN-2025-0107",
    profileType: "corporate",
    subscriberName: "TechNova Soluções Ltda",
    email: "biblioteca@technova.com.br",
    shippingAddress: "Av. Paulista, 1500, Bela Vista - São Paulo/SP, 01310-200",
    startedAt: "2025-10-01T00:00:00.000Z",
    validUntil: "2026-09-30T23:59:59.000Z",
    remainingEditions: 0,
    annualPrice: 890,
    status: "cancelled",
  },
  {
    id: "ASSIN-2026-0022",
    profileType: "corporate",
    subscriberName: "Instituto Horizonte de Tecnologia",
    email: "assinaturas@horizonte.org.br",
    shippingAddress: "Rua do Porto, 88, Recife Antigo - Recife/PE, 50030-230",
    startedAt: "2026-02-03T00:00:00.000Z",
    validUntil: "2027-02-02T23:59:59.000Z",
    remainingEditions: 11,
    annualPrice: 890,
    status: "paused",
  },
];

export function formatSubscriptionDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

export function formatPriceBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
}
