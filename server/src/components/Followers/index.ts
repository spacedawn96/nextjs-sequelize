import { Router } from 'express';
import { protect } from '../../middlewares/auth';
import { followUser, unFollowUser } from './followerControlloer';

const router = Router();

router.post('/followUser/:name', protect, followUser);
router.delete('/unfollowUser/:name', protect, unFollowUser);

export default router;
