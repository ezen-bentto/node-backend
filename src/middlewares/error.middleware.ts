import { AppError } from '@/utils/AppError';
import { Request, Response, NextFunction } from 'express';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: getReasonPhrase(err.statusCode),
    });
    return;
  }

  console.error('🚨', err);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
  });
};
