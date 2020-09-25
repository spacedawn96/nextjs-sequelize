import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import ErrorResponse from '../utils/errorHandle';
const errorHandler: ErrorRequestHandler = (
  error: ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(error.statusCode ?? 500).json({
    meta: {
      code: error.statusCode,
      success: false,
      message: error.message ?? 'Server Error!',
    },
  });
};

export default errorHandler;
