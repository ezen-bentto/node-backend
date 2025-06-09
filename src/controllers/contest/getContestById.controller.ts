import { ERROR_CODES } from '@/constants/error.constant';
import { getContestDetailSchema } from '@/schemas/content.schema';
import { ContestService } from '@/service/contest.service';
import { AppError } from '@/utils/AppError';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

/**
 * 공모전 상세 정보 수정 조회 핸들러
 *
 * 클라이언트로부터 쿼리 파라미터로 공모전 ID를 받아,
 * 해당 ID의 공모전 상세 정보를 조회한 뒤 응답으로 반환합니다.
 * 유효하지 않은 ID가 들어오면 400 Bad Request 에러를 반환합니다.
 *
 * @function getContestDetailEdit
 * @date 2025/06/09
 * @author 한유리
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *        2025/06/09           한유리             신규작성
 *
 * @param {Request} req - 요청 객체 (쿼리로 공모전 ID 전달)
 * @param {Response} res - 응답 객체 (공모전 상세 정보 반환)
 * @param {NextFunction} next - 에러 처리용 next 함수
 */

export const getContestById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.query;
    const contestId = parseInt(id as string, 10);
    const parsed = getContestDetailSchema.safeParse({id: contestId});

    if (!parsed.success) {
      next(new AppError(StatusCodes.BAD_REQUEST, ERROR_CODES.VALIDATION_FAIL));
      return;
    }

    const data = await ContestService.getContestById({ id: contestId });
    data.writer_id = data.writer_id.toString();
    
    res.status(StatusCodes.OK).json({ data: data });
    return;
  } catch (err) {
    next(err);
  }
};
