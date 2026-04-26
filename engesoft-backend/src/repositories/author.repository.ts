import { Role } from '@prisma/client';
import { prisma } from '../prisma/client';
import type { RegisterAuthorInput } from '../schemas/author.schema';

export const authorRepository = {
    async findByUserId(userId: string) {
        return prisma.author.findUnique({
            where: { userId },
        });
    },

    async createAndEnsureAuthorRole(
        userId: string,
        currentRoles: Role[],
        data: RegisterAuthorInput,
    ) {
        const roles = currentRoles.includes(Role.AUTHOR)
            ? currentRoles
            : [...currentRoles, Role.AUTHOR];

        return prisma.$transaction(async (tx) => {
            const author = await tx.author.create({
                data: {
                    userId,
                    institutionName: data.institutionName,
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

            return author;
        });
    },
};
