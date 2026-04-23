import type { BaseType, Role } from '@prisma/client';
import jwt from 'jsonwebtoken';

export interface AccessTokenPayload {
    id: string;
    baseType: BaseType;
    roles: Role[];
}

export function generateAccessToken(
    userId: string,
    baseType: BaseType,
    roles: Role[]
){
    const payload: AccessTokenPayload = { id: userId, baseType, roles };

    return jwt.sign(
        payload,
        process.env.JWT_SECRET as string,
        { expiresIn: '15m' }
    );
}

export function generateRefreshToken(userId: string){
    return jwt.sign(
        { id: userId },
        process.env.JWT_REFRESH_SECRET as string,
        { expiresIn: '7d' }
    );
}