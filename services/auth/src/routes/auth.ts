import express from 'express';
import { getMe, socialLogin, testAuth } from '../controllers/auth.js';

const router = express.Router();

/**
 * Route: /api/v1/auth/test
 * Description: Test the auth router
 */
router.get('/test', testAuth);

/**
 * Route: /api/v1/auth/me
 * Description: Get current user profile (requires user ID for now)
 */
router.get('/me', getMe);

/**
 * Route: /api/v1/auth/social-login
 * Description: Social login/register
 */
router.post('/social-login', socialLogin);

export default router;
