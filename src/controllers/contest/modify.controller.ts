import { ContestService } from '@/service/contest.service';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

/**
 * 공모전 수정 핸들러
 *
 * 클라이언트로부터 전달받은 수정 데이터를 기반으로 공모전 정보를 수정합니다.
 * 수정 결과(성공 여부 등)를 클라이언트에게 응답합니다.
 *
 * @function modContest
 * @date 2025/05/30
 * @author 한유리
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *        2025/05/30           한유리             신규작성  
 *
 * @param {Request} req - 요청 객체 (수정할 공모전 정보 포함)
 * @param {Response} res - 응답 객체 (수정 결과 반환)
 * @param {NextFunction} next - 오류 처리 미들웨어로 넘기는 함수
 */
export const modContest: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = ContestService.modContest();
    res.status(StatusCodes.OK).json({ data: data });
    return;
  } catch (err) {
    next(err);
  }
};
