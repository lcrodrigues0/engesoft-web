import bcrypt from 'bcrypt';
import { ConflictError } from '../errors/conflict.error';
import { userRepository } from '../repositories/user.repository';
import type { RegisterUserInput } from '../schemas/user.schema';
import type { AuthUser } from '../types/auth-user';

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

export const userService = {
    async register(input: RegisterUserInput) {
        const email = input.email.toLowerCase();

        const name = input.name;

        const role = input.role;

        const existingEmail = await userRepository.findByEmail(email);
        if (existingEmail) {
            throw new ConflictError('Email já cadastrado');
        }


        const password = await bcrypt.hash(input.password, SALT_ROUNDS);

        return userRepository.create({ name, email, password, role });
    },

    async getAuthUserById(userId: string): Promise<AuthUser | null> {
        return userRepository.findAuthUserById(userId);
    },
};
