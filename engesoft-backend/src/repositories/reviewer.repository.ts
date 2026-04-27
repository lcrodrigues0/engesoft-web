import { Role } from '@prisma/client';
import { prisma } from '../prisma/client';
import type { RegisterReviewerInput } from '../schemas/reviewer.schema';

export const reviewerRepository = {
    async findByUserId(userId: string) {
        return prisma.reviewer.findUnique({
            where: { userId },
        });
    },

    async createAndEnsureReviewerRole(
        userId: string,
        currentRoles: Role[],
        data: RegisterReviewerInput,
    ) {
        const roles = currentRoles.includes(Role.REVIEWER)
            ? currentRoles
            : [...currentRoles, Role.REVIEWER];

        return prisma.$transaction(async (tx) => {
            const reviewer = await tx.reviewer.create({
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
                    expertiseAreasIds: data.expertiseAreasIds,
                },
            });

            await tx.user.update({
                where: { id: userId },
                data: { roles },
            });

            return reviewer;
        });
    },
};
