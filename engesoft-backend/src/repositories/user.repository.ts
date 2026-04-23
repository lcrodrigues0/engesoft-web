import { prisma } from '../prisma/client'
import { BaseType } from '@prisma/client'

export const userRepository = {
    async findByEmail(email: string){
        return prisma.user.findUnique({
            where: { email }
        })
    },

    async saveRefreshToken(userId: string, token: string){
        return prisma.user.update({
            where: { id: userId},
            data: {
                refreshToken: token
            }
        })
    },

    async create(data: { name: string, email: string; password: string, baseType: BaseType}) {
        return prisma.user.create({
            data,
            select: {
                id: true,
                email: true,
                createdAt: true,
                baseType: true,
            },
        });
    },

    async findAuthUserById(id: string) {
        return prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                baseType: true,
            },
        });
    },
} 