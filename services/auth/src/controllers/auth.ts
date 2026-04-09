import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/isAuth.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { oauth2client } from '../config/googleConfig.js';
import { generateTokens } from '../utils/generateTokens.js';
import crypto from 'crypto';
import { log } from 'console';


const isProd = process.env.NODE_ENV === 'production';


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
  });
});

/**
 * @desc    Social Login / Register (Google OAuth2)
 * @route   POST /api/v1/auth/social-login
 * @access  Public
 */
export const socialLogin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.body;

    if (!code || typeof code !== 'string') {
      return next(new ErrorResponse('Invalid Google authorization code', 400));
    }

    // 1. Exchange code for tokens
    let tokens;
    try {
      const response = await oauth2client.getToken(code);
      tokens = response.tokens;
    } catch (err: any) {
      console.error('Google Code Exchange Error:', err.message);
      return next(new ErrorResponse('Google authentication failed', 401));
    }

    if (!tokens.id_token) {
      return next(new ErrorResponse('Google ID token not received', 400));
    }

    // 2. Verify ID token
    let payload;
    try {
      const ticket = await oauth2client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID as string,
      });
      payload = ticket.getPayload();

    } catch (err: any) {
      console.error('Google ID Token Verify Error:', err.message);
      console.log(payload);
      return next(new ErrorResponse('Google authentication failed', 401));
    }

    if (!payload || !payload.email) {
      return next(new ErrorResponse('Failed to retrieve user info from Google', 400));
    }

    if (!payload.email_verified) {
      return next(new ErrorResponse('Google email is not verified', 400));
    }

    const { email, name, picture, sub } = payload;

    // 3. Find or create user
    let user = await User.findOne({
      $or: [{ email }, { providerId: sub }],
    });

    if (!user) {
      user = new User({
        email,
        name: name || 'Google User',
        image: picture || null,
        provider: 'google',
        providerId: sub,
      });
    } else {
      // Safe updates (no overwriting with bad values)
      if (name) user.name = name;
      if (picture) user.image = picture;

      // Link provider only if not already linked
      if (!user.providerId) {
        user.provider = 'google';
        user.providerId = sub;
      }
    }

    // 4. Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id.toString());

    // 5. Hash refresh token before saving (SECURITY)
    const hashedRefreshToken = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    user.refreshToken = hashedRefreshToken;

    // 6. Save user once
    await user.save();

    // 7. Set cookies

    res.cookie('accessToken', accessToken, {
      httpOnly: false,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 min
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: false,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 8. Send safe user
    const safeUser = {
      id: user._id,
      email: user.email,
      name: user.name,
      image: user.image,
      role: user.role,
    };

    return res.status(200).json({
      success: true,
      data: safeUser,
    });
  }
);

/**
 * @desc    Register user (Email/Password)
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return next(new ErrorResponse('Please provide name, email and password', 400));
    }

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ErrorResponse('User already exists', 400));
    }

    // 2. Create user (password is hashed in pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer',
      provider: 'local',
    });

    // 3. Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id.toString());

    // 4. Hash refresh token before saving (SECURITY)
    const hashedRefreshToken = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    user.refreshToken = hashedRefreshToken;
    await user.save();

    // 5. Set cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: false,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: false,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  }
);

/**
 * @desc    Login user (Email/Password)
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorResponse('Please provide email and password', 400));
    }

    // 1. Check for user (include password)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // 2. Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // 3. Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id.toString());

    // 4. Hash refresh token (SECURITY)
    const hashedRefreshToken = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    user.refreshToken = hashedRefreshToken;
    await user.save();

    // 5. Set cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: false,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: false,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    });
  }
);

// routes/auth.ts
export const refreshToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return next(new ErrorResponse('No refresh token', 401));
  }

  // ✅ hash incoming token
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');


  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET!
    ) as { id: string; type: string };




    // ✅ Ensure it's refresh token
    if (decoded.type !== 'refresh') {
      return next(new ErrorResponse('Invalid token type', 401));
    }

    // const user = await User.findById(decoded.id).select('+refreshToken');
    const user = await User.findOne({ refreshToken: hashedToken })

    // ❌ Token mismatch (rotation protection)
    if (!user || user.refreshToken !== hashedToken) {
      return next(new ErrorResponse('Refresh token reused or invalid', 401));
    }

    // 🔥 ROTATION STARTS HERE

    //  Generate NEW tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id.toString());


    const hashedNewToken = crypto
      .createHash('sha256')
      .update(newRefreshToken)
      .digest('hex');


    //  Replace old refresh token in DB
    user.refreshToken = hashedNewToken;
    await user.save();

    //  Send new cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: false,
      secure: isProd,
      maxAge: 15 * 60 * 1000,
      sameSite: 'lax',
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: false,
      secure: isProd,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    res.json({ success: true });

  } catch (err) {
    return next(new ErrorResponse('Invalid or expired refresh token', 401));
  }
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET!
      ) as { id: string };

      const user = await User.findById(decoded.id).select('+refreshToken');

      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    } catch (err) {
      console.error('Logout error:', (err as Error).message);
    }
  }

  res.clearCookie('accessToken', {
    httpOnly: false,
    secure: isProd,
    sameSite: 'lax',
  });

  res.clearCookie('refreshToken', {
    httpOnly: false,
    sameSite: 'lax',
  });

  res.json({ success: true });
});

