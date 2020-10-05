import { Request, Response, NextFunction, RequestHandler } from 'express';
import ErrorResponse from 'src/utils/errorHandle';
import sequelize from '../../db/index';
import asyncHandler from '../../middlewares/asyncHandler';
import Post from '../Post/post';
import User from '../User/user';
import PostLike from './postLike';
import { isPostLike, PostLiked } from './postLikeService';

export const likePost: RequestHandler = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    let currentUser: number;
    currentUser = req.user.id;

    const created = await PostLiked(currentUser, req.params.id);
    const post = await isPostLike(req.params.id);
    if (!post) {
      throw next(new ErrorResponse(`there is no post liked`, 200));
    }

    let transaction;
    try {
      transaction = await sequelize.transaction();
      if (created && post) {
        throw next(
          new ErrorResponse(`Something went wrong, please refresh`, 500)
        );
      }
      if (!created && post) {
        await PostLike.create(
          {
            userId: currentUser,
            resourceId: req.params.id
          },
          { transaction }
        );
        post.increment('likeCounts', { by: 1, transaction });

        const likes = await PostLike.findAll();
        if (likes.length == 0) {
          post.setDataValue('likedByMe', true);
        }
        if (likes) {
          likes.forEach((like) => {
            if (like.userId === currentUser) {
              post.setDataValue('likedByMe', true);
            }
          });
        }

        await transaction.commit();

        return res.status(200).json({
          message: 'You liked this post',
          post
        });
      }
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      throw next(new ErrorResponse(`error!`, 500));
    }
  }
);

export const disLikePost: RequestHandler = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    let currentUser: number;
    currentUser = req.user.id;

    const created = await PostLike.findOne({
      where: {
        userId: currentUser,
        resourceId: req.params.id
      }
    });

    const post = await Post.findOne({
      where: {
        id: req.params.id
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['name']
        },

        {
          model: PostLike
        }
      ]
    });
    if (!post) {
      return res.status(401).json({
        message: 'there is no post to be unliked'
      });
    }

    try {
      const result = await sequelize.transaction(async (t) => {
        if (!created && post) {
          return res.status(500).send({
            message: 'Something went wrong, please refresh'
          });
        }
        if (created && post) {
          await PostLike.destroy({
            where: {
              userId: currentUser,
              resourceId: req.params.id
            },
            transaction: t
          });
          post.decrement('likeCounts', { by: 1, transaction: t });
          const likes = await PostLike.findAll();
          if (likes) {
            likes.forEach((like) => {
              console.log('dislike', like);
              if (like.userId === currentUser) {
                post.setDataValue('likedByMe', false);
              }
            });
          }

          return res.status(200).json({
            message: 'You unliked this post',
            post
          });
        }
      });
    } catch (err) {
      console.log('There was an error', err);
      return res.status(500);
    }
  }
);
