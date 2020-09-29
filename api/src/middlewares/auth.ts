import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler';

import User from '../components/User/user';
import ErrorResponse from '../utils/errorHandle';

export const protect = asyncHandler(async (req: any, res: any, next: any) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorResponse('Not authorize to access this routerr', 401));
  }

  try {
    // Verify token
    const decoded: any = jwt.verify(token, process.env.SECRET_KEY!);

    const data: any = await User.findOne({ where: { id: decoded.id } });
    req.user = data.dataValues;
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorize', 401));
  }
});

export const authorize = (...roles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403)
      );
    }
    next();
  };
};
