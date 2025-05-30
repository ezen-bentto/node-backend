import { ContestService } from '@/service/contest.service';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

/**
 * 공모전 목록 조회 핸들러
 *
 * 전체 공모전 목록 데이터를 조회하여 클라이언트에 반환합니다.
 * 향후 페이징 또는 필터링 기능이 추가될 수 있습니다.
 *
 * @function getContestList
 * @date 2025/05/30
 * @author 한유리
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *        2025/05/30           한유리             신규작성
 *
 * @param {Request} req - 요청 객체
 * @param {Response} res - 응답 객체 (공모전 목록 데이터 반환)
 * @param {NextFunction} next - 에러 처리용 next 함수
 */

export const getContestList: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await ContestService.getContestList();
    res.status(StatusCodes.OK).json({ data: data });
    return;
  } catch (err) {
    next(err);
  }
};
