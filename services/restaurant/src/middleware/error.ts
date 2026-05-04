import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/ErrorResponse.js';
import config from '../config/index.js';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for developers
  if (config.env === 'development') {
    console.error(`[Error Handler]: ${err.stack}`);
  }

  // Prisma Unique Constraint Violation
  if (err.code === 'P2002') {
    const fields = err.meta?.target || 'fields';
    const message = `Duplicate field value for: ${fields}`;
    error = new ErrorResponse(message, 400);
  }

  // Prisma Record Not Found
  if (err.code === 'P2025') {
    const message = 'Resource not found';
    error = new ErrorResponse(message, 404);
  }

  // Mongoose bad ObjectId (keeping for backward compatibility if mixed)
  if (err.name === 'CastError') {
    const message = `Resource not found with ID: ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Zod Validation error
  if (err.name === 'ZodError') {
    const message = err.issues.map((issue: any) => `${issue.path.join('.')}: ${issue.message}`).join(', ');
    error = new ErrorResponse(message, 400);
  }

  // Generic Validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val: any) => val.message).join(', ');
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    stack: config.env === 'development' ? err.stack : undefined,
  });
};

export default errorHandler;
