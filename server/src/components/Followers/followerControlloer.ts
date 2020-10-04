import { Request, Response, NextFunction, RequestHandler } from 'express';
import ErrorResponse from '../../utils/errorHandle';
import asyncHandler from '../../middlewares/asyncHandler';
import sequelize from '../../db';
import User from '../User/user';
import Following from '../Following/following';
import Followers from './followers';

export const followUser: RequestHandler = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    let curUser: number;

    curUser = req.user.id;

    const { name } = req.params;
    if (curUser) {
      try {
        const userToFollow: any = await User.findOne({
          where: { name }
        });
        if (userToFollow.id === curUser) {
          throw next(new ErrorResponse('You can not follow yourself', 500));
        }

        await Following.create({
          following: userToFollow.id,
          userId: curUser
        });

        await Followers.create({
          followerId: curUser,
          userId: userToFollow.id
        });

        const userFound = User.findOne({
          where: {
            id: userToFollow.id
          },
          include: [
            {
              model: Followers,
              as: 'UserFollowers',
              include: [
                {
                  model: User,
                  as: 'followerDetails',
                  attributes: ['name']
                }
              ]
            },
            {
              model: Following,
              as: 'UserFollowings'
            }
          ]
        });

        return res.status(200).send({
          message: `You are now following ${userToFollow.name}`,
          curUser
        });
      } catch (err) {
        throw next(new ErrorResponse('Something went wrong', 500));
      }
    } else {
      throw next(new ErrorResponse('You must be logged in to follow a user', 500));
    }
  }
);
export const unFollowUser: RequestHandler = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    let curUser: number;
    curUser = req.user.id;

    const { name } = req.params;
    if (curUser) {
      try {
        const userToFollow: any = await User.findOne({
          where: { name }
        });
        if (userToFollow.id === curUser) {
          throw next(new ErrorResponse('You can not unfollow yourself', 500));
        }
        await Following.destroy({
          where: {
            following: userToFollow.id,
            userId: curUser
          }
        });
        await Followers.destroy({
          where: {
            followerId: curUser,
            userId: userToFollow.id
          }
        });
        const userFound = User.findOne({
          where: {
            id: curUser
          },
          include: [
            {
              model: Followers,
              as: 'UserFollowers',
              include: [
                {
                  model: User,
                  as: 'followerDetails',
                  attributes: ['name']
                }
              ]
            },
            {
              model: Following,
              as: 'UserFollowings'
            }
          ]
        }).then((follow) => {
          return res.status(200).send({
            message: `You are unfollowing ${userToFollow.name}`,
            follow,
            curUser
          });
        });
      } catch (err) {
        throw next(new ErrorResponse('Something went wrong', 500));
      }
    } else {
      throw next(new ErrorResponse('You must be logged in to unfollow a user', 500));
    }
  }
);
