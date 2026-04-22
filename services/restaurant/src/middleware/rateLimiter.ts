import rateLimit from 'express-rate-limit';

//  Login limiter (strict)
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});

//  Refresh limiter (relaxed)
export const refreshLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: 'Too many requests, please try again later',
});