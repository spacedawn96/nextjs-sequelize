import { Router } from 'express';
import { protect } from '../../middlewares/auth';
import {
  createPost,
  deletePost,
  editPost,
  getPosts,
  postPage
} from './postController';

const router = Router();
router.get('/getPosts', getPosts);
router.get('/postPage/:id', postPage);
router.post('/', protect, createPost);
router.delete('/deletePost/:userId/:id', protect, deletePost);
router.put('/:userId/:postId', protect, editPost);

export default router;
