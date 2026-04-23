import { BaseType, Role } from "@prisma/client";

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    baseType: BaseType;
    roles: Role[];
}
