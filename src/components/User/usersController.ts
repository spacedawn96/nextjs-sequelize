import { Request, Response, NextFunction, RequestHandler } from 'express';
import User from './user';
import sequelize from '../../config/db';
import ErrorResponse from '../../utils/errorHandle';
import asyncHandler from '../../middlewares/asyncHandler';

export const register: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const credentials = req.body;
    if (!credentials.name || !credentials.email) {
      return next(new ErrorResponse('name and email are required', 403));
    }

    const registeredEmail = await User.findOne({
      where: {
        email: credentials.email,
      },
      raw: true,
    });

    const registeredUserName = await User.findOne({
      where: {
        name: credentials.name,
      },
      raw: true,
    });

    if (registeredEmail) {
      throw next(
        new ErrorResponse(
          `email: ${
            credentials.email || credentials.name
          } is already registered`,
          403,
        ),
      );
    }
    if (registeredUserName) {
      throw next(
        new ErrorResponse(
          `name: ${credentials.name} is already registered`,
          403,
        ),
      );
    }

    try {
      sequelize.transaction(async (t) => {
        const user = await User.create(
          {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
          },
          { transaction: t },
        );
        const token = await user.getSignedJwtToken();
        return res.status(200).send({
          meta: {
            type: 'success',
            status: 200,
            message: `Email has been sent to ${req.body.email}, please activate your account`,
            token,
          },
          user,
        });
      });
    } catch (error) {
      throw next(new ErrorResponse('someting went to wrong', 500));
    }
  },
);

export const login: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const credentials = req.body;
    const user = await User.findOne({
      where: {
        email: credentials.email,
      },
    });
    if (!user) {
      throw next(
        new ErrorResponse(
          `this account ${credentials.username} is not yet registered`,
          403,
        ),
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
          token,
        },
        user,
      });
    } catch (e) {
      throw next(new ErrorResponse(`something went to wrong`, 500));
    }
  },
);
