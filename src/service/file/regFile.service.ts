import { FileModel } from '@/models/file.model';
import { AppError } from '@/utils/AppError';
import { handleDbError } from '@/utils/handleDbError';
import { StatusCodes } from 'http-status-codes';
import sharp from 'sharp';

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

    // sharp 적용: 800px 리사이즈, WebP 변환, 압축
    const optimizedBuffer = await sharp(data.file_path)
      .resize({ width: 800, withoutEnlargement: true }) // 원본보다 크면 그대로
      .webp({ quality: 75 }) // WebP 압축 품질 설정
      .toBuffer();

    // optimizedBuffer를 넣어서 새로운 FileParams 객체 생성
    const fileData: FileParams = {
      ...data,
      file_path: optimizedBuffer,
      mime_type: 'image/webp', // sharp으로 webp로 변환했으므로
    };

    const res = await FileModel.regFile(fileData);
    return res;
  } catch (err: unknown) {
    console.error(err);
    handleDbError(err);
    throw err;
  }
};
