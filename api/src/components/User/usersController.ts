import { Request, Response, NextFunction, RequestHandler } from 'express';
import ErrorResponse from '../../utils/errorHandle';
import asyncHandler from '../../middlewares/asyncHandler';
import { createUser, doesUserExist, findUser } from './userService';
import db from '../../config/db';

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
          `user: ${credentials.email || credentials.name} is already registered`,
          403
        )
      );
    }

    try {
      db.transaction(async (t) => {
        const user = await createUser(credentials);
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
    const user = await findUser(credentials);
    if (!user) {
      throw next(
        new ErrorResponse(`this account ${credentials.username} is not yet registered`, 403)
      );
    }

    const token = await user.getSignedJwtToken();

    const isMatched = await user.matchPassword(credentials.password);

    if (!isMatched) {
      throw next(new ErrorResponse('invalid password', 403));
    }

    try {
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
