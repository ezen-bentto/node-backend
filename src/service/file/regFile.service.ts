//node-backend\src\service\file\regFile.service.ts
import { FileModel } from '@/models/file.model';
import { AppError } from '@/utils/AppError';
import { handleDbError } from '@/utils/handleDbError';
import { StatusCodes } from 'http-status-codes';
import path from 'path';

/**
 *
 * 파일 등록 서비스
 *
 * 클라이언트로부터 전달받은 파일 정보를
 * 데이터베이스에 저장하고, 저장 결과를 반환합니다.
 *
 * @function regFile
 * @date 2025/06/27
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/27           한유리             신규작성
 * @param data - 공모전 등록에 필요한 데이터 객체
 */

export interface FileParams {
  reference_id: number;
  reference_type: number;
  original_name: string;
  file_path: Buffer;
  mime_type?: string;
}

export const regFile = async (data: FileParams) => {
  try {
    // buffer 검증
    if (!data.file_path || data.file_path.length === 0) {
      throw new AppError(StatusCodes.BAD_REQUEST, '빈 파일입니다');
    }

    // mimeType 검증
    const mimeType = data.mime_type ?? 'application/octet-stream';
    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/gif',
      'image/webp',
      'application/octet-stream',
    ];
    if (!allowedTypes.includes(mimeType)) {
      throw new AppError(StatusCodes.BAD_REQUEST, `허용되지 않은 MIME 타입: ${mimeType}`);
    }

    // DB에 파일 정보 저장
    await FileModel.regFile(data);

    // 파일이 웹에서 접근 가능한 URL을 생성
    // file.routes.ts의 /view/:reference_type/:reference_id 경로와 일치
    const fileUrl = `/api/file/view/${data.reference_type}/${data.reference_id}`;

    // DB 저장 결과 대신 생성된 fileUrl을 객체에 담아 반환
    return { fileUrl };

  } catch (err: unknown) {
    console.error(err);
    handleDbError(err);
    throw err;
  }
};
