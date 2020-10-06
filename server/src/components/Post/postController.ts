import { Request, Response, NextFunction, RequestHandler } from 'express';
import dotenv from 'dotenv';
import asyncHandler from '../../middlewares/asyncHandler';
import Post from './post';
import User from '../User/user';
import PostLike from '../PostLike.ts/postLike';
import Comment from '../Comment.ts/comments';
import ErrorResponse from 'src/utils/errorHandle';
import { getpostPage, Posts, PostCreate, updatePost } from './postService';

export const postPage: RequestHandler = asyncHandler(
  async (req: any, res: Response) => {
    const id = req.params.id;
    const postPage = await getpostPage(id);
    return res.json(postPage);
  }
);

export const getPosts: RequestHandler = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const postPage = await Posts();
    return res.json(postPage);
  }
);

export const createPost: RequestHandler = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    let postData;
    postData = {
      title: req.body.title,
      body: req.body.body,
      userId: req.user.id
    };

    try {
      const getPost = await PostCreate(postData);
      return res.status(200).send({
        message: 'post created',
        getPost
      });
    } catch (e) {
      throw next(new ErrorResponse(`something went to wrong`, 500));
    }
  }
);

export const editPost: RequestHandler = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    let currentUser;
    currentUser = req.user.id;
    const title = req.body.title;
    const body = req.body.body;
    const id = req.params.postId;

    if (req.params.userId != currentUser) {
      throw next(new ErrorResponse(`Can't edit another users post`, 401));
    } else {
      try {
        const update = await updatePost(title, body, id);

        return res.status(200).send({
          message: 'Post Edited Successfully',
          update
        });
      } catch (err) {
        throw next(new ErrorResponse('error!', 401));
      }
    }
  }
);

export const deletePost: RequestHandler = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    let currentUser;
    currentUser = req.user.id;
    if (req.params.userId == currentUser) {
      try {
        await Post.destroy({
          where: {
            id: req.params.id
          }
        });
        return res.status(200).send('Post has been deleted!');
      } catch (error) {
        throw next(new ErrorResponse('Failed to delete', 401));
      }
    } else {
      throw next(new ErrorResponse(`You can't delete another user post`, 500));
    }
  }
);
