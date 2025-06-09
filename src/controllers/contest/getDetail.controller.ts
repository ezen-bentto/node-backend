import { ERROR_CODES } from '@/constants/error.constant';
import { getContestDetailSchema } from '@/schemas/content.schema';
import { ContestService } from '@/service/contest.service';
import { AppError } from '@/utils/AppError';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

/**
 * 공모전 상세 정보 조회 핸들러
 *
 * 클라이언트로부터 쿼리 파라미터로 공모전 ID를 받아,
 * 해당 ID의 공모전 상세 정보를 조회한 뒤 응답으로 반환합니다.
 * 유효하지 않은 ID가 들어오면 400 Bad Request 에러를 반환합니다.
 *
 * @function getContestDetail
 * @date 2025/05/30
 * @author 한유리
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *        2025/05/30           한유리             신규작성
 *
 * @param {Request} req - 요청 객체 (쿼리로 공모전 ID 전달)
 * @param {Response} res - 응답 객체 (공모전 상세 정보 반환)
 * @param {NextFunction} next - 에러 처리용 next 함수
 */

export const getContestDetail: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // id 쿼리 파라미터 추출
    const { id } = req.query;
    const ip = req.ip; //string
    const contestId = parseInt(id as string, 10);
    const parsed = getContestDetailSchema.safeParse({id: contestId});

    if (!parsed.success || ip === undefined) {
      next(new AppError(StatusCodes.BAD_REQUEST, ERROR_CODES.VALIDATION_FAIL));
      return;
    }

    const data = await ContestService.getContestDetail({ id: contestId, ip:ip }); // or ...parsed.data
    data.writer_id = data.writer_id.toString();
    data.views = data.views.toString();

    // TODO: 커뮤니티 모집글
    
    res.status(StatusCodes.OK).json({ data: data });
    return;
  } catch (err) {
    next(err);
  }
};
