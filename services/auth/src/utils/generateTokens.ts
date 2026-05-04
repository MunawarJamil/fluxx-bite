import jwt from 'jsonwebtoken';

export const generateTokens = (userId: string, role: string | null) => {
    const accessToken = jwt.sign(
        { id: userId, role, type: 'access' },
        process.env.JWT_ACCESS_SECRET!,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { id: userId, type: 'refresh' },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};