import { ConflictError } from '../errors/conflict.error';
import { NotFoundError } from '../errors/not-found.error';
import { authorRepository } from '../repositories/author.repository';
import { userRepository } from '../repositories/user.repository';
import type { RegisterAuthorInput } from '../schemas/author.schema';

export const authorService = {
    async register(userId: string, input: RegisterAuthorInput) {
        const user = await userRepository.findById(userId);

        if (!user) {
            throw new NotFoundError('Usuário não encontrado.');
        }

        const existingAuthor = await authorRepository.findByUserId(userId);
        if (existingAuthor) {
            throw new ConflictError('Autor já cadastrado para este usuário.');
        }

        return authorRepository.createAndEnsureAuthorRole(userId, user.roles, input);
    },
};
