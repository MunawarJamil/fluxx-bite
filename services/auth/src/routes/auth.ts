import express from 'express';
import { addUserRole, myProfile, socialLogin, testAuth } from '../controllers/auth.js';
import { isAuth } from '../middleware/isAuth.js';

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
router.get('/my-profile', isAuth, myProfile);

/**
 * Route: /api/v1/auth/role
 * Description: Assign role to user
 */
router.put('/role', isAuth, addUserRole);

/**
 * Route: /api/v1/auth/social-login
 * Description: Social login/register
 */
router.post('/social-login', socialLogin);

export default router;
