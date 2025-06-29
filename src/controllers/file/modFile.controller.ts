import { ERROR_CODES } from '@/constants/error.constant';
import { FileService } from '@/service/file.service';
import { AppError } from '@/utils/AppError';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

/**
 * 파일 등록 핸들러
 *
 * 클라이언트로부터 전달받은 파일 정보를 검증하고, 유효한 경우 DB에 등록합니다.
 * 수정 성공 시 해당 파일 데이터를 응답합니다.
 *
 * @function modFile
 * @date 2025/06/29
 * @author 한유리
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *        2025/06/29           한유리             신규작성
 *
 * @param {Request} req - 요청 객체 (등록할 공모전 정보가 포함된 body)
 * @param {Response} res - 응답 객체 (등록된 공모전 데이터 반환)
 * @param {NextFunction} next - 오류 처리 미들웨어로 넘기는 함수
 */

export const modFile: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const id = parseInt(req.params.id);

    // multer로 파일 추출
    const file = req.file;
    if (!file) {
      next(new AppError(StatusCodes.BAD_REQUEST, ERROR_CODES.VALIDATION_FAIL));
      return;
    }

    const data = await FileService.modFile({
      id: id,
      reference_id: Number(req.body.id),
      original_name: req.body.article,
      file_path: file.buffer,
      mime_type: file.mimetype,
    });
    res.status(StatusCodes.OK).json({ message: '이미지 수정 성공' });
    return;
  } catch (err) {
    next(err);
  }
};
