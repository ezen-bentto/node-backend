import { ERROR_CODES } from '@/constants/error.constant';
import { ContestCreateSchema } from '@/schemas/content.schema';
import { ContestService } from '@/service/contest.service';
import { AppError } from '@/utils/AppError';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

export const create: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const parsed = ContestCreateSchema.safeParse(req.body);

  if(!parsed.success){
    next(new AppError(StatusCodes.BAD_REQUEST, ERROR_CODES.VALIDATION_FAIL));
    return;
  }
  
  try {
    const data = ContestService.create(parsed.data);
    res.status(StatusCodes.OK).json({ data: data });
    return;
  } catch (err) {
    next(err);
  }
};
