import { Request, Response, NextFunction, RequestHandler } from 'express';
import ErrorResponse from '../../utils/errorHandle';
import asyncHandler from '../../middlewares/asyncHandler';
import sequelize from '../../db';
import User from '../User/user';
import Following from '../Following/following';
import Followers from './followers';
import {
  createFollow,
  destroyFollow,
  findUserByName,
  findUserFollowDetail
} from './followerService';

export const followUser: RequestHandler = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    let curUser: number;

    curUser = req.user.id;

    const { name } = req.params;

    if (curUser) {
      try {
        const userToFollow = await findUserByName(name);
        if (userToFollow!.id === curUser) {
          throw next(new ErrorResponse('You can not follow yourself', 500));
        }
        await createFollow(userToFollow, curUser);

        const userDetail = await findUserFollowDetail(userToFollow);
        return res.status(200).send({
          message: `You are now following ${userToFollow!.name}`,
          curUser,
          userDetail
        });
      } catch (err) {
        throw next(new ErrorResponse('Something went wrong', 500));
      }
    } else {
      throw next(
        new ErrorResponse('You must be logged in to follow a user', 500)
      );
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
        const userToFollow = await findUserByName(name);

        if (userToFollow!.id === curUser) {
          throw next(new ErrorResponse('You can not unfollow yourself', 500));
        }

        await destroyFollow(userToFollow, curUser);

        const userDetail = await findUserFollowDetail(userToFollow);

        return res.status(200).send({
          message: `You are unfollowing ${userToFollow!.name}`,
          curUser,
          userDetail
        });
      } catch (err) {
        throw next(new ErrorResponse('Something went wrong', 500));
      }
    } else {
      throw next(
        new ErrorResponse('You must be logged in to unfollow a user', 500)
      );
    }
  }
);
