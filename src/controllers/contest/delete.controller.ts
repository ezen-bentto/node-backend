import { ContestService } from '@/service/contest.service';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

export const remove: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = ContestService.remove();
    res.status(StatusCodes.OK).json({ data: data });
    return;
  } catch (err) {
    next(err);
  }
};
