import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/ErrorResponse.js';

/**
 * Global error handler middleware to catch all errors and return standardized JSON responses.
 * @param err - Error object
 * @param req - Request object
 * @param res - Response object
 * @param next - Next function
 */
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for developers
  console.error(`[Error Handler]: ${err.stack}`);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with ID: ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val: any) => val.message).join(', ');
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

export default errorHandler;
