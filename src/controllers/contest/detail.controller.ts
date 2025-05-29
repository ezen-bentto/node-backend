import { ERROR_CODES } from '@/constants/error.constant';
import { ContestSelectDetailSchema } from '@/schemas/content.schema';
import { ContestService } from '@/service/contest.service';
import { AppError } from '@/utils/AppError';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

export const detail: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // id 쿼리 파라미터 추출
    const { id } = req.query;
    const contestId = parseInt(id as string, 10);
    const parsed = ContestSelectDetailSchema.safeParse({id: contestId});

    if (!parsed.success) {
      next(new AppError(StatusCodes.BAD_REQUEST, ERROR_CODES.VALIDATION_FAIL));
      return;
    }

    // DB 조회 or 서비스 호출 부분
    const data = ContestService.detail(parsed.data);
    res.status(StatusCodes.OK).json({ data: parsed.data });
    return;
  } catch (err) {
    next(err);
  }
};
