import { ContestService } from '@/service/contest.service';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

/**
 *
 * 공모전 리스트 페이지
 *
 * @function getContestList
 * @date 2025/05/30
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/05/30           한유리             신규작성  
 * @param Request, Response, NextFunction
 */
export const getContestList: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = ContestService.getContestList();
    res.status(StatusCodes.OK).json({ data: data });
    return;
  } catch (err) {
    next(err);
  }
};
