import { Request, Response, NextFunction, RequestHandler } from 'express';
import ErrorResponse from '../../utils/errorHandle';
import asyncHandler from '../../middlewares/asyncHandler';
import {
  createUser,
  doesUserExist,
  editProfile,
  findUser,
  findUserAll,
  findUserDetail,
  findUserId
} from './userService';
import sequelize from '../../db';

export const register: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const credentials = req.body;
    if (!credentials.name || !credentials.email) {
      return next(new ErrorResponse('name and email are required', 403));
    }
    const UserExist = await doesUserExist(credentials);

    if (UserExist) {
      throw next(
        new ErrorResponse(
          `user: ${
            credentials.email || credentials.name
          } is already registered`,
          403
        )
      );
    }

    try {
      sequelize.transaction(async (t) => {
        const user = await createUser(credentials, t);
        const token = await user.getSignedJwtToken();

        return res.status(200).send({
          meta: {
            type: 'success',
            status: 200,
            message: `Email has been sent to ${req.body.email}, please activate your account`,
            token
          },
          user
        });
      });
    } catch (error) {
      throw next(new ErrorResponse('someting went to wrong', 500));
    }
  }
);

export const login: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const credentials = req.body;
    try {
      const user = await findUser(credentials);
      if (!user) {
        throw next(
          new ErrorResponse(
            `this account ${credentials.username} is not yet registered`,
            403
          )
        );
      }

      const [token, isMatched] = await Promise.all([
        [user.getSignedJwtToken(), user.matchPassword(credentials.password)]
      ]);

      if (!isMatched) {
        throw next(new ErrorResponse('invalid password', 403));
      }

      res.status(200).send({
        meta: {
          type: 'success',
          status: 200,
          message: 'Sucessfully Authenticated',
          token
        },
        user
      });
    } catch (e) {
      throw next(new ErrorResponse(`something went to wrong`, 500));
    }
  }
);

export const getProfile: RequestHandler = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const userId = req.user.id;

    const user = await findUserId(userId);

    if (!user) {
      throw next(new ErrorResponse(`No user found`, 404));
    }

    const name = req.params.name;

    const findUser = await findUserDetail(name);

    if (findUser) {
      findUser.UserFollowers.forEach((item: any) => {
        if (item.followerId === user) {
          findUser.setDataValue('isFollowing', true);
        } else if (item.followerId === user) {
          findUser.setDataValue('isFollowing', false);
        }
      });
      return res.status(200).send(findUser);
    } else {
      throw next(new ErrorResponse('User Not Found', 500));
    }
  }
);

export const getUsers: RequestHandler = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const users = await findUserAll();
    users.forEach((user) => {
      if (user.UserFollowings.length && user.UserFollowers.length === 0) {
        user.setDataValue('isFollowing', false);
      }
    });
    return res.json(users);
  }
);

export const updateProfile: RequestHandler = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const updateData = req.body.bio;

    try {
      const result = await sequelize.transaction(async (t) => {
        await Promise.all([
          editProfile(updateData, req.user.id, t),
          findUserId(req.user.id)
        ]);

        return res.status(200).send({
          message: 'Profile Updated Successfully',
          user: updateData
        });
      });
    } catch (err) {
      throw next(new ErrorResponse('Some Thing Went Wrong', 500));
    }
  }
);
