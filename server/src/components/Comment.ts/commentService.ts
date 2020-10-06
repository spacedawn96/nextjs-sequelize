import { Transaction } from 'sequelize/types';
import User from '../User/user';
import Comment from './comments';

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
      returning: true,
      where: {
        id: commentId
      },
      transaction: t
    }
  );

  return updateCom;
};

export const findComment = async () => {};
