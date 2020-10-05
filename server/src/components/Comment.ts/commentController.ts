import { Request, Response, NextFunction, RequestHandler } from 'express';
import sequelize from '../../db';
import asyncHandler from '../../middlewares/asyncHandler';
import ErrorResponse from '../../utils/errorHandle';
import User from '../User/user';
import Comment from './comments';

export const getPostCommments: RequestHandler = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const comments = await Comment.findAll({
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    return res.json(comments);
  }
);

export const editComment: RequestHandler = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    let currentUser;
    let transaction;
    currentUser = req.user.id;

    if (req.params.userId != currentUser) {
      throw next(new ErrorResponse(`Can't edit another users post`, 401));
    } else {
      try {
        transaction = await sequelize.transaction();
        return Comment.update(
          {
            title: req.body.title ? req.body.title : ''
          },
          {
            returning: true,
            where: {
              id: req.params.commentId
            }
          }
        ).then((comments) => {
          return res.status(200).send({
            message: 'Comment Edited Successfully',
            comments
          });
        });
      } catch (err) {
        throw next(new ErrorResponse('error!', 401));
      }
    }
  }
);

export const postComment: RequestHandler = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const currentUser = req.user.id;

    const postData = {
      title: req.body.title,
      userId: currentUser,
      postId: req.body.id
    };

    try {
      await Comment.create(postData).then((comment) => {
        Comment.findOne({
          where: {
            id: comment.id
          },
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['name']
            }
          ]
        }).then(async (newComment) => {
          return res.status(200).send({
            message: 'comment created',
            comment: newComment
          });
        });
      });
    } catch (error) {
      throw next(new ErrorResponse('Failed to write a comment', 500));
    }
  }
);

export const deleteComment: RequestHandler = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    let currentUser;
    currentUser = req.user.id;
    if (req.params.userId == currentUser) {
      await Comment.findOne({
        where: {
          id: req.params.id
        }
      }).then(async (result) => {
        return await Comment.destroy({
          where: {
            id: req.params.id
          }
        }).then((a) => {
          return res.status(200).send({
            message: 'delete comment!',
            result
          });
        });
      });
    } else {
      throw next(
        new ErrorResponse(`You can't delete another user comment`, 500)
      );
    }
  }
);
