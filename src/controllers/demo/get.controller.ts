import { ERROR_CODES } from '@/constants/error.constant';
import { INTERNAL_SERVER_ERROR } from '@/constants/message.constant';
import { DemoResponseSchema } from '@/schemas/demo.schema';
import { DemoService } from '@/service/demo.service';
import { AppError } from '@/utils/AppError';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { client } from '@/config/redis.config'

export const get: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await client.v4.set('key', 'test');
    const value = await client.v4.get('key');

    res.status(200).json({
      message: 'Value stored in Redis',
      value,
    });
  } catch (err) {
    next(err);
  }
};
