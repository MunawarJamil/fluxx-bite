import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import User, { IUser } from '../models/User.js';

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

export const isAuth = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;

    // ✅ 1. Try to get token from cookies (PRIMARY - production)
    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    // ✅ 2. Fallback to Authorization header (for Postman/testing)
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // ❌ No token
    if (!token) {
      return next(new ErrorResponse('Not authorized, no token', 401));
    }

    try {
      // ✅ 3. Verify token
      const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

      if (!JWT_ACCESS_SECRET) {
        throw new Error('JWT_ACCESS_SECRET is not defined');
      }

      const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as JwtPayload & { id: string };

      if (decoded.type !== 'access') {
        return next(new ErrorResponse('Invalid token type', 401));
      }
      // ✅ 4. Get user (safe)
      const user = await User.findById(decoded.id).select('-refreshToken');

      if (!user) {
        return next(new ErrorResponse('User not found', 404));
      }

      // ✅ 5. Attach user to request
      req.user = user;

      next();
    } catch (err) {
      console.error('Auth error:', (err as Error).message);
      if (err instanceof jwt.TokenExpiredError) {
        return next(new ErrorResponse('Token expired', 401));
      }
    }
  }
);