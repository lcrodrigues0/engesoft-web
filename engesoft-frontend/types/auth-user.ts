import { UserBaseTypes, UserRoles } from "./user-role"; 

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    baseType: UserBaseTypes;
    roles: UserRoles[]
}