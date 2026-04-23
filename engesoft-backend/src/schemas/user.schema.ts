import { BaseType } from '@prisma/client';
import { z } from 'zod';

export const registerUserSchema = z.object({
    name: z.string().trim(),
    email: z.string().trim().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    baseType: z.nativeEnum(BaseType).optional().default(BaseType.GUEST),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
