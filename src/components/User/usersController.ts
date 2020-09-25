import { Request, Response, NextFunction, RequestHandler } from 'express';
import crypto from 'crypto';
import asyncHandler from 'src/middlewares/asyncHandler';
import User from './user';

export const register: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, role } = req.body;
    const user: any = await User.create({ name, email, password, role });
    const token = user.getSignedJwtToken();
    return res.status(200).json({ success: true, token });
  },
);
