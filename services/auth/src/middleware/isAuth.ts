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
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload & { id: string };

      // ✅ 4. Get user (safe)
      const user = await User.findById(decoded.id).select('-refreshToken');

      if (!user) {
        return next(new ErrorResponse('User not found', 404));
      }

      // ✅ 5. Attach user to request
      req.user = user;

      next();
    } catch (err) {
      console.error('Auth error:', err);
      return next(new ErrorResponse('Invalid or expired token', 401));
    }
  }
);