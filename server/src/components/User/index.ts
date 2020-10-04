import { Router } from 'express';
import { protect } from '../../middlewares/auth';
import {
  getProfile,
  getUsers,
  login,
  register,
  updateProfile
} from './usersController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile/:name', protect, getProfile);
router.get('/getUser', getUsers);
router.put('/updateProfile', protect, updateProfile);

export default router;
