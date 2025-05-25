import { ERROR_CODES } from '@/constants/error.constant';
import { INTERNAL_SERVER_ERROR } from '@/constants/message.constant';
import { DemoResponseSchema } from '@/schemas/demo.schema';
import { DemoService } from '@/service/demo.service';
import { AppError } from '@/utils/AppError';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

export const get: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await DemoService.get();
    const parsed = z.array(DemoResponseSchema).safeParse(data);
    if (!parsed.success) {
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
    }

    res.status(StatusCodes.OK).json({ data: parsed.data });
  } catch (err) {
    next(err);
  }
};
