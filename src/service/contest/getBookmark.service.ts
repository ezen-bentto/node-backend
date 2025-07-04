import { ContestModel } from '@/models/contest.model';
import { regBookmark as regBookmarkProps } from '@/schemas/content.schema';
import { handleDbError } from '@/utils/handleDbError';

/**
 *
 * 공모전 북마크 조회 서비스
 *
 * 1. 내가 북마크 했는지 안했는지 여부
 * 2. 해당 게시물 북마크 갯수
 * 이것들을 묶어서 쏴주기
 *
 * @function getBookmark
 * @date 2025/06/25
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/25           이철욱             신규작성
 * @param id - 공모전 id
 */
const getBookmark = async ({ target_id }: { target_id: string }) => {
  try {
    const parsedTargetId = parseInt(target_id);

    // 2. 해당 공모전 북마크 수
    const countResponse = await ContestModel.getBookmark(parsedTargetId);
    const bookmarkCount: number = countResponse?.cnt ?? 0;

    return bookmarkCount;
  } catch (err: unknown) {
    handleDbError(err);
    throw err;
  }
};

export default getBookmark;
