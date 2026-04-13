import express from 'express';
import { addUserRole, login, logout, myProfile, refreshToken, register, socialLogin, testAuth, updateLocation } from '../controllers/auth.js';
import { isAuth } from '../middleware/isAuth.js';
import { loginLimiter, refreshLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * Route: /api/v1/auth/test
 * Description: Test the auth router
 */
router.get('/test', testAuth);

/**
 * Route: /api/v1/auth/me
 * Description: Get current user profile
 */
router.get('/me', isAuth, myProfile);

/**
 * Route: /api/v1/auth/role
 * Description: Assign role to user
 */
router.put('/role', isAuth, addUserRole);
router.patch('/location', isAuth, updateLocation);

router.post('/register', register);
router.post('/login', loginLimiter, login);
router.post('/social-login', socialLogin);
router.post('/refresh-token', refreshLimiter, refreshToken);
router.post('/logout', isAuth, logout);

export default router;
