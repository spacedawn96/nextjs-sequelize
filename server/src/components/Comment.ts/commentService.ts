import { Transaction } from 'sequelize/types';
import User from '../User/user';
import Comment from './comments';

interface postData {
  title: string;
  userId: number;
  postId: number;
}

export const getALLComments = async () => {
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

  return comments;
};

export const updateComment = async (
  title: string,
  commentId: number,
  t: Transaction
) => {
  const updateCom = await Comment.update(
    {
      title: title ? title : ''
    },
    {
      where: {
        id: commentId
      },
      transaction: t
    }
  );

  return updateCom;
};

export const findComment = async (comment: number) => {
  const getComment = await Comment.findOne({
    where: {
      id: comment
    },
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['name']
      }
    ]
  });

  return getComment;
};

export const createCom = async (postData: postData) => {
  const newComment = await Comment.create(postData);

  return newComment;
};
