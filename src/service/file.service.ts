import { FileModel } from '@/models/file.model';
import { modFile } from './file/modContestFile.service';
import { regFile } from './file/regContestFile.service';
import updateReferenceId from './file/updateReferenceId.service';
import { handleDbError } from '@/utils/handleDbError';
import { AppError } from '@/utils/AppError';
import { StatusCodes } from 'http-status-codes';
/**
 *
 * 파일 서비스 모음
 *
 * @function FileService
 * @date 2025/06/27
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/27           한유리              신규작성
 * @param 없음
 */

//reference 정보로 파일을 조회하는 서비스
const getFileByReference = async (reference_id: number, reference_type: number) => {
  try {
    const fileData = await FileModel.findByReference(reference_id, reference_type);
    if (!fileData) {
      // 파일이 없을 경우 404 에러
      throw new AppError(StatusCodes.NOT_FOUND, '파일을 찾을 수 없습니다.');
    }
    return fileData;
  } catch (err) {
    handleDbError(err);
    throw err;
  }
};

export const FileService = {
  regFile,
  updateReferenceId,
  modFile,
  getFileByReference,
};
