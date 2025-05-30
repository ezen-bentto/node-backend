import { ERROR_CODES } from '@/constants/error.constant';
import { getContestDetailSchema } from '@/schemas/content.schema';
import { ContestService } from '@/service/contest.service';
import { AppError } from '@/utils/AppError';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

/**
 *
 * 공모전 상세 페이지
 *
 * @function getContestDetail
 * @date 2025/05/30
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/05/30           한유리              신규작성  
 * @param Request, Response, NextFunction
 */
export const getContestDetail: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // id 쿼리 파라미터 추출
    const { id } = req.query;
    const contestId = parseInt(id as string, 10);
    const parsed = getContestDetailSchema.safeParse({id: contestId});

    if (!parsed.success) {
      next(new AppError(StatusCodes.BAD_REQUEST, ERROR_CODES.VALIDATION_FAIL));
      return;
    }

    // DB 조회 or 서비스 호출 부분
    const data = ContestService.getContestDetail(parsed.data);
    res.status(StatusCodes.OK).json({ data: parsed.data });
    return;
  } catch (err) {
    next(err);
  }
};
