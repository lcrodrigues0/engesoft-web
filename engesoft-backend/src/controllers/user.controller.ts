import type { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { ConflictError } from '../errors/conflict.error';
import { registerUserSchema } from '../schemas/user.schema';
import { userService } from '../services/user.service';

export const userController = {
    async register(req: Request, res: Response) {
        const parsed = registerUserSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: 'Dados inválidos',
                errors: parsed.error.flatten().fieldErrors,
            });
        }

        try {
            const user = await userService.register(parsed.data);
            return res.status(201).json(user);
        } catch (err) {
            if (err instanceof ConflictError) {
                return res.status(409).json({ message: err.message });
            }
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
                return res.status(409).json({ message: 'Email já cadastrado.' });
            }
            console.error(err);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    },

    async me(req: Request, res: Response) {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Não autenticado.' });
        }

        try {
            const user = await userService.getAuthUserById(userId);

            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado.' });
            }

            return res.status(200).json(user);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    },
};
