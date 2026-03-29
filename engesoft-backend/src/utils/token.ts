import jwt from  'jsonwebtoken'

export function generateAccessToken(userId: string){
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET as string,
        { expiresIn: '15m' }
    );
}

export function generateRefreshToken(userId: string){
    return jwt.sign(
        { id: userId },
        process.env.JWT_REFRESH_SECRET as string,
        { expiresIn: '7d' }
    );
}