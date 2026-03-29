import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import User, { IUser } from '../models/User.js';

/**
 * Interface to extend Express Request with user property
 */
export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

/**
 * Middleware to authenticate JWT tokens
 * Protects routes and attaches user object to request
 */

export const isAuth = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload & { id: string };

      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new ErrorResponse('User not found', 404));
      }

      req.user = user;

      next();
    } catch (err) {
      console.error('Auth error:', err);
      return next(new ErrorResponse('Invalid or expired token', 401));
    }
  }
);
