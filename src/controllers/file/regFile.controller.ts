import { ERROR_CODES } from '@/constants/error.constant';
import { regContestSchema } from '@/schemas/content.schema';
import { FileService } from '@/service/file.service';
import { AppError } from '@/utils/AppError';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

/**
 * URL 경로의 문자열 타입(예: 'profile')을 DB의 숫자 reference_type으로 변환하는 헬퍼 함수
 * @param type - URL 파라미터로 받은 타입 문자열 (contest, community, profile 등)
 */
const typeToRefType = (type: string): number => {
  const map: { [key: string]: number } = {
    contest: 1,
    community: 2,
    profile: 3,
  };
  return map[type] || 0; // 매핑되지 않은 타입은 0 또는 에러 처리
};

/**
 * 파일 등록 핸들러
 *
 * 클라이언트로부터 전달받은 파일 정보를 검증하고, 유효한 경우 DB에 등록합니다.
 * 등록 성공 시 해당 파일 데이터를 응답합니다.
 *
 * @function regFile
 * @date 2025/06/27
 * @author 한유리
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *        2025/06/27           한유리             신규작성
 *
 * @param {Request} req - 요청 객체 (등록할 공모전 정보가 포함된 body)
 * @param {Response} res - 응답 객체 (등록된 공모전 데이터 반환)
 * @param {NextFunction} next - 오류 처리 미들웨어로 넘기는 함수
 */

export const regFile: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. multer로 파일 추출
    const file = req.file;
    if (!file) {
      return next(new AppError(StatusCodes.BAD_REQUEST, ERROR_CODES.VALIDATION_FAIL));
    }

    if (!req.user || !req.user.id) {
      return next(new AppError(StatusCodes.UNAUTHORIZED, '인증 정보가 없습니다.'));
    }

    // 2. 요청(req)에서 동적으로 정보를 가져오도록 수정
    const userId = req.user.id; // authMiddleware를 통해 들어온 사용자 ID
    const type = req.params.type; // 라우트의 :type 파라미터 (예: "profile")
    const referenceIdFromBody = req.body.id; // 공모전 등 다른 ID가 body에 올 경우

    // 3. reference_id와 reference_type을 동적으로 결정
    // type이 'profile'이면 reference_id는 userId가 되고, 그렇지 않으면 body에서 온 id를 사용
    const reference_id = type === 'profile' ? Number(userId) : Number(referenceIdFromBody);
    const reference_type = typeToRefType(type);

    if (reference_type === 0) {
      return next(new AppError(StatusCodes.BAD_REQUEST, '알 수 없는 파일 타입입니다.'));
    }

    // 4. FileService 호출
    const result = await FileService.regFile({
      reference_id: reference_id,
      reference_type: reference_type,
      original_name: file.originalname,
      file_path: file.buffer,
      mime_type: file.mimetype,
    });

    // 5. 프론트엔드에 성공 메시지와 함께 이미지 URL을 반환
    res.status(StatusCodes.OK).json({
      success: true,
      message: '업로드 성공',
      data: {
        imageUrl: result.fileUrl,
      },
    });
  } catch (err) {
    next(err);
  }
};
