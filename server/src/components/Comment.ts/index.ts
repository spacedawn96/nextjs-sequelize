import { Router } from 'express';
import { protect } from '../../middlewares/auth';
import {
  deleteComment,
  editComment,
  getPostCommments,
  postComment
} from './commentController';

const router = Router();

router.get('/getComments', getPostCommments);
router.post('/postComment', protect, postComment);
router.delete('/deleteComment/:userId/:id', protect, deleteComment);
router.put('/editComment/:userId/:commentId', protect, editComment);
