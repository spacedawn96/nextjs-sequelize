import { Router } from 'express';
import { protect } from '../../middlewares/auth';
import { disLikePost, likePost } from './postLikeController';

const router = Router();
router.post('/likePost/:id', protect, likePost);
router.post('/dislikePost/:id', protect, disLikePost);
