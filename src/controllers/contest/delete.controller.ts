import { ERROR_CODES } from '@/constants/error.constant';
import { delContestSchema } from '@/schemas/content.schema';
import { ContestService } from '@/service/contest.service';
import { AppError } from '@/utils/AppError';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

/**
 * 공모전 삭제 처리 핸들러
 *
 * 클라이언트로부터 삭제 요청을 받아 공모전 데이터를 삭제하고
 * 결과를 JSON 형태로 반환합니다.
 *
 * @function delContest
 * @date 2025/05/30
 * @author 한유리
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *        2025/05/30           한유리             신규작성
 *
 * @param {Request} req - 요청 객체 (삭제할 공모전 ID가 포함됨)
 * @param {Response} res - 응답 객체 (삭제 결과 반환)
 * @param {NextFunction} next - 에러 핸들러 호출 함수
 */
export const delContest : RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.query;
    const contestId = parseInt(id as string, 10);
    const parsed = delContestSchema.safeParse({id: contestId});

    if(!parsed.success){
      next(new AppError(StatusCodes.BAD_REQUEST, ERROR_CODES.VALIDATION_FAIL));
      return;
    }

    // TODO: 로그인 id와 witerId 비교

    const data = ContestService.delContest({id: contestId});
    res.status(StatusCodes.OK).json({ data: data });
    return;
  } catch (err) {
    next(err);
  }
};
