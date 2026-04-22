import { Request, Response, NextFunction } from 'express';

/**
 * Higher-order function to wrap async Express routes and automatically pass errors to next()
 * @param fn - Async control function
 * @returns Express RequestHandler
 */
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
