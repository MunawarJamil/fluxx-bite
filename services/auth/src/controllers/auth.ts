import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import User from '../models/User.js';

/**
 * @desc    Test auth endpoint (First Route)
 * @route   GET /api/v1/auth/test
 * @access  Public
 */
export const testAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    data: 'Auth route is working correctly!',
  });
});

/**
 * @desc    Get current user profile (Placeholder for social auth)
 * @route   GET /api/v1/auth/me
 * @access  Private (To be implemented with JWT)
 */
export const getMe = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Mocking identification until JWT middleware is implemented
  const user = await User.findById(req.query.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Social Login / Register (Placeholder)
 * @route   POST /api/v1/auth/social-login
 * @access  Public
 */
export const socialLogin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, name, image, providerId } = req.body;

  if (!email || !name) {
    return next(new ErrorResponse('Please provide email and name', 400));
  }

  // Logic for finding or creating social user would go here
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      email,
      name,
      image,
      role: 'user', // default role
    });
  }

  res.status(200).json({
    success: true,
    data: user,
    token: 'mock_jwt_token_for_now',
  });
});
