import express from 'express';
import { uploadMedia, getMediaStream } from '../controllers/mediaController.js';
import { protectAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();
router.post('/upload', protectAdmin, upload.single('image'), uploadMedia);
router.get('/:filename', getMediaStream);

export default router;