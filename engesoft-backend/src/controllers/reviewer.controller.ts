import { Prisma } from '@prisma/client';
import type { Request, Response } from 'express';
import { ConflictError } from '../errors/conflict.error';
import { NotFoundError } from '../errors/not-found.error';
import { registerReviewerSchema } from '../schemas/reviewer.schema';
import { reviewerService } from '../services/reviewer.service';

export const reviewerController = {
    async register(req: Request, res: Response) {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Não autenticado.' });
        }

        const parsed = registerReviewerSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: 'Dados inválidos',
                errors: parsed.error.flatten().fieldErrors,
            });
        }

        try {
            const reviewer = await reviewerService.register(userId, parsed.data);
            return res.status(201).json(reviewer);
        } catch (err) {
            if (err instanceof NotFoundError) {
                return res.status(404).json({ message: err.message });
            }
            if (err instanceof ConflictError) {
                return res.status(409).json({ message: err.message });
            }
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
                return res.status(409).json({ message: 'Avaliador já cadastrado para este usuário.' });
            }

            console.error(err);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    },
};
