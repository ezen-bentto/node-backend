import { NextFunction, Request, RequestHandler, Response } from 'express';

import { client } from '@/config/redis.config';

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
