import { ConflictError } from '../errors/conflict.error';
import { NotFoundError } from '../errors/not-found.error';
import { reviewerRepository } from '../repositories/reviewer.repository';
import { userRepository } from '../repositories/user.repository';
import type { RegisterReviewerInput } from '../schemas/reviewer.schema';

export const reviewerService = {
    async register(userId: string, input: RegisterReviewerInput) {
        const user = await userRepository.findById(userId);

        if (!user) {
            throw new NotFoundError('Usuário não encontrado.');
        }

        const existingReviewer = await reviewerRepository.findByUserId(userId);
        if (existingReviewer) {
            throw new ConflictError('Avaliador já cadastrado para este usuário.');
        }

        return reviewerRepository.createAndEnsureReviewerRole(userId, user.roles, input);
    },
};
