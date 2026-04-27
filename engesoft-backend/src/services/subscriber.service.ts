import { ConflictError } from '../errors/conflict.error';
import { NotFoundError } from '../errors/not-found.error';
import { subscriberRepository } from '../repositories/subscriber.repository';
import { userRepository } from '../repositories/user.repository';
import type { RegisterSubscriberInput } from '../schemas/subscriber.schema';

export const subscriberService = {
    async register(userId: string, input: RegisterSubscriberInput) {
        const user = await userRepository.findById(userId);

        if (!user) {
            throw new NotFoundError('Usuário não encontrado.');
        }

        const existingSubscriber = await subscriberRepository.findByUserId(userId);
        if (existingSubscriber) {
            throw new ConflictError('Assinante já cadastrado para este usuário.');
        }

        return subscriberRepository.createAndEnsureSubscriberRole(userId, input);
    },
};
