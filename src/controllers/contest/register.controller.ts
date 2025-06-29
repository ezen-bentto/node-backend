import { ERROR_CODES } from '@/constants/error.constant';
import { regContestSchema } from '@/schemas/content.schema';
import { ContestService } from '@/service/contest.service';
import { AppError } from '@/utils/AppError';
import { Token } from '@/utils/token';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

/**
 * 공모전 등록 핸들러
 *
 * 클라이언트로부터 전달받은 공모전 정보를 검증하고, 유효한 경우 DB에 등록합니다.
 * 등록 성공 시 해당 공모전 데이터를 응답합니다.
 *
 * @function regContest
 * @date 2025/05/30
 * @author 한유리
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *        2025/05/30           한유리             신규작성
 *
 * @param {Request} req - 요청 객체 (등록할 공모전 정보가 포함된 body)
 * @param {Response} res - 응답 객체 (등록된 공모전 데이터 반환)
 * @param {NextFunction} next - 오류 처리 미들웨어로 넘기는 함수
 */

export const regContest: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = regContestSchema.safeParse(req.body);

  if (!parsed.success) {
    next(new AppError(StatusCodes.BAD_REQUEST, ERROR_CODES.VALIDATION_FAIL));
    return;
  }

  // header에서 토큰 추출
  const accessToken = req.headers.authorization?.split(' ')[1];
  if(!accessToken){
    next(new AppError(StatusCodes.BAD_REQUEST, ERROR_CODES.VALIDATION_FAIL));
    return;
  }

  // 토큰 검증 및 id 추출
  const { ok, payload } = Token.verifyAccessToken(accessToken);
  if(!ok || !payload){
    next(new AppError(StatusCodes.BAD_REQUEST, ERROR_CODES.VALIDATION_FAIL));
    return;
  }

  try {
    const data = ContestService.regContest(parsed.data);
    const id = (await data).insertId.toString();
    res.status(StatusCodes.OK).json({ data: id });
    return;
  } catch (err) {
    next(err);
  }
};
