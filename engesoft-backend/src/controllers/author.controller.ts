import { Prisma } from '@prisma/client';
import type { Request, Response } from 'express';
import { ConflictError } from '../errors/conflict.error';
import { NotFoundError } from '../errors/not-found.error';
import { registerAuthorSchema } from '../schemas/author.schema';
import { authorService } from '../services/author.service';

export const authorController = {
    async register(req: Request, res: Response) {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Não autenticado.' });
        }

        const parsed = registerAuthorSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: 'Dados inválidos',
                errors: parsed.error.flatten().fieldErrors,
            });
        }

        try {
            const author = await authorService.register(userId, parsed.data);
            return res.status(201).json(author);
        } catch (err) {
            if (err instanceof NotFoundError) {
                return res.status(404).json({ message: err.message });
            }
            if (err instanceof ConflictError) {
                return res.status(409).json({ message: err.message });
            }
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
                return res.status(409).json({ message: 'Autor já cadastrado para este usuário.' });
            }

            console.error(err);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    },
};
