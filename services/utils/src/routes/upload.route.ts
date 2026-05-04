import { Router } from 'express';
import { uploadToCloudinary } from '../controllers/upload.controller.js';

const router = Router();

// single image upload
router.post('/image', uploadToCloudinary);

export default router;