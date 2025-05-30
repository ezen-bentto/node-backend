import { ERROR_CODES } from '@/constants/error.constant';
import { regContestSchema } from '@/schemas/content.schema';
import { ContestService } from '@/service/contest.service';
import { AppError } from '@/utils/AppError';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

/**
 *
 * 공모전 등록 페이지
 *
 * @function regContest
 * @date 2025/05/30
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/05/30           한유리             신규작성  
 * @param Request, Response, NextFunction
 */
export const regContest: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const parsed = regContestSchema.safeParse(req.body);

  if(!parsed.success){
    next(new AppError(StatusCodes.BAD_REQUEST, ERROR_CODES.VALIDATION_FAIL));
    return;
  }
  
  try {
    const data = ContestService.regContest(parsed.data);
    res.status(StatusCodes.OK).json({ data: data });
    return;
  } catch (err) {
    next(err);
  }
};
