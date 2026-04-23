export const USER_BASE_TYPES = ["GUEST", "CONTRIBUTOR"] as const;

export type UserBaseTypes = (typeof USER_BASE_TYPES)[number];

export function getBaseTypesLabel(baseType?: string) {
    if (baseType === "CONTRIBUTOR") return "Colaborador";
    if (baseType === "GUEST") return "Visitante";
    return "Usuário"; // fallback para undefined ou valor desconhecido
}

export const USER_ROLES = ["REVIEWER", "AUTHOR", "CHIEF_EDITOR", "SUBSCRIBER"]

export type UserRoles = (typeof USER_ROLES)[number];

export function getRolesLabel(roles?: string[]): string[] {
    if (!roles || roles.length === 0) return ["Usuário"];
  
    return roles.map((role) => {
      if (role === "REVIEWER") return "Avaliador";
      if (role === "AUTHOR") return "Autor";
      if (role === "CHIEF_EDITOR") return "Editor Chefe";
      if (role === "SUBSCRIBER") return "Assinante";
  
      return "Usuário";
    });
  }