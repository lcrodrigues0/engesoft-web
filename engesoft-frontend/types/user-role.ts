export const USER_BASE_TYPES = ["GUEST", "CONTRIBUTOR"] as const;

export type UserBaseTypes = (typeof USER_BASE_TYPES)[number];

export function getBaseTypesLabel(baseType?: string) {
    if (baseType === "CONTRIBUTOR") return "Colaborador";
    if (baseType === "GUEST") return "Assinante";
    return "Usuário"; // fallback para undefined ou valor desconhecido
}