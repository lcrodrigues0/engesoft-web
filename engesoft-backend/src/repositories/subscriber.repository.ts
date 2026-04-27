import { Role } from '@prisma/client';
import { prisma } from '../prisma/client';
import type { RegisterSubscriberInput } from '../schemas/subscriber.schema';

export const subscriberRepository = {
    async findByUserId(userId: string) {
        return prisma.subscriber.findUnique({
            where: { userId },
        });
    },

    async createAndEnsureSubscriberRole(
        userId: string,
        data: RegisterSubscriberInput,
    ) {
        return prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
                where: { id: userId },
                select: { roles: true },
            });

            const currentRoles = user?.roles ?? [];
            const roles = currentRoles.includes(Role.SUBSCRIBER)
                ? currentRoles
                : [...currentRoles, Role.SUBSCRIBER];

            const subscriber = await tx.subscriber.create({
                data: {
                    userId,
                    subscriberType: data.subscriberType,
                    email: data.email,
                    fullName: data.subscriberType === 'individual' ? data.fullName : null,
                    sex: data.subscriberType === 'individual' ? data.sex : null,
                    birthDate: data.subscriberType === 'individual' ? data.birthDate : null,
                    identityNumber: data.subscriberType === 'individual' ? data.identityNumber : null,
                    cpf: data.subscriberType === 'individual' ? data.cpf : null,
                    corporateName: data.subscriberType === 'corporate' ? data.corporateName : null,
                    cnpj: data.subscriberType === 'corporate' ? data.cnpj : null,
                    contactResponsible: data.subscriberType === 'corporate' ? data.contactResponsible : null,
                    street: data.street,
                    number: data.number,
                    complement: data.complement ?? null,
                    neighborhood: data.neighborhood,
                    city: data.city,
                    stateUf: data.stateUf,
                    zipCode: data.zipCode,
                },
            });

            await tx.user.update({
                where: { id: userId },
                data: { roles },
            });

            return subscriber;
        });
    },
};
