import { ERROR_CODES } from '@/constants/error.constant';
import { regBookSchema } from '@/schemas/content.schema';
import { ContestService } from '@/service/contest.service';
import { AppError } from '@/utils/AppError';
import { Token } from '@/utils/token';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

/**
 * 공모전 북마크 여부 핸들러
 *
 * @function getBookmark
 * @date 2025/06/24
 * @author 이철욱
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *        2025/06/25           이철욱             신규작성
 *
 * @param {Request} req - 요청 객체 (등록할 공모전 정보가 포함된 body)
 * @param {Response} res - 응답 객체 (등록된 공모전 데이터 반환)
 * @param {NextFunction} next - 오류 처리 미들웨어로 넘기는 함수
 */

const getBookmark = async (req: Request, res: Response, next: NextFunction) => {
  // 1. zod 스키마 검증
  const parsed = regBookSchema.safeParse({ target_id: req.params.target_id });

  if (!parsed.success) {
    next(new AppError(StatusCodes.BAD_REQUEST, ERROR_CODES.VALIDATION_FAIL));
    return;
  }

  try {
    // 서비스 호출
    const data = await ContestService.getBookmark({ target_id: parsed.data.target_id });
    const bookmarkCounter = data.toString();
    res.status(StatusCodes.OK).json({ data: bookmarkCounter });
  } catch (err) {
    next(err);
  }
};

export default getBookmark;
