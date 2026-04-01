import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/isAuth.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { google } from 'googleapis';
import { oauth2client } from '../config/googleConfig.js';


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
 * @desc    Get current user profile
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const myProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    data: user,
  });
});

const allowedRoles = ['customer', 'rider', 'seller'] as const;
type Role = (typeof allowedRoles)[number];


export const addUserRole = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user?._id) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  const { role } = req.body as { role: Role };

  if (!role || !allowedRoles.includes(role)) {
    return next(new ErrorResponse('Please provide a valid role (customer, rider, or seller)', 400));
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { role },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '15d',
    }
  );
  res.status(200).json({
    success: true,
    data: user,
    token,
  });
});

/**
 * @desc    Social Login / Register (Google OAuth2)
 * @route   POST /api/v1/auth/social-login
 * @access  Public
 */
export const socialLogin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { code } = req.body;

  if (!code || typeof code !== 'string') {
    return next(new ErrorResponse('Invalid Google authorization code', 400));
  }

  // 1. Exchange code for tokens
  const { tokens } = await oauth2client.getToken(code).catch((err) => {
    console.error('Google Code Exchange Error:', err.message);
    throw new ErrorResponse('Google authentication failed', 401);
  });

  if (!tokens.id_token) {
    return next(new ErrorResponse('Google ID token not received', 400));
  }

  // 2. Verify ID token (CRITICAL SECURITY STEP)
  const ticket = await oauth2client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID as string,
  }).catch((err) => {
    console.error('Google ID Token Verify Error:', err.message);
    throw new ErrorResponse('Google authentication failed', 401);
  });

  const payload = ticket.getPayload();

  if (!payload || !payload.email) {
    return next(new ErrorResponse('Failed to retrieve user info from Google', 400));
  }

  if (!payload.email_verified) {
    return next(new ErrorResponse('Google email is not verified', 400));
  }

  const { email, name, picture, sub } = payload;

  // 3. Find or create user (with provider linking)
  let user = await User.findOne({
    $or: [{ email }, { providerId: sub }],
  });

  if (!user) {
    user = await User.create({
      email,
      name: name || 'Google User',
      image: picture || null,
      provider: 'google',
      providerId: sub,
    });
  } else {
    // Update existing user
    user.name = name || user.name;
    user.image = picture || " ";
    user.provider = 'google';
    user.providerId = sub;

    await user.save();
  }

  // 4. Generate tokens (Access + Refresh)
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET as string,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: '7d' }
  );

  // 5. Set secure cookies
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  // 6. Send safe user data only
  const safeUser = {
    id: user._id,
    email: user.email,
    name: user.name,
    image: user.image,
    role: user.role,
  };

  res.status(200).json({
    success: true,
    data: safeUser,
  });
});
