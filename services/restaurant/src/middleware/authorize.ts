import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './isAuth.js';
import ErrorResponse from '../utils/ErrorResponse.js';

/**
 * Middleware to restrict access to specific roles
 * @param roles - Array of allowed roles or a single role string
 */
export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user?.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
