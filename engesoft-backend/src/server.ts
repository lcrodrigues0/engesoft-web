import express from 'express';
import { prisma } from './prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: process.env.FRONT_ORIGIN ?? 'http://localhost:3001',
    credentials:true,
}));

app.use(express.json())


app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        service: 'engesoft-backend',
        message: 'It\'s working!'
    });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verificar se usuário existe
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        // Comparar senha
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Senha inválida' });
        }

        // Gerar token JWT
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );

        // Retornar token
        return res.json({
            message: 'Login realizado com sucesso',
            token
        });

    } catch (error) {
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

app.listen(3000, () => {
    console.log('Server running');
});

