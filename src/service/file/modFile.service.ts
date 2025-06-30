import { FileModel } from '@/models/file.model';
import { AppError } from '@/utils/AppError';
import { handleDbError } from '@/utils/handleDbError';
import { StatusCodes } from 'http-status-codes';

/**
 *
 * 파일 수정 서비스
 *
 * 클라이언트로부터 전달받은 파일 정보를 데이터베이스에 반영합니다.
 *
 * @function modFile
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
  id: number;
  reference_id: number;
  original_name: string;
  file_path: Buffer;
  mime_type?: string;
}

export const modFile = async (data: FileParams) => {
    try{
        if(data.file_path !== undefined){
            // buffer 검증
            if(!data.file_path || data.file_path.length === 0){
                throw new AppError(StatusCodes.BAD_REQUEST, '빈 파일입니다');
            }

            // mimeType 검증
            const mimeType = data.mime_type ?? 'application/octet-stream';
            const allowedTypes = ['image/png', 'image/jpeg', 'application/octet-stream'];
            
            if (!allowedTypes.includes(mimeType)) {
                throw new AppError(StatusCodes.BAD_REQUEST,`허용되지 않은 MIME 타입: ${mimeType}`);
            }
        }

        const res = await FileModel.modFile(data);
        return res;
    }catch (err: unknown) {
        console.error(err)
        handleDbError(err);
        throw err;
    }
}