// notFoundHandler.ts
import { INTERNAL_SERVER_ERROR } from '@/constants/message.constant';
import { AppError } from '@/utils/AppError';
import { Request, Response, NextFunction } from 'express';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: getReasonPhrase(err.statusCode),
      message: err.message,
    });
    return;
  }

  console.error('🚨', err);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    message: INTERNAL_SERVER_ERROR,
  });
};
