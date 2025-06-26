import { ERROR_CODES } from '@/constants/error.constant';
import { OK_UPDATE_COMMENT } from '@/constants/message.constant';
import { modContestSchema } from '@/schemas/content.schema';
import { ContestService } from '@/service/contest.service';
import { AppError } from '@/utils/AppError';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { parse } from 'path';

/**
 * 공모전 수정 핸들러
 *
 * 클라이언트로부터 전달받은 수정 데이터를 기반으로 공모전 정보를 수정합니다.
 * 수정 결과(성공 여부 등)를 클라이언트에게 응답합니다.
 *
 * @function modContest
 * @date 2025/06/09
 * @author 한유리
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *        2025/06/09           한유리             신규작성
 *
 * @param {Request} req - 요청 객체 (수정할 공모전 정보 포함)
 * @param {Response} res - 응답 객체 (수정 결과 반환)
 * @param {NextFunction} next - 오류 처리 미들웨어로 넘기는 함수
 */
export const modContest: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = modContestSchema.safeParse(req.body);

    if (!parsed.success) {
      next(new AppError(StatusCodes.BAD_REQUEST, ERROR_CODES.VALIDATION_FAIL));
      return;
    }

    const { id } = req.params;
    const contestId = parseInt(id as string, 10);

    if (isNaN(contestId)) {
      next(new AppError(StatusCodes.BAD_REQUEST, ERROR_CODES.VALIDATION_FAIL));
      return;
    }

    const existing = await ContestService.getContestById({ id: contestId });
    if (!existing) {
      next(new AppError(StatusCodes.NOT_FOUND, ERROR_CODES.NOT_FOUND));
      return;
    }

    // TODO: 로그인 id와 existing.witerId 비교

    await ContestService.modContest(contestId, parsed.data);
    console.log('여기는 컨트롤러입니다. 나온 값 나와주세요');

    res.status(StatusCodes.OK).json({ message: OK_UPDATE_COMMENT });
    return;
  } catch (err) {
    next(err);
  }
};
