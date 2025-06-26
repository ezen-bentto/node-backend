import { ERROR_CODES } from '@/constants/error.constant';
import { ContestModel } from '@/models/contest.model';
import { regBookmark as regBookmarkProps } from '@/schemas/content.schema';
import { InsertResult } from '@/types/db/response.type';
import { AppError } from '@/utils/AppError';
import { handleDbError } from '@/utils/handleDbError';
import { StatusCodes } from 'http-status-codes';

/**
 *
 * 공모전 북마크 등록 서비스
 *
 * 클라이언트로부터 전달받은 공모전 target_id, user_id 으로
 * 북마크 DB 에 저장
 * DB 조회해서 있으면 del_yn 컬럼 update
 * 없으면 새로 insert
 *
 * @function regBookmark
 * @date 2025/06/24
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/24           이철욱             신규작성
 * @param id - 공모전 id
 */
const regBookmark = async ({ target_id, user_id }: regBookmarkProps): Promise<InsertResult> => {
  try {
    const parsedTargetId = parseInt(target_id);
    const parsedUserId = parseInt(user_id);

    // 1. scrap 존재 여부 조회
    const existing = await ContestModel.isBookmark(parsedTargetId, parsedUserId);

    // 2. 있으면 del_yn 토글 업데이트
    if (existing) {
      const newDelYn = existing.del_yn === 'N' ? 'Y' : 'N';

      const updateRes = await ContestModel.modBookmark(parsedTargetId, parsedUserId, newDelYn);

      if (updateRes.affectedRows !== 1) {
        throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, ERROR_CODES.UPDATE_FAIL);
      }

      return updateRes;
    }

    // 3. 없으면 새로 insert
    const insertRes = await ContestModel.regBookmark(parsedTargetId, parsedUserId);

    if (insertRes.affectedRows !== 1) {
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, ERROR_CODES.INSERT_FAIL);
    }

    return insertRes;
  } catch (err: unknown) {
    handleDbError(err);
    throw err;
  }
};

export default regBookmark;
