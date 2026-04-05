export const USER_ROLES = ["GUEST", "CONTRIBUTOR"] as const;

export type UserRole = (typeof USER_ROLES)[number];
