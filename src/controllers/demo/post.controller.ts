import { ERROR_CODES } from '@/constants/error.constant';
import { BAD_REQUEST_VALUE, OK_JOIN } from '@/constants/message.constant';
import { DemoCreateSchema } from '@/schemas/demo.schema';
import { DemoService } from '@/service/demo.service';
import { AppError } from '@/utils/AppError';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const post = async (req: Request, res: Response, next: NextFunction) => {
  const parsed = DemoCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    // 조건절로 error 보낼땐 next
    next(new AppError(BAD_REQUEST_VALUE, StatusCodes.BAD_REQUEST, ERROR_CODES.VALIDATION_FAIL));
    return;
  }

  try {
    await DemoService.post(parsed.data);
    res.status(StatusCodes.CREATED).json({ message: OK_JOIN });
  } catch (err) {
    next(err);
  }
};
