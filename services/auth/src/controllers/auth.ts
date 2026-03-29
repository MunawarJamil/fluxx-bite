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

  if (!code) {
    return next(new ErrorResponse('Please provide a Google authorization code', 400));
  }

  try {
    // 1. Exchange the authorization code for tokens
    const { tokens } = await oauth2client.getToken(code);
    oauth2client.setCredentials(tokens);

    // 2. Fetch the user's profile info from Google
    const googleInfo = await google.oauth2('v2').userinfo.get({ auth: oauth2client });
    const { email, name, picture } = googleInfo.data;

    if (!email) {
      return next(new ErrorResponse('Failed to retrieve email from Google', 400));
    }

    // 3. Upsert the user in our database
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if not found
      user = await User.create({
        email,
        name: name || 'Google User',
        image: picture || null,
        googleAccessToken: tokens.access_token || null,
        googleRefreshToken: tokens.refresh_token || null,
        googleTokenExpiry: tokens.expiry_date || null,
      });
    } else {
      // Update user details and tokens if they exist
      if (name) user.name = name;
      if (picture) user.image = picture;
      if (tokens.access_token) user.googleAccessToken = tokens.access_token;
      if (tokens.refresh_token) user.googleRefreshToken = tokens.refresh_token;
      if (tokens.expiry_date) user.googleTokenExpiry = tokens.expiry_date;
      await user.save();
    }

    // 4. Issue an internal JWT
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
  } catch (err: any) {
    console.error('Google Auth Error:', err.response?.data || err.message);
    return next(new ErrorResponse('Google authentication failed', 401));
  }
});
