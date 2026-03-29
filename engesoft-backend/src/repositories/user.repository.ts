import { prisma } from '../prisma/client'

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
    }
} 