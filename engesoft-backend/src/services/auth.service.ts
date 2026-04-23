import { userRepository } from "../repositories/user.repository";
import bcrypt from 'bcrypt'
import { generateAccessToken, generateRefreshToken } from '../utils/token'

export const authService = {
    async login(email: string, password: string){
        const user = await userRepository.findByEmail(email);

        if (!user){
            throw new Error('Invalid credentials');
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch){
            throw new Error('Invalid credentials');
        }

        const accessToken = generateAccessToken(user.id, user.baseType);
        const refreshToken = generateRefreshToken(user.id);

        await userRepository.saveRefreshToken(
            user.id,
            refreshToken
        );

        return {
            accessToken,
            refreshToken
        }
    }
}